import React, { useRef, useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { useAppStore } from '../store/useAppStore';
import { useShare } from '../hooks/useShare';
import { EmergencyCardDisplay } from '../components/emergency/EmergencyCardDisplay';
import { EmergencyCardForm } from '../components/emergency/EmergencyCardForm';
import { SectionTitle } from '../components/ui/SectionTitle';
import { Vessels } from '../components/ui/Vessels';
import { Toast } from '../components/ui/Toast';
import { Share2, FileDown, Pencil, ShieldCheck } from 'lucide-react';
import { haptics } from '../hooks/useHaptics';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';

const MANIFESTATION_LABELS = {
  nosebleeds: 'Nosebleeds',
  pulmonary: 'Pulmonary AVM',
  brain: 'Brain AVM',
  liver: 'Liver AVM',
  gi: 'GI Bleeding',
  skin: 'Skin Telangiectasias',
  anemia: 'Anemia',
  spinal: 'Spinal AVM'
};

export const EmergencyCard = () => {
  const cardRef = useRef(null);
  const { emergencyData, setEmergencyData, resetEmergencyCard } = useAppStore();

  const hasCore = Boolean((emergencyData?.name || '').trim());
  const [editing, setEditing] = useState(!hasCore);

  const { shareContent } = useShare();
  const [showToast, setShowToast] = useState(false);
  const [toastText, setToastText] = useState('');

  const showCustomToast = (msg) => {
    setToastText(msg);
    setShowToast(true);
  };

  // Creating the passport also satisfies the "prepare your passport" challenge.
  const markPassportChallenge = () => {
    const toggleChallenge = useAppStore.getState().toggleChallenge;
    const completedChallenges = useAppStore.getState().completedChallenges;
    if (!completedChallenges.includes(3)) {
      toggleChallenge(3);
    }
  };

  const handleGenerate = () => {
    haptics.success();
    markPassportChallenge();
    setEditing(false);
    showCustomToast('Your passport is ready 🛂');
  };

  const handleEdit = () => {
    haptics.tap();
    setEditing(true);
  };

  const handleShareText = async () => {
    haptics.impact();
    const formattedManifestations = (emergencyData.manifestations || [])
      .map((m) => MANIFESTATION_LABELS[m] || m)
      .join(', ');

    const text = `🚨 HHT MEDICAL ALERT CARD
Patient Name: ${emergencyData.name || '—'}
DOB: ${emergencyData.dob || '—'}
Blood Type: ${emergencyData.bloodType || 'Unknown'}
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

    const ok = await shareContent({ title: 'HHT Emergency Alert Card', text });
    if (ok) {
      haptics.success();
      showCustomToast('Alert shared 🚑');
    }
  };

  const handleExportPDF = async () => {
    if (!cardRef.current) return;
    try {
      haptics.impact();
      showCustomToast('Generating PDF…');
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#FFFFFF',
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
        const savedFile = await Filesystem.writeFile({
          path: fileName,
          data: pdfBase64,
          directory: Directory.Cache
        });
        await Share.share({ title: 'HHT Passport', url: savedFile.uri });
        haptics.success();
        showCustomToast('PDF ready to share / print 📄');
      } else {
        pdf.save(fileName);
        haptics.success();
        showCustomToast('PDF saved to downloads 📄');
      }
    } catch (err) {
      console.error('PDF generation failed:', err);
      haptics.error();
      showCustomToast('PDF export failed.');
    }
  };

  const handleReset = () => {
    haptics.warning();
    if (window.confirm('Clear all passport details? This cannot be undone.')) {
      resetEmergencyCard();
      haptics.success();
      setEditing(true);
      showCustomToast('Passport cleared.');
    }
  };

  const primaryBtn =
    'flex min-h-[48px] w-full items-center justify-center gap-2 rounded-custom bg-garnet px-4 font-sans text-sm font-semibold text-white shadow-card transition active:scale-[0.98]';
  const outlineBtn =
    'flex min-h-[48px] w-full items-center justify-center gap-2 rounded-custom border-[1.5px] border-line bg-app-surface px-4 font-sans text-sm font-semibold text-app-ink transition active:scale-[0.98]';

  return (
    <PageWrapper>
      <div className="flex flex-col gap-5 font-sans">
        {editing ? (
          /* ---------------- FORM ---------------- */
          <div className="rise flex flex-col gap-5">
            <SectionTitle
              kicker="Emergency passport"
              title="60 seconds now, clarity in any ER"
            />

            <div className="relative overflow-hidden rounded-custom-lg bg-rose p-4">
              <Vessels color="var(--garnet)" opacity={0.14} />
              <p className="relative font-sans text-[13px] leading-relaxed text-app-soft">
                Fill this in once. In an emergency, one tap shows any medic your
                diagnosis and the critical HHT warnings that keep you safe. Stored
                only on this device.
              </p>
            </div>

            <div className="rounded-custom-lg border border-line bg-app-surface p-5 shadow-card">
              <EmergencyCardForm data={emergencyData} onChange={setEmergencyData} />
            </div>

            <button type="button" onClick={handleGenerate} className={primaryBtn}>
              <ShieldCheck size={18} />
              Generate my passport
            </button>
          </div>
        ) : (
          /* ---------------- PASSPORT ---------------- */
          <div className="rise flex flex-col gap-5">
            <SectionTitle
              kicker="Emergency passport"
              title="Show this to any medic"
            />

            <EmergencyCardDisplay data={emergencyData} cardRef={cardRef} />

            <div className="flex flex-col gap-3">
              <button type="button" onClick={handleShareText} className={primaryBtn}>
                <Share2 size={18} />
                Save / Share
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={handleExportPDF} className={outlineBtn}>
                  <FileDown size={16} />
                  PDF
                </button>
                <button type="button" onClick={handleEdit} className={outlineBtn}>
                  <Pencil size={16} />
                  Edit
                </button>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="mx-auto font-sans text-[13px] font-medium text-app-muted underline-offset-2 hover:underline"
              >
                Clear passport data
              </button>
            </div>
          </div>
        )}
      </div>

      <Toast message={toastText} isOpen={showToast} onClose={() => setShowToast(false)} />
    </PageWrapper>
  );
};

export default EmergencyCard;
