import React, { createContext, useState, useContext, useEffect } from 'react';

const AccessibilityContext = createContext();

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};

export const AccessibilityProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    fontSize: 'medium',
    fontFamily: 'sans',
    colorScheme: 'light',
    textToSpeech: false,
    reducedAnimations: false,
    focusMode: false,
    highContrast: false,
  });

  useEffect(() => {
    // Load saved settings
    const saved = localStorage.getItem('accessibility_settings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }

    // Check system preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setSettings(prev => ({ ...prev, reducedAnimations: true }));
    }
    if (window.matchMedia('(prefers-contrast: high)').matches) {
      setSettings(prev => ({ ...prev, highContrast: true }));
    }
  }, []);

  useEffect(() => {
    // Apply settings to document
    document.documentElement.classList.toggle('dark', settings.colorScheme === 'dark');
    document.documentElement.style.fontSize = {
      small: '14px',
      medium: '16px',
      large: '20px',
      xlarge: '24px',
    }[settings.fontSize];

    if (settings.fontFamily === 'opendyslexic') {
      document.body.classList.add('dyslexic-font');
    } else {
      document.body.classList.remove('dyslexic-font');
    }

    // Save to localStorage
    localStorage.setItem('accessibility_settings', JSON.stringify(settings));
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    const defaults = {
      fontSize: 'medium',
      fontFamily: 'sans',
      colorScheme: 'light',
      textToSpeech: false,
      reducedAnimations: false,
      focusMode: false,
      highContrast: false,
    };
    setSettings(defaults);
  };

  return (
    <AccessibilityContext.Provider value={{ settings, updateSetting, resetSettings }}>
      <div className={settings.focusMode ? 'focus-mode' : ''}>
        {children}
      </div>
    </AccessibilityContext.Provider>
  );
};
