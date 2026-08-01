import { useCallback, useEffect, useRef, useState } from 'react';
import { haptics } from './useHaptics';

/**
 * useSpeech — guarded Web Speech API layer for AURA (no npm deps).
 *
 * PRIVACY: STT produces TEXT only; that text goes to the same Cloudflare
 * Worker as a typed question. We NEVER store or upload raw audio. Note that
 * browser STT (e.g. Chrome) may transcribe via the browser vendor's own cloud
 * speech service — that is the platform's behaviour, outside this app. AURA is
 * educational only and already labelled "not medical advice".
 *
 * Everything here is feature-detected and cleaned up on unmount; every method
 * early-returns when the underlying API is missing, so callers never need to
 * branch defensively. On unsupported platforms (e.g. most Android System
 * WebViews for STT) the hook is a safe no-op and the mic UI simply won't render.
 */

// STT: standard + webkit-prefixed (Chrome/Edge/Safari). Undefined in most
// Android System WebViews and some desktop browsers -> STT_SUPPORTED = false.
const SpeechRecognitionCtor =
  typeof window !== 'undefined'
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;

// TTS: widely available incl. Android WebView. Guard for absence anyway.
const synth =
  typeof window !== 'undefined' && 'speechSynthesis' in window
    ? window.speechSynthesis
    : null;

const STT_SUPPORTED = !!SpeechRecognitionCtor;
const TTS_SUPPORTED = !!synth;

// ---- Persisted "AURA speaks" preference (guarded localStorage) ------------
const VOICE_KEY = 'hht_aura_voice_v1';

export const readVoicePref = () => {
  try {
    return localStorage.getItem(VOICE_KEY) === '1';
  } catch {
    return false;
  }
};

export const writeVoicePref = (on) => {
  try {
    localStorage.setItem(VOICE_KEY, on ? '1' : '0');
  } catch {
    /* private mode / quota — ignore */
  }
};

// Lightly strip markdown/emoji so the spoken audio is cleaner.
const cleanForSpeech = (text) =>
  String(text || '')
    .replace(/[*_`#>~]/g, '')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();

export const useSpeech = () => {
  const [listening, setListening] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const recognitionRef = useRef(null);
  const listeningRef = useRef(false);
  const onFinalRef = useRef(null);
  const utteranceRef = useRef(null);

  // ---- STT: build the recognition instance once (if supported) ------------
  useEffect(() => {
    if (!STT_SUPPORTED) return undefined;

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
            const result = event.results[i];
            const transcript = result[0]?.transcript || '';
            if (result.isFinal) final += transcript;
            else interim += transcript;
          }
          if (interim) setInterimText(interim);
          if (final) {
            const text = final.trim();
            setInterimText(text);
            const cb = onFinalRef.current;
            if (cb && text) cb(text);
            try {
              recognition.stop();
            } catch {
              /* no-op */
            }
          }
        } catch {
          /* never throw from a handler */
        }
      };

      recognition.onerror = (event) => {
        const err = event?.error;
        if (err === 'not-allowed' || err === 'service-not-allowed') {
          setPermissionDenied(true);
          haptics.warning();
        }
        // 'no-speech' | 'aborted' | 'network' | others -> reset silently.
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
      try {
        recognition?.abort();
      } catch {
        /* no-op */
      }
      recognitionRef.current = null;
    };
  }, []);

  // ---- TTS + STT cleanup on unmount ---------------------------------------
  useEffect(
    () => () => {
      try {
        recognitionRef.current?.abort();
      } catch {
        /* no-op */
      }
      try {
        synth?.cancel();
      } catch {
        /* no-op */
      }
    },
    [],
  );

  const startListening = useCallback((onFinalText) => {
    if (!STT_SUPPORTED || listeningRef.current) return;
    const recognition = recognitionRef.current;
    if (!recognition) return;

    onFinalRef.current = typeof onFinalText === 'function' ? onFinalText : null;
    setPermissionDenied(false);
    setInterimText('');
    listeningRef.current = true;
    setListening(true);
    haptics.tap();

    try {
      recognition.start();
    } catch {
      // InvalidStateError if start() is called while already active — swallow.
      listeningRef.current = false;
      setListening(false);
    }
  }, []);

  const stopListening = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    try {
      recognition.stop();
    } catch {
      /* no-op */
    }
  }, []);

  // ---- TTS ----------------------------------------------------------------
  const speak = useCallback((text) => {
    if (!TTS_SUPPORTED) return;
    const clean = cleanForSpeech(text);
    if (!clean) return;
    try {
      synth.cancel(); // kill any in-flight utterance first
      const u = new SpeechSynthesisUtterance(clean);
      u.rate = 1;
      u.pitch = 1;
      u.lang = 'en-US';
      u.onstart = () => setSpeaking(true);
      u.onend = () => setSpeaking(false);
      u.onerror = () => setSpeaking(false);
      utteranceRef.current = u;
      synth.speak(u);
    } catch {
      setSpeaking(false);
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    if (!TTS_SUPPORTED) return;
    try {
      synth.cancel();
    } catch {
      /* no-op */
    }
    setSpeaking(false);
  }, []);

  return {
    // STT
    sttSupported: STT_SUPPORTED,
    listening,
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
