import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { captions } from '../../data/captions';
import { getTemplate } from './posterTemplates';

export const CaptionBlock = ({ type, data, onCopied }) => {
  const [copied, setCopied] = useState(false);

  const getCaptionText = () => {
    if (type === 'awareness') {
      return captions.awareness;
    }
    if (type === 'fact') {
      return captions.fact(data.stat, data.body);
    }
    if (type === 'story') {
      return captions.story(data.quote, data.name, data.role);
    }
    // New templates supply their own caption builder.
    const template = getTemplate(type);
    if (template && typeof template.getCaption === 'function') {
      return template.getCaption(data);
    }
    return '';
  };

  const handleCopy = async () => {
    const text = getCaptionText();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      if (onCopied) onCopied();
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className="bg-app-dark2 border border-app-border/15 rounded-custom p-4 flex flex-col gap-3 font-sans text-white select-none">
      <div className="flex justify-between items-center border-b border-app-border/5 pb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-xs">📝</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-teal">Social Media Caption</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 bg-app-dark hover:bg-app-mid/50 text-app-muted hover:text-white px-2.5 py-1.5 rounded-custom-sm text-[10px] font-bold transition-all border border-app-border/5 active:scale-95 cursor-pointer"
        >
          {copied ? <Check size={11} className="text-brand-teal" /> : <Copy size={11} />}
          <span>{copied ? 'Copied' : 'Copy Caption'}</span>
        </button>
      </div>

      <p className="text-[11px] text-app-border leading-relaxed bg-app-dark/40 p-3 rounded-custom max-h-32 overflow-y-auto select-text whitespace-pre-wrap">
        {getCaptionText()}
      </p>
    </div>
  );
};
export default CaptionBlock;
