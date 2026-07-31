import { useState, useCallback } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { PosterTypeSelector } from '../components/poster/PosterTypeSelector';
import { PosterThemeSelector } from '../components/poster/PosterThemeSelector';
import { PosterFormatSelector } from '../components/poster/PosterFormatSelector';
import { PosterOptionsPanel } from '../components/poster/PosterOptionsPanel';
import { PosterCanvas } from '../components/poster/PosterCanvas';
import { AwarenessPosterControls } from '../components/poster/AwarenessPosterControls';
import { FactPosterControls } from '../components/poster/FactPosterControls';
import { StoryPosterControls } from '../components/poster/StoryPosterControls';
import { GenericPosterControls } from '../components/poster/GenericPosterControls';
import { CaptionBlock } from '../components/poster/CaptionBlock';
import { SavedCreationsShelf } from '../components/poster/SavedCreationsShelf';
import { SavePosterSheet } from '../components/poster/SavePosterSheet';
import { PresetQuotes } from '../components/poster/PresetQuotes';
import { getTemplate, buildDefaultData } from '../components/poster/posterTemplates';
import { getTheme } from '../components/poster/posterThemes';
import { getFormat } from '../components/poster/posterFormats';
import { SectionTitle } from '../components/ui/SectionTitle';
import { Toast } from '../components/ui/Toast';
import { Download, Share2, Save } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { haptics } from '../hooks/useHaptics';
import { TapScale } from '../lib/motion';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';

// Downscale the currently-rendered poster PNG into a small JPEG thumbnail so
// saved creations can show their real look in the "My Creations" shelf.
const makeThumbnail = (url, targetWidth = 280) =>
  new Promise((resolve) => {
    if (!url) {
      resolve(null);
      return;
    }
    const img = new Image();
    img.onload = () => {
      try {
        const ratio = img.height / img.width || 1;
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = Math.round(targetWidth * ratio);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.72));
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });

const defaultOptions = {
  pattern: true,
  ribbon: false,
  ribbonStyle: 'vector',
  accentShape: 'circle',
};

export const PosterStudio = () => {
  const [posterType, setPosterType] = useState('awareness');
  const [themeId, setThemeId] = useState('bleed');
  const [formatId, setFormatId] = useState('square');
  const [options, setOptions] = useState(defaultOptions);

  const [showToast, setShowToast] = useState(false);
  const [toastText, setToastText] = useState('');

  // Legacy templates keep their bespoke shapes/controls.
  const [awarenessData, setAwarenessData] = useState({
    headline: 'HHT is Real. HHT is Rare.',
    body: 'Hereditary Hemorrhagic Telangiectasia is a genetic vascular disorder that affects 1 in 5,000 people.',
  });
  const [factData, setFactData] = useState({
    stat: '1 in 5,000',
    body: 'people have HHT worldwide. Over 90% remain undiagnosed.',
  });
  const [storyData, setStoryData] = useState({
    quote: 'Sharing my story makes an invisible disease visible.',
    name: 'Alex Rivera',
    role: 'HHT Patient',
  });

  // New templates share one keyed data map seeded from their defaults.
  const [templateData, setTemplateData] = useState(() => buildDefaultData());

  const [renderedBlob, setRenderedBlob] = useState(null);
  const [renderedUrl, setRenderedUrl] = useState('');

  // Saved-creations wiring — the currently loaded/edited saved poster (if any).
  const { savedPosters, savePoster, deletePoster } = useAppStore();
  const [activePosterId, setActivePosterId] = useState(null);
  const [saveSheetOpen, setSaveSheetOpen] = useState(false);

  const showCustomToast = (msg) => {
    setToastText(msg);
    setShowToast(true);
  };

  const handleCanvasRendered = useCallback((blob, url) => {
    setRenderedBlob(blob);
    setRenderedUrl(url);
  }, []);

  const isLegacy = posterType === 'awareness' || posterType === 'fact' || posterType === 'story';

  const getActiveData = () => {
    if (posterType === 'awareness') return awarenessData;
    if (posterType === 'fact') return factData;
    if (posterType === 'story') return storyData;
    return templateData[posterType] || {};
  };

  const updateTemplateData = (next) => {
    setTemplateData((prev) => ({ ...prev, [posterType]: next }));
  };

  const handleApplyPreset = (preset) => {
    setPosterType(preset.type);
    if (preset.type === 'awareness') {
      setAwarenessData({ headline: preset.headline, body: preset.body });
    } else if (preset.type === 'fact') {
      setFactData({ stat: preset.stat, body: preset.body });
    } else if (preset.type === 'story') {
      setStoryData({ quote: preset.quote, name: preset.name, role: preset.role });
    }
    showCustomToast(`Loaded "${preset.label}" prompt ✨`);
  };

  const triggerChallengeOne = () => {
    const toggleChallenge = useAppStore.getState().toggleChallenge;
    const completedChallenges = useAppStore.getState().completedChallenges;
    if (!completedChallenges.includes(1)) {
      toggleChallenge(1);
    }
  };

  const handleDownload = async () => {
    if (!renderedUrl || !renderedBlob) return;
    haptics.impact();

    if (Capacitor.isNativePlatform()) {
      try {
        const reader = new FileReader();
        reader.readAsDataURL(renderedBlob);
        reader.onloadend = async () => {
          const base64data = reader.result.split(',')[1];
          const fileName = `HHT-Poster-${posterType}-${formatId}.png`;

          const savedFile = await Filesystem.writeFile({
            path: fileName,
            data: base64data,
            directory: Directory.Cache,
          });

          await Share.share({
            title: 'HHT Awareness Poster',
            url: savedFile.uri,
          });
          haptics.success();
          showCustomToast('Poster ready to save/share! 🎨');
          triggerChallengeOne();
        };
      } catch (err) {
        console.error('Download failed:', err);
        haptics.error();
        showCustomToast('Failed to process image.');
      }
    } else {
      const link = document.createElement('a');
      link.href = renderedUrl;
      link.download = `HHT-Awareness-${posterType}-${formatId}-Poster.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      haptics.success();
      showCustomToast('Poster downloaded successfully! 🎨');
      triggerChallengeOne();
    }
  };

  const handleShare = async () => {
    if (!renderedBlob) {
      showCustomToast('Poster is rendering...');
      return;
    }
    await handleDownload(); // On native, download triggers the share sheet.
  };

  const activeTemplate = getTemplate(posterType);
  const activeTheme = getTheme(themeId);
  const activeFormat = getFormat(formatId);

  // ---- Saved creations: save / load / delete -------------------------------
  const openSaveSheet = () => {
    haptics.tap();
    setSaveSheetOpen(true);
  };

  const buildDefaultTitle = () => {
    if (activePosterId) {
      const existing = savedPosters.find((p) => p.id === activePosterId);
      if (existing) return existing.title;
    }
    return `${activeTemplate.label.replace(/^\S+\s*/, '')} · ${activeTheme.name}`;
  };

  const handleConfirmSave = async (title) => {
    const thumbnail = await makeThumbnail(renderedUrl);
    const id = savePoster({
      id: activePosterId || undefined,
      title: title || 'Untitled Poster',
      type: posterType,
      themeId,
      formatId,
      options,
      data: getActiveData(),
      thumbnail,
    });
    setActivePosterId(id);
    setSaveSheetOpen(false);
    haptics.success();
    showCustomToast(activePosterId ? 'Creation updated! ✨' : 'Saved to My Creations! ✨');
  };

  const handleLoadPoster = (poster) => {
    haptics.selection();
    setPosterType(poster.type);
    setThemeId(poster.themeId);
    setFormatId(poster.formatId);
    setOptions(poster.options || defaultOptions);

    if (poster.type === 'awareness') setAwarenessData(poster.data || {});
    else if (poster.type === 'fact') setFactData(poster.data || {});
    else if (poster.type === 'story') setStoryData(poster.data || {});
    else setTemplateData((prev) => ({ ...prev, [poster.type]: poster.data || {} }));

    setActivePosterId(poster.id);
    showCustomToast(`Loaded "${poster.title}" into the editor`);
  };

  const handleDeletePoster = (id) => {
    const target = savedPosters.find((p) => p.id === id);
    deletePoster(id);
    if (activePosterId === id) setActivePosterId(null);
    showCustomToast(target ? `Deleted "${target.title}"` : 'Creation deleted.');
  };

  return (
    <PageWrapper>
      <div className="flex flex-col gap-6 font-sans">
        <SectionTitle kicker="Create studio" title="Turn your story into a poster" className="mb-0" />

        {/* Hero live preview — a warm card that pops on every selection change. */}
        <section className="flex flex-col gap-3">
          <PosterCanvas
            type={posterType}
            data={getActiveData()}
            theme={themeId}
            format={formatId}
            options={options}
            onRendered={handleCanvasRendered}
          />

          <div className="flex items-center justify-between gap-2 max-w-[420px] mx-auto w-full">
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-garnet truncate">
                {activeTemplate.label} · {activeTheme.name}
              </span>
              <span className="text-[10px] text-app-muted truncate">
                {activeFormat.sub} · {activeFormat.hint}
              </span>
            </div>
            <TapScale
              as="button"
              onClick={openSaveSheet}
              className="shrink-0 flex items-center gap-1.5 min-h-[40px] bg-app-surface2 border border-line text-garnet font-semibold text-xs px-4 py-2 rounded-custom-pill shadow-card select-none"
            >
              <Save size={14} />
              {activePosterId ? 'Update' : 'Save'}
            </TapScale>
          </div>

          {/* Primary actions — garnet Share + outline Download, reference style. */}
          <div className="grid grid-cols-2 gap-3 max-w-[420px] mx-auto w-full">
            <TapScale
              as="button"
              onClick={handleShare}
              className="min-h-[48px] flex items-center justify-center gap-2 rounded-custom bg-garnet text-white font-semibold text-sm shadow-card select-none active:brightness-95"
            >
              <Share2 size={16} />
              Share
            </TapScale>
            <TapScale
              as="button"
              onClick={handleDownload}
              className="min-h-[48px] flex items-center justify-center gap-2 rounded-custom bg-app-surface border border-line text-app-ink font-semibold text-sm shadow-card select-none"
            >
              <Download size={16} />
              Download
            </TapScale>
          </div>
        </section>

        <section>
          <PresetQuotes onApplyPreset={handleApplyPreset} />
        </section>

        <section>
          <PosterTypeSelector activeType={posterType} onSelectType={setPosterType} />
        </section>

        <section>
          <PosterFormatSelector activeFormat={formatId} onSelectFormat={setFormatId} />
        </section>

        <section>
          <PosterThemeSelector activeTheme={themeId} onSelectTheme={setThemeId} />
        </section>

        <section className="flex flex-col gap-3">
          <SectionTitle kicker="Personalize" title="Make it yours" className="mb-0" />
          <div className="bg-app-surface border border-line rounded-custom-lg p-5 shadow-card">
            {posterType === 'awareness' && <AwarenessPosterControls data={awarenessData} onChange={setAwarenessData} />}
            {posterType === 'fact' && <FactPosterControls data={factData} onChange={setFactData} />}
            {posterType === 'story' && <StoryPosterControls data={storyData} onChange={setStoryData} />}
            {!isLegacy && (
              <GenericPosterControls
                template={activeTemplate}
                data={templateData[posterType] || {}}
                onChange={updateTemplateData}
              />
            )}
          </div>
        </section>

        <section>
          <div className="bg-app-surface border border-line rounded-custom-lg p-5 shadow-card">
            <PosterOptionsPanel options={options} onChange={setOptions} />
          </div>
        </section>

        <section>
          <CaptionBlock type={posterType} data={getActiveData()} onCopied={() => showCustomToast('Caption copied! 📋')} />
        </section>

        <section className="flex flex-col gap-3 mb-6">
          <div className="flex items-end justify-between">
            <SectionTitle kicker="My creations" title="Saved posters" className="mb-0" />
            {savedPosters.length > 0 && (
              <span className="text-[10px] text-app-muted pb-1">{savedPosters.length} saved</span>
            )}
          </div>
          <SavedCreationsShelf
            posters={savedPosters}
            activeId={activePosterId}
            onSelect={handleLoadPoster}
            onDelete={handleDeletePoster}
          />
        </section>
      </div>

      <SavePosterSheet
        isOpen={saveSheetOpen}
        onClose={() => setSaveSheetOpen(false)}
        defaultTitle={buildDefaultTitle()}
        isUpdate={!!activePosterId}
        onConfirm={handleConfirmSave}
      />

      <Toast message={toastText} isOpen={showToast} onClose={() => setShowToast(false)} />
    </PageWrapper>
  );
};
export default PosterStudio;
