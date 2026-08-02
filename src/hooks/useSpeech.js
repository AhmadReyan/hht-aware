import { useCallback, useEffect, useRef, useState } from 'react';
import { haptics } from './useHaptics';
import { AI_WORKER_URL } from '../lib/aiConfig';

/**
 * useSpeech — AURA's voice layer (no npm deps).
 *
 * NEURAL-FIRST via the app's Cloudflare Worker:
 *  - speak(text): POST /tts -> MeloTTS neural voice (WAV), played via <audio>.
 *    Retries once (MeloTTS cold-starts can 502) and falls back to the browser's
 *    speechSynthesis so AURA always speaks.
 *  - startListening(): records the mic (MediaRecorder) -> POST /stt -> Whisper
 *    transcript. This works where the browser SpeechRecognition API doesn't
 *    (e.g. Android WebView). Falls back to browser SpeechRecognition when
 *    MediaRecorder/getUserMedia or the Worker isn't available.
 *
 * PRIVACY: only the spoken audio for a GENERAL HHT question is sent to the same
 * Worker; the transcript is treated exactly like a typed question. No audio is
 * stored. AURA is educational only ("not medical advice").
 *
 * Everything is feature-detected, guarded, and cleaned up on unmount.
 */

const hasWindow = typeof window !== 'undefined';
const SpeechRecognitionCtor = hasWindow ? window.SpeechRecognition || window.webkitSpeechRecognition : null;
const synth = hasWindow && 'speechSynthesis' in window ? window.speechSynthesis : null;
const mediaSupported = hasWindow
  && typeof navigator !== 'undefined'
  && !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
  && typeof window.MediaRecorder !== 'undefined';

const workerConfigured = typeof AI_WORKER_URL === 'string' && /^https?:\/\//.test(AI_WORKER_URL);
const TTS_URL = workerConfigured ? `${AI_WORKER_URL.replace(/\/$/, '')}/tts` : '';
const STT_URL = workerConfigured ? `${AI_WORKER_URL.replace(/\/$/, '')}/stt` : '';

// Mic works if we can record + reach the Worker (Whisper) OR the browser has STT.
const STT_SUPPORTED = (mediaSupported && workerConfigured) || !!SpeechRecognitionCtor;
// AURA can speak if the Worker (neural) OR the browser synth is available.
const TTS_SUPPORTED = workerConfigured || !!synth;

// ---- Persisted "AURA speaks" preference (guarded localStorage) ------------
const VOICE_KEY = 'hht_aura_voice_v1';
export const readVoicePref = () => {
  try { return localStorage.getItem(VOICE_KEY) === '1'; } catch { return false; }
};
export const writeVoicePref = (on) => {
  try { localStorage.setItem(VOICE_KEY, on ? '1' : '0'); } catch { /* ignore */ }
};

// Strip markdown/emoji so the spoken audio is clean.
const cleanForSpeech = (text) =>
  String(text || '')
    .replace(/[*_`#>~]/g, '')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();

export const useSpeech = () => {
  const [listening, setListening] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const recognitionRef = useRef(null); // browser STT (fallback)
  const listeningRef = useRef(false);
  const onFinalRef = useRef(null);
  const audioRef = useRef(null); // neural TTS <audio>
  const mediaRef = useRef(null); // { recorder, stream, chunks, timer }
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // ---- Browser STT recognizer (fallback path) -----------------------------
  useEffect(() => {
    if (!SpeechRecognitionCtor) return undefined;
    let recognition;
    try {
      recognition = new SpeechRecognitionCtor();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognition.onresult = (event) => {
        try {
          let interim = '';
          let final = '';
          for (let i = event.resultIndex; i < event.results.length; i += 1) {
            const r = event.results[i];
            const t = (r[0] && r[0].transcript) || '';
            if (r.isFinal) final += t; else interim += t;
          }
          if (interim) setInterimText(interim);
          if (final) {
            const text = final.trim();
            setInterimText(text);
            const cb = onFinalRef.current;
            if (cb && text) cb(text);
            try { recognition.stop(); } catch { /* no-op */ }
          }
        } catch { /* never throw */ }
      };
      recognition.onerror = (event) => {
        const err = event && event.error;
        if (err === 'not-allowed' || err === 'service-not-allowed') {
          setPermissionDenied(true);
          haptics.warning();
        }
        listeningRef.current = false;
        setListening(false);
      };
      recognition.onend = () => {
        listeningRef.current = false;
        setListening(false);
        setInterimText('');
      };
      recognitionRef.current = recognition;
    } catch {
      recognitionRef.current = null;
    }
    return () => {
      try { recognition && recognition.abort(); } catch { /* no-op */ }
      recognitionRef.current = null;
    };
  }, []);

  // ---- TTS: a queue so streamed sentences play back-to-back in order ------
  const queueRef = useRef([]);
  const playingRef = useRef(false);
  const stoppedRef = useRef(false);

  const stopSpeaking = useCallback(() => {
    stoppedRef.current = true;
    queueRef.current = [];
    try { if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; } } catch { /* no-op */ }
    try { if (synth) synth.cancel(); } catch { /* no-op */ }
    setSpeaking(false);
  }, []);

  // Speak one chunk with the browser voice; resolves when it finishes.
  const speakBrowserAwait = useCallback((clean) => new Promise((resolve) => {
    if (!synth) { resolve(); return; }
    try {
      const u = new SpeechSynthesisUtterance(clean);
      u.rate = 1; u.pitch = 1; u.lang = 'en-US';
      u.onend = () => resolve();
      u.onerror = () => resolve();
      synth.speak(u);
    } catch { resolve(); }
  }), []);

  // Fetch neural audio (Worker) for one chunk; retry once for cold-start 502.
  const fetchNeuralAudio = useCallback(async (clean) => {
    if (!TTS_URL) return null;
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        const res = await fetch(TTS_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: clean.slice(0, 1200) }),
        });
        const ct = (res.headers.get('content-type') || '').toLowerCase();
        if (res.ok && ct.includes('audio')) {
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          const audio = new Audio(url);
          audio.dataset.blobUrl = url;
          return audio;
        }
      } catch { /* retry / give up */ }
    }
    return null;
  }, []);

  // Play an <audio>; resolves true if it played, false if it was blocked/failed.
  const playAudio = useCallback((audio) => new Promise((resolve) => {
    audioRef.current = audio;
    const cleanup = () => { try { if (audio.dataset.blobUrl) URL.revokeObjectURL(audio.dataset.blobUrl); } catch { /* no-op */ } };
    audio.onended = () => { cleanup(); resolve(true); };
    audio.onerror = () => { cleanup(); resolve(false); };
    audio.play().catch(() => { cleanup(); resolve(false); });
  }), []);

  const processQueue = useCallback(async () => {
    if (playingRef.current) return;
    playingRef.current = true;
    setSpeaking(true);
    while (queueRef.current.length && !stoppedRef.current) {
      const clean = queueRef.current.shift();
      const audio = await fetchNeuralAudio(clean);
      if (stoppedRef.current) break;
      if (audio) {
        const played = await playAudio(audio);
        if (!played && !stoppedRef.current) await speakBrowserAwait(clean);
      } else if (!stoppedRef.current) {
        await speakBrowserAwait(clean);
      }
    }
    playingRef.current = false;
    if (!queueRef.current.length) setSpeaking(false);
  }, [fetchNeuralAudio, playAudio, speakBrowserAwait]);

  // Enqueue a sentence/answer. Call repeatedly for streamed sentences.
  const speak = useCallback((text) => {
    const clean = cleanForSpeech(text);
    if (!clean) return;
    stoppedRef.current = false;
    queueRef.current.push(clean);
    processQueue();
  }, [processQueue]);

  // ---- STT via MediaRecorder -> Worker (Whisper) --------------------------
  const startBrowserListening = useCallback((onFinalText) => {
    const recognition = recognitionRef.current;
    if (!recognition || listeningRef.current) return;
    onFinalRef.current = typeof onFinalText === 'function' ? onFinalText : null;
    setPermissionDenied(false);
    setInterimText('');
    listeningRef.current = true;
    setListening(true);
    haptics.tap();
    try { recognition.start(); } catch { listeningRef.current = false; setListening(false); }
  }, []);

  const startListening = useCallback(async (onFinalText) => {
    if (listeningRef.current || transcribing) return;
    onFinalRef.current = typeof onFinalText === 'function' ? onFinalText : null;

    if (mediaSupported && STT_URL) {
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch {
        setPermissionDenied(true);
        haptics.warning();
        return;
      }
      try {
        const recorder = new MediaRecorder(stream);
        const chunks = [];
        recorder.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data); };
        recorder.onstop = async () => {
          const mm = mediaRef.current;
          if (mm) {
            try { if (mm.vadRaf) cancelAnimationFrame(mm.vadRaf); } catch { /* no-op */ }
            try { if (mm.audioCtx) mm.audioCtx.close(); } catch { /* no-op */ }
            try { if (mm.timer) clearTimeout(mm.timer); } catch { /* no-op */ }
          }
          try { stream.getTracks().forEach((t) => t.stop()); } catch { /* no-op */ }
          listeningRef.current = false;
          setListening(false);
          const blob = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' });
          if (blob.size < 800) return; // nothing captured
          setTranscribing(true);
          try {
            const res = await fetch(STT_URL, {
              method: 'POST',
              headers: { 'Content-Type': blob.type || 'audio/webm' },
              body: blob,
            });
            const data = await res.json();
            if (mountedRef.current && data && data.ok && data.text) {
              const cb = onFinalRef.current;
              if (cb) cb(String(data.text).trim());
            }
          } catch { /* transcription failed -> silent */ }
          if (mountedRef.current) setTranscribing(false);
        };
        mediaRef.current = { recorder, stream };
        recorder.start();
        listeningRef.current = true;
        setListening(true);
        setPermissionDenied(false);
        haptics.tap();

        // Voice-activity detection: once the user has spoken, auto-stop ~1.2s
        // after they go quiet — no need to tap stop. Falls back to the 12s timer.
        try {
          const AC = window.AudioContext || window.webkitAudioContext;
          const audioCtx = new AC();
          const source = audioCtx.createMediaStreamSource(stream);
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 512;
          source.connect(analyser);
          const buf = new Uint8Array(analyser.fftSize);
          const SILENCE_MS = 1200;
          const THRESHOLD = 0.02;
          let spoke = false;
          let lastVoice = performance.now();
          const tick = () => {
            if (!mediaRef.current || mediaRef.current.recorder !== recorder) return;
            analyser.getByteTimeDomainData(buf);
            let sum = 0;
            for (let i = 0; i < buf.length; i += 1) {
              const v = (buf[i] - 128) / 128;
              sum += v * v;
            }
            const rms = Math.sqrt(sum / buf.length);
            const now = performance.now();
            if (rms > THRESHOLD) { spoke = true; lastVoice = now; }
            if (spoke && now - lastVoice > SILENCE_MS) {
              try { if (recorder.state === 'recording') recorder.stop(); } catch { /* no-op */ }
              return;
            }
            mediaRef.current.vadRaf = requestAnimationFrame(tick);
          };
          mediaRef.current.audioCtx = audioCtx;
          mediaRef.current.vadRaf = requestAnimationFrame(tick);
        } catch {
          /* no Web Audio -> manual tap or the 12s safety timer stops it */
        }

        // Safety auto-stop after 12s of total recording.
        mediaRef.current.timer = setTimeout(() => {
          try { if (recorder.state === 'recording') recorder.stop(); } catch { /* no-op */ }
        }, 12000);
      } catch {
        try { stream.getTracks().forEach((t) => t.stop()); } catch { /* no-op */ }
        // Fall back to browser recognizer if we have one.
        if (SpeechRecognitionCtor) startBrowserListening(onFinalText);
      }
      return;
    }

    // No MediaRecorder/Worker -> browser recognizer.
    startBrowserListening(onFinalText);
  }, [transcribing, startBrowserListening]);

  const stopListening = useCallback(() => {
    const m = mediaRef.current;
    if (m && m.recorder) {
      try { if (m.timer) clearTimeout(m.timer); } catch { /* no-op */ }
      try { if (m.recorder.state === 'recording') m.recorder.stop(); } catch { /* no-op */ }
      return;
    }
    const recognition = recognitionRef.current;
    if (recognition) {
      try { recognition.stop(); } catch { /* no-op */ }
    }
  }, []);

  // ---- Cleanup on unmount -------------------------------------------------
  useEffect(() => () => {
    stoppedRef.current = true;
    queueRef.current = [];
    try { if (recognitionRef.current) recognitionRef.current.abort(); } catch { /* no-op */ }
    try { if (synth) synth.cancel(); } catch { /* no-op */ }
    try { if (audioRef.current) audioRef.current.pause(); } catch { /* no-op */ }
    const m = mediaRef.current;
    if (m) {
      try { if (m.timer) clearTimeout(m.timer); } catch { /* no-op */ }
      try { if (m.vadRaf) cancelAnimationFrame(m.vadRaf); } catch { /* no-op */ }
      try { if (m.audioCtx) m.audioCtx.close(); } catch { /* no-op */ }
      try { if (m.recorder && m.recorder.state === 'recording') m.recorder.stop(); } catch { /* no-op */ }
      try { if (m.stream) m.stream.getTracks().forEach((t) => t.stop()); } catch { /* no-op */ }
    }
  }, []);

  return {
    // STT
    sttSupported: STT_SUPPORTED,
    listening,
    transcribing,
    interimText,
    permissionDenied,
    startListening,
    stopListening,
    // TTS
    ttsSupported: TTS_SUPPORTED,
    speaking,
    speak,
    stopSpeaking,
  };
};

export default useSpeech;
