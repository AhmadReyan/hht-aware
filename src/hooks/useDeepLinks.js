import { useEffect } from 'react';
import { App } from '@capacitor/app';
import { useNavigate } from 'react-router-dom';

export const useDeepLinks = () => {
  const navigate = useNavigate();

  useEffect(() => {
    App.addListener('appUrlOpen', data => {
      // Example: https://app.hhtaware.com/facts -> /facts
      const slug = data.url.split('.com').pop();
      if (slug) {
        navigate(slug);
      }
    });
  }, [navigate]);
};
