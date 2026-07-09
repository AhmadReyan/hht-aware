import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { captions } from '../../data/captions';
import { getTemplate } from './posterTemplates';
import { haptics } from '../../hooks/useHaptics';

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
      haptics.success();
      if (onCopied) onCopied();
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
      haptics.error();
    }
  };

  return (
    <div className="bg-app-surface border border-line rounded-custom-lg p-4 flex flex-col gap-3 font-sans shadow-card select-none">
      <div className="flex justify-between items-center border-b border-line pb-2.5">
        <div className="flex items-center gap-1.5">
          <span className="text-xs">📝</span>
          <span className="text-[11px] font-semibold uppercase tracking-wide text-garnet">Social caption</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 bg-app-surface2 hover:bg-teal-soft text-app-soft hover:text-brand-teal px-3 py-1.5 rounded-custom-pill text-[11px] font-semibold transition-all border border-line active:scale-95 cursor-pointer"
        >
          {copied ? <Check size={11} className="text-brand-teal" /> : <Copy size={11} />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      <p className="text-[12px] text-app-soft leading-relaxed bg-app-surface2 p-3 rounded-custom max-h-32 overflow-y-auto select-text whitespace-pre-wrap">
        {getCaptionText()}
      </p>
    </div>
  );
};
export default CaptionBlock;
