import React, { useRef, useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { useAppStore } from '../store/useAppStore';
import { useShare } from '../hooks/useShare';
import { EmergencyCardDisplay } from '../components/emergency/EmergencyCardDisplay';
import { EmergencyCardForm } from '../components/emergency/EmergencyCardForm';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { InfoBanner } from '../components/ui/InfoBanner';
import { Toast } from '../components/ui/Toast';
import { FileDown, Share2, Save, RefreshCw, ShieldAlert } from 'lucide-react';
import { haptics } from '../hooks/useHaptics';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';

export const EmergencyCard = () => {
  const cardRef = useRef(null);
  const { emergencyData, setEmergencyData, resetEmergencyCard } = useAppStore();
  const { shareContent } = useShare();
  const [showToast, setShowToast] = useState(false);
  const [toastText, setToastText] = useState('');

  const showCustomToast = (msg) => {
    setToastText(msg);
    setShowToast(true);
  };

  const handleSaveCard = () => {
    haptics.success();
    showCustomToast('Passport saved to this device! 💾');
    const toggleChallenge = useAppStore.getState().toggleChallenge;
    const completedChallenges = useAppStore.getState().completedChallenges;
    if (!completedChallenges.includes(3)) {
      toggleChallenge(3);
    }
  };

  const handleResetCard = () => {
    haptics.warning();
    if (window.confirm('Are you sure you want to clear all passport details? This action cannot be undone.')) {
      resetEmergencyCard();
      haptics.success();
      showCustomToast('Passport cleared.');
    }
  };

  const handleShareText = async () => {
    haptics.impact();
    const labels = {
      nosebleeds: 'Nosebleeds',
      pulmonary: 'Pulmonary AVM',
      brain: 'Brain AVM',
      liver: 'Liver AVM',
      gi: 'GI Bleeding',
      skin: 'Skin Telangiectasias',
      anemia: 'Anemia',
      spinal: 'Spinal AVM'
    };

    const formattedManifestations = emergencyData.manifestations
      .map(m => labels[m] || m)
      .join(', ');

    const text = `🚨 HHT MEDICAL ALERT CARD
Patient Name: ${emergencyData.name || '—'}
DOB: ${emergencyData.dob || '—'}
Blood Type: ${emergencyData.bloodType}
Drug Allergies: ${emergencyData.drugAllergies || 'None Known'}
HHT Specialist: ${emergencyData.specialist || '—'} (${emergencyData.specialistPhone || '—'})
Known Manifestations: ${formattedManifestations || 'None selected'}
Emergency Contact: ${emergencyData.contactName || '—'} (${emergencyData.contactPhone || '—'})
Additional Notes: ${emergencyData.notes || 'None'}

⚠️ CRITICAL PHYSICIAN WARNINGS:
• No nasal packing.
• Screen for PAVMs before procedures.
• Avoid NSAIDs/Aspirin.
• Rule out brain AVMs before anticoagulants.`;

    const ok = await shareContent({
      title: 'HHT Emergency Alert Card',
      text,
    });
    if (ok) {
      haptics.success();
      showCustomToast('Alert text shared! 🚑');
    }
  };

  const handleExportPDF = async () => {
    if (!cardRef.current) return;
    try {
      haptics.impact();
      showCustomToast('Generating PDF...');
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#1F1A1C',
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width / 3, canvas.height / 3]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 3, canvas.height / 3);
      const pdfBase64 = pdf.output('datauristring').split(',')[1];
      const fileName = 'HHT-Passport.pdf';

      if (Capacitor.isNativePlatform()) {
        // Save to temporary directory
        const savedFile = await Filesystem.writeFile({
          path: fileName,
          data: pdfBase64,
          directory: Directory.Cache
        });

        // Share the file (this allows saving to downloads or printing)
        await Share.share({
          title: 'HHT Passport',
          url: savedFile.uri,
        });
        haptics.success();
        showCustomToast('PDF ready to share/print! 📄');
      } else {
        pdf.save(fileName);
        haptics.success();
        showCustomToast('PDF saved to downloads! 📄');
      }
    } catch (err) {
      console.error('PDF generation failed:', err);
      haptics.error();
      showCustomToast('PDF export failed.');
    }
  };

  return (
    <PageWrapper>
      <div className="flex flex-col gap-6 font-sans">
        <section className="flex flex-col gap-1 px-1">
          <h1 className="font-serif text-2xl font-bold text-app-ink flex items-center gap-2">
            <ShieldAlert className="text-brand-red-mid" size={24} />
            <span>HHT Passport</span>
          </h1>
          <p className="text-xs text-app-muted">
            Your always-ready emergency ID — fill it in once, edit it anytime, share it in seconds.
          </p>
        </section>

        <section>
          <InfoBanner variant="danger" title="Physician Notice">
            This passport contains critical information for ER doctors. Data is stored strictly on your local device.
          </InfoBanner>
        </section>

        {/* Hero live preview — sticky under the header, updates as you type. */}
        <section className="sticky top-14 z-30 -mx-4 px-4 pt-1 pb-3 bg-app-bg/85 backdrop-blur-glass flex flex-col gap-2">
          <h2 className="font-bold text-xs uppercase tracking-wider text-app-muted px-1">Live Passport Preview</h2>
          <EmergencyCardDisplay data={emergencyData} cardRef={cardRef} />
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-bold text-xs uppercase tracking-wider text-app-muted px-1">Edit Passport Details</h2>
          <Card variant="dark" className="p-5 border-app-border/5">
            <EmergencyCardForm data={emergencyData} onChange={setEmergencyData} />
          </Card>
        </section>

        <section className="grid grid-cols-2 gap-3 mb-6">
          <Button variant="primary" onClick={handleSaveCard} icon={Save} className="min-h-[44px]">
            Save Passport
          </Button>
          <Button variant="teal" onClick={handleShareText} icon={Share2} className="min-h-[44px]">
            Share Alert Text
          </Button>
          <Button variant="secondary" onClick={handleExportPDF} icon={FileDown} className="col-span-2 min-h-[44px]">
            Download Printable PDF
          </Button>
          <Button
            variant="outline"
            onClick={handleResetCard}
            icon={RefreshCw}
            className="col-span-2 min-h-[44px] text-red-500 hover:text-red-400 border-red-950/20"
          >
            Clear All Passport Data
          </Button>
        </section>
      </div>

      <Toast message={toastText} isOpen={showToast} onClose={() => setShowToast(false)} />
    </PageWrapper>
  );
};
export default EmergencyCard;
