import { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';

export const usePWAInstall = () => {
  const deferredPrompt = useAppStore((state) => state.deferredPrompt);
  const isInstallable = useAppStore((state) => state.isInstallable);
  const setDeferredPrompt = useAppStore((state) => state.setDeferredPrompt);
  const clearDeferredPrompt = useAppStore((state) => state.clearDeferredPrompt);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [setDeferredPrompt]);

  const installPWA = async () => {
    if (!deferredPrompt) {
      console.warn('Install prompt not available');
      return false;
    }
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    // We've used the prompt, and can't use it again
    clearDeferredPrompt();
    return outcome === 'accepted';
  };

  return { isInstallable, installPWA };
};
