import { useState } from 'react';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';

export const useShare = () => {
  const [sharing, setSharing] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const shareContent = async ({ title, text, url, files }) => {
    setSharing(true);
    try {
      // Use Capacitor Share for Native Platforms
      if (Capacitor.isNativePlatform()) {
        const shareOptions = {
          title: title || 'HHT Aware',
          text: text || '',
          url: url || '',
        };

        // If sharing files, we need to handle them differently in Capacitor
        // For now, we handle basic text/url sharing.
        // File sharing requires paths which we'll handle in specific components.
        if (files && files.length > 0) {
            // If component passed actual File objects, we might need to save them first
            // but for simple text sharing we proceed.
        }

        await Share.share(shareOptions);
        triggerToast('Shared successfully! 🎉');
        setSharing(false);
        return true;
      }

      // Fallback to Web Share API or Clipboard for Web/PWA
      if (navigator.share) {
        await navigator.share({
          title: title || 'HHT Aware',
          text: text || '',
          url: url || window.location.origin
        });
        triggerToast('Shared successfully! 🎉');
        setSharing(false);
        return true;
      }

      const copyText = `${text || ''} ${url || ''}`.trim();
      await navigator.clipboard.writeText(copyText);
      triggerToast('Copied to clipboard! 📋');
      setSharing(false);
      return false;
    } catch (error) {
      console.warn('Sharing failed:', error);
      setSharing(false);
      triggerToast('Sharing cancelled or failed.');
      return false;
    }
  };

  return { shareContent, sharing, toastMessage, triggerToast };
};
