import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { haptics } from '../../hooks/useHaptics';

export const SavePosterSheet = ({ isOpen, onClose, defaultTitle = '', isUpdate = false, onConfirm }) => {
  const [title, setTitle] = useState(defaultTitle);

  useEffect(() => {
    if (isOpen) setTitle(defaultTitle);
  }, [isOpen, defaultTitle]);

  const handleConfirm = () => {
    haptics.impact();
    onConfirm(title.trim() || defaultTitle);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} type="dialog" title={isUpdate ? 'Update Creation' : 'Save Creation'}>
      <div className="flex flex-col gap-4">
        <p className="text-xs text-white/70 leading-relaxed">
          Give this poster a name so you can find and re-edit it later in <span className="text-white font-semibold">My Creations</span>.
        </p>
        <div className="flex flex-col gap-1.5">
          <label className="font-bold text-xs uppercase tracking-wider text-white/60">Title</label>
          <input
            type="text"
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={40}
            placeholder="e.g. World HHT Day Post"
            className="w-full bg-app-surface2 border border-line rounded-custom text-sm px-3.5 py-2.5 text-app-ink placeholder:text-app-muted focus:outline-none focus:border-garnet focus:ring-1 focus:ring-garnet transition-colors"
          />
        </div>
        <Button variant="teal" icon={Save} onClick={handleConfirm} className="w-full min-h-[44px]">
          {isUpdate ? 'Update Creation' : 'Save Creation'}
        </Button>
      </div>
    </Modal>
  );
};
export default SavePosterSheet;
