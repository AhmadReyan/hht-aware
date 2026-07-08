import React from 'react';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { ExternalLink, Info, AlertOctagon } from 'lucide-react';

export const AboutModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="About HHT (Hereditary Hemorrhagic Telangiectasia)">
      <div className="flex flex-col gap-6 text-sm text-app-border leading-relaxed font-sans">
        
        {/* Intro */}
        <section className="flex flex-col gap-2">
          <p>
            <strong>Hereditary Hemorrhagic Telangiectasia (HHT)</strong>, also known as <strong>Osler-Weber-Rendu disease</strong>, is a rare autosomal dominant genetic disorder that affects approximately 1 in 5,000 people worldwide (~1 million people).
          </p>
          <p>
            HHT causes abnormal blood vessel connections (arteriovenous malformations or AVMs) and small red spots (telangiectasias) on the skin and mucosal linings. Underdiagnosed in 90% of cases, patients often face a 20-year diagnosis delay.
          </p>
        </section>

        {/* Genetics */}
        <section className="bg-app-dark p-4 rounded-custom border border-app-border/5 flex flex-col gap-2">
          <h3 className="font-serif font-bold text-base text-brand-red-mid">🧬 Genetics & Inheritance</h3>
          <div className="flex gap-2 flex-wrap mb-1">
            <Badge variant="red" size="sm">ENG</Badge>
            <Badge variant="red" size="sm">ACVRL1 (ALK1)</Badge>
            <Badge variant="red" size="sm">SMAD4</Badge>
            <Badge variant="red" size="sm">Autosomal Dominant</Badge>
          </div>
          <p className="text-xs text-app-muted">
            HHT is caused by mutations in genes involved in vascular development. A parent with HHT has a <strong>50% chance</strong> of passing the mutation to each child. SMAD4 mutation carriers also have Juvenile Polyposis Syndrome (JP-HHT).
          </p>
        </section>

        {/* Curaçao Criteria */}
        <section className="flex flex-col gap-2">
          <h3 className="font-serif font-bold text-base text-brand-red-mid">📊 Curaçao Diagnosis Criteria</h3>
          <p className="text-xs text-app-muted mb-2">
            A clinical diagnosis is made using 4 key criteria. Having <strong>3 or 4</strong> indicates definite HHT:
          </p>
          <ul className="list-none flex flex-col gap-2 text-xs">
            <li className="flex gap-2.5 items-start bg-app-dark/50 p-2.5 rounded-custom-sm">
              <span className="text-brand-red-mid font-bold">1.</span>
              <div>
                <strong>Nosebleeds:</strong> Spontaneous, recurrent epistaxis (nosebleeds), which worsen with age.
              </div>
            </li>
            <li className="flex gap-2.5 items-start bg-app-dark/50 p-2.5 rounded-custom-sm">
              <span className="text-brand-red-mid font-bold">2.</span>
              <div>
                <strong>Telangiectasias:</strong> Multiple dilated capillaries at characteristic sites: lips, oral cavity, fingers, and nose.
              </div>
            </li>
            <li className="flex gap-2.5 items-start bg-app-dark/50 p-2.5 rounded-custom-sm">
              <span className="text-brand-red-mid font-bold">3.</span>
              <div>
                <strong>Visceral AVMs:</strong> Internal arteriovenous malformations in organs (lungs, liver, brain, spine, GI tract).
              </div>
            </li>
            <li className="flex gap-2.5 items-start bg-app-dark/50 p-2.5 rounded-custom-sm">
              <span className="text-brand-red-mid font-bold">4.</span>
              <div>
                <strong>Family History:</strong> A first-degree relative (parent, sibling, child) diagnosed with HHT.
              </div>
            </li>
          </ul>
        </section>

        {/* Clinical Alert */}
        <section className="bg-red-950/20 border border-brand-red/30 p-4 rounded-custom flex gap-3">
          <AlertOctagon size={24} className="text-brand-red-mid flex-shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1.5">
            <h4 className="font-sans font-bold text-xs uppercase text-brand-red-mid tracking-wider">⚠️ Critical Emergency Safety</h4>
            <ul className="list-disc pl-4 text-xs text-brand-red-light flex flex-col gap-1">
              <li><strong>NO nasal packing:</strong> Can cause permanent mucosal tear and severe re-bleeding.</li>
              <li><strong>AVM Screening:</strong> Screen for lung AVMs before invasive procedures (dental cleanings, surgeries) to prevent brain infection.</li>
              <li><strong>NO NSAIDs:</strong> Avoid aspirin/ibuprofen without specialist guidance, as they increase bleeding risks.</li>
              <li><strong>Brain AVMs:</strong> Must rule out brain AVMs before prescribing anticoagulation.</li>
            </ul>
          </div>
        </section>

        {/* Resources */}
        <section className="flex flex-col gap-3">
          <h3 className="font-serif font-bold text-base text-brand-red-mid">🔗 Helpful Links</h3>
          <div className="flex flex-col gap-2 text-xs">
            <a
              href="https://curehht.org"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between bg-app-dark hover:bg-app-dark border border-app-border/5 p-3 rounded-custom hover:text-white transition-colors"
            >
              <span>Cure HHT — curehht.org</span>
              <ExternalLink size={14} className="text-brand-teal" />
            </a>
            <a
              href="https://rarediseases.org/rare-diseases/hereditary-hemorrhagic-telangiectasia/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between bg-app-dark hover:bg-app-dark border border-app-border/5 p-3 rounded-custom hover:text-white transition-colors"
            >
              <span>NORD Patient Guide</span>
              <ExternalLink size={14} className="text-brand-teal" />
            </a>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center text-[10px] text-app-muted border-t border-app-border/10 pt-4 mt-2">
          HHT Awareness App — May 20 · curehht.org
        </div>

      </div>
    </Modal>
  );
};
export default AboutModal;
