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
import { getTemplate, buildDefaultData } from '../components/poster/posterTemplates';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Toast } from '../components/ui/Toast';
import { Download, Share2, Palette } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';

export const PosterStudio = () => {
  const [posterType, setPosterType] = useState('awareness');
  const [themeId, setThemeId] = useState('classic');
  const [formatId, setFormatId] = useState('square');
  const [options, setOptions] = useState({
    pattern: true,
    ribbon: false,
    ribbonStyle: 'vector',
    accentShape: 'circle',
  });

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

  const triggerChallengeOne = () => {
    const toggleChallenge = useAppStore.getState().toggleChallenge;
    const completedChallenges = useAppStore.getState().completedChallenges;
    if (!completedChallenges.includes(1)) {
      toggleChallenge(1);
    }
  };

  const handleDownload = async () => {
    if (!renderedUrl || !renderedBlob) return;

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
          showCustomToast('Poster ready to save/share! 🎨');
          triggerChallengeOne();
        };
      } catch (err) {
        console.error('Download failed:', err);
        showCustomToast('Failed to process image.');
      }
    } else {
      const link = document.createElement('a');
      link.href = renderedUrl;
      link.download = `HHT-Awareness-${posterType}-${formatId}-Poster.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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

  return (
    <PageWrapper>
      <div className="flex flex-col gap-5 font-sans">
        <section className="flex flex-col gap-1 px-1">
          <h1 className="font-serif text-2xl font-bold text-app-ink flex items-center gap-2">
            <Palette className="text-brand-red-mid" size={24} />
            <span>Poster Studio</span>
          </h1>
          <p className="text-xs text-app-muted">Design beautiful posters to spread HHT awareness.</p>
        </section>

        <section>
          <PosterTypeSelector activeType={posterType} onSelectType={setPosterType} />
        </section>

        <section className="flex justify-center">
          <PosterCanvas
            type={posterType}
            data={getActiveData()}
            theme={themeId}
            format={formatId}
            options={options}
            onRendered={handleCanvasRendered}
          />
        </section>

        <section>
          <PosterFormatSelector activeFormat={formatId} onSelectFormat={setFormatId} />
        </section>

        <section>
          <PosterThemeSelector activeTheme={themeId} onSelectTheme={setThemeId} />
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-bold text-xs uppercase tracking-wider text-app-muted px-1">Personalize Details</h2>
          <Card variant="dark" className="p-5 border-app-border/5">
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
          </Card>
        </section>

        <section>
          <Card variant="dark" className="p-5 border-app-border/5">
            <PosterOptionsPanel options={options} onChange={setOptions} />
          </Card>
        </section>

        <section>
          <CaptionBlock type={posterType} data={getActiveData()} onCopied={() => showCustomToast('Caption copied! 📋')} />
        </section>

        <section className="grid grid-cols-2 gap-3 mb-6">
          <Button variant="primary" onClick={handleShare} icon={Share2}>Share Image</Button>
          <Button variant="secondary" onClick={handleDownload} icon={Download}>Download PNG</Button>
        </section>
      </div>
      <Toast message={toastText} isOpen={showToast} onClose={() => setShowToast(false)} />
    </PageWrapper>
  );
};
export default PosterStudio;
