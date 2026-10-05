'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface SiteSettings {
  hotline: string;
  whatsapp: string;
  email: string;
  instagram: string;
  facebook: string;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  hotline: '0811-9876-5431',
  whatsapp: '6281198765431',
  email: 'studi.migran@gmail.com',
  instagram: 'https://www.instagram.com/studi.migran?stkn=bTJhamFpZ2t0dWNu',
  facebook: 'https://www.facebook.com/share/14zwVKwALbg/',
};

interface SettingsContextType {
  settings: SiteSettings;
  refreshSettings: () => Promise<void>;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: DEFAULT_SETTINGS,
  refreshSettings: async () => {},
  loading: false,
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(false);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings({
          hotline: data.hotline || DEFAULT_SETTINGS.hotline,
          whatsapp: data.whatsapp || DEFAULT_SETTINGS.whatsapp,
          email: data.email || DEFAULT_SETTINGS.email,
          instagram: data.instagram || DEFAULT_SETTINGS.instagram,
          facebook: data.facebook || DEFAULT_SETTINGS.facebook,
        });
      }
    } catch {
      // Fallback tetap menggunakan default jika terjadi kendala jaringan
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, refreshSettings: fetchSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SettingsContext);
}
