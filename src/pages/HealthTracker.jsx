import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileDown, ShieldCheck, Loader2 } from 'lucide-react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { SectionTitle } from '../components/ui/SectionTitle';
import { EpisodeLogger } from '../components/tracker/EpisodeLogger';
import { IronTracker } from '../components/tracker/IronTracker';
import { LabLogger } from '../components/tracker/LabLogger';
import { TrendsPanel } from '../components/tracker/TrendsPanel';
import { HistoryList } from '../components/tracker/HistoryList';
import { PremiumGate } from '../components/premium/PremiumGate';
import { useAppStore } from '../store/useAppStore';
import { buildDoctorReportPDF } from '../services/doctorReport';
import { haptics } from '../hooks/useHaptics';
import { spring } from '../lib/motion';

/**
 * HealthTracker — the "/tracker" screen. The daily-use health hub: log
 * nosebleed episodes, iron intake and bloodwork, see trends, and (premium)
 * export a clinical PDF for your specialist. All health data is device-local.
 */

const DoctorReportButton = () => {
  const episodes = useAppStore((s) => s.nosebleedEpisodes);
  const labs = useAppStore((s) => s.labResults);
  const ironIntake = useAppStore((s) => s.ironIntake);
  const ironTarget = useAppStore((s) => s.ironTarget);
  const emergencyData = useAppStore((s) => s.emergencyData);
  const [status, setStatus] = useState('idle'); // idle | working | done | error

  const generate = async () => {
    if (status === 'working') return;
    haptics.impact();
    setStatus('working');
    const res = await buildDoctorReportPDF({
      episodes,
      labs,
      iron: { log: ironIntake, target: ironTarget },
      emergencyData,
      rangeDays: 90,
    });
    if (res && res.ok) {
      haptics.success();
      setStatus('done');
    } else {
      haptics.error();
      setStatus('error');
    }
    setTimeout(() => setStatus('idle'), 2500);
  };

  const label =
    status === 'working' ? 'Building report…'
      : status === 'done' ? 'Report ready ✓'
        : status === 'error' ? 'Could not build — retry'
          : 'Export Doctor Report (PDF)';

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.98 }}
      transition={spring.snappy}
      onClick={generate}
      className="w-full flex items-center justify-center gap-2 py-3 rounded-custom font-sans font-bold text-sm text-white shadow-sm"
      style={{ background: 'var(--gradient-ember)' }}
    >
      {status === 'working' ? <Loader2 size={16} className="animate-spin" /> : <FileDown size={16} />}
      {label}
    </motion.button>
  );
};

export const HealthTracker = () => (
  <PageWrapper>
    <div className="flex flex-col gap-6 pb-8 rise">
      <SectionTitle kicker="Health Log" title="Track your HHT" />

      <EpisodeLogger />
      <IronTracker />
      <LabLogger />
      <TrendsPanel />

      {/* Doctor Report — premium */}
      <section className="bg-white border border-line rounded-custom-lg p-5 shadow-card flex flex-col gap-3">
        <div className="flex flex-col">
          <h3 className="font-serif text-lg text-app-ink leading-tight">Doctor report</h3>
          <p className="text-[12px] text-app-muted leading-tight">
            A clean PDF of your episodes, bloodwork and iron to bring to your HHT specialist.
          </p>
        </div>
        <PremiumGate feature="Doctor Report (PDF)">
          <DoctorReportButton />
        </PremiumGate>
      </section>

      <HistoryList />

      <div className="flex items-center justify-center gap-1.5 text-[11px] text-app-muted">
        <ShieldCheck size={13} className="text-teal" />
        Stored only on this device — never uploaded.
      </div>
    </div>
  </PageWrapper>
);

export default HealthTracker;
