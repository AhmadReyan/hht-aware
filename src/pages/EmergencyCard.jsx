import React, { useRef } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { useAppStore } from '../store/useAppStore';
import { useShare } from '../hooks/useShare';
import { EmergencyCardDisplay } from '../components/emergency/EmergencyCardDisplay';
import { EmergencyCardForm } from '../components/emergency/EmergencyCardForm';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { InfoBanner } from '../components/ui/InfoBanner';
import { Toast } from '../components/ui/Toast';
import { FileDown, Share2, Save, RefreshCw } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';

export const EmergencyCard = () => {
  const cardRef = useRef(null);
  const { emergencyData, setEmergencyData, resetEmergencyCard } = useAppStore();
  const { shareContent, toastMessage, triggerToast } = useShare();
  const [showToast, setShowToast] = React.useState(false);
  const [toastText, setToastText] = React.useState('');

  const showCustomToast = (msg) => {
    setToastText(msg);
    setShowToast(true);
  };

  const handleSaveCard = () => {
    showCustomToast('Medical card saved locally! 💾');
    const toggleChallenge = useAppStore.getState().toggleChallenge;
    const completedChallenges = useAppStore.getState().completedChallenges;
    if (!completedChallenges.includes(3)) {
      toggleChallenge(3);
    }
  };

  const handleResetCard = () => {
    if (window.confirm('Are you sure you want to clear all emergency card details? This action cannot be undone.')) {
      resetEmergencyCard();
      showCustomToast('Emergency card cleared.');
    }
  };

  const handleShareText = async () => {
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

    await shareContent({
      title: 'HHT Emergency Alert Card',
      text,
    });
  };

  const handleExportPDF = async () => {
    if (!cardRef.current) return;
    try {
      showCustomToast('Generating PDF...');
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#1C1C1E',
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
      const fileName = 'HHT-Emergency-Card.pdf';

      if (Capacitor.isNativePlatform()) {
        // Save to temporary directory
        const savedFile = await Filesystem.writeFile({
          path: fileName,
          data: pdfBase64,
          directory: Directory.Cache
        });

        // Share the file (this allows saving to downloads or printing)
        await Share.share({
          title: 'HHT Emergency Card',
          url: savedFile.uri,
        });
        showCustomToast('PDF ready to share/print! 📄');
      } else {
        pdf.save(fileName);
        showCustomToast('PDF saved to downloads! 📄');
      }
    } catch (err) {
      console.error('PDF generation failed:', err);
      showCustomToast('PDF export failed.');
    }
  };

  return (
    <PageWrapper>
      <div className="flex flex-col gap-6 font-sans">
        <section>
          <InfoBanner variant="danger" title="Physician Notice">
            This card contains critical information for ER doctors. Data is stored strictly on your local device.
          </InfoBanner>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-bold text-xs uppercase tracking-wider text-app-muted px-1">Live Card Preview</h2>
          <EmergencyCardDisplay data={emergencyData} cardRef={cardRef} />
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-bold text-xs uppercase tracking-wider text-app-muted px-1">Edit Emergency Details</h2>
          <Card variant="dark" className="p-5 border-app-border/5">
            <EmergencyCardForm data={emergencyData} onChange={setEmergencyData} />
          </Card>
        </section>

        <section className="grid grid-cols-2 gap-3 mb-6">
          <Button variant="primary" onClick={handleSaveCard} icon={Save}>
            Save Card
          </Button>
          <Button variant="teal" onClick={handleShareText} icon={Share2}>
            Share Alert Text
          </Button>
          <Button variant="secondary" onClick={handleExportPDF} icon={FileDown} className="col-span-2">
            Download Printable PDF
          </Button>
          <Button variant="outline" onClick={handleResetCard} icon={RefreshCw} className="col-span-2 text-red-500 hover:text-red-400 border-red-950/20">
            Clear All Card Data
          </Button>
        </section>
      </div>

      <Toast message={toastText} isOpen={showToast} onClose={() => setShowToast(false)} />
    </PageWrapper>
  );
};
export default EmergencyCard;
