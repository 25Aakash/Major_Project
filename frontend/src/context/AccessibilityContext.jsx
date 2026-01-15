import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import axios from 'axios';

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
  
  // AI Adaptive Features (Feature #5)
  const [behaviorTracking, setBehaviorTracking] = useState({
    zoomFrequency: 0,
    sessionDuration: 0,
    readingSpeed: 200,
    lastAdaptation: null
  });
  const sessionStart = useRef(Date.now());
  const adaptationCheckInterval = useRef(null);

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
    
    // Start adaptive tracking
    startAdaptiveTracking();
    
    return () => {
      if (adaptationCheckInterval.current) {
        clearInterval(adaptationCheckInterval.current);
      }
    };
  }, []);
  
  // AI Adaptive Feature - Auto-adjust settings based on behavior (Feature #5)
  const startAdaptiveTracking = () => {
    // Track zoom events
    const handleZoom = () => {
      setBehaviorTracking(prev => ({ ...prev, zoomFrequency: prev.zoomFrequency + 1 }));
    };
    
    window.addEventListener('resize', handleZoom);
    
    // Check for adaptive settings every 2 minutes
    adaptationCheckInterval.current = setInterval(() => {
      checkAndApplyAdaptiveSettings();
    }, 120000);
    
    // Update session duration
    const durationTimer = setInterval(() => {
      const duration = (Date.now() - sessionStart.current) / 1000 / 60; // minutes
      setBehaviorTracking(prev => ({ ...prev, sessionDuration: duration }));
    }, 60000);
    
    return () => {
      window.removeEventListener('resize', handleZoom);
      clearInterval(durationTimer);
    };
  };
  
  // Check and apply adaptive settings
  const checkAndApplyAdaptiveSettings = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) return;
      
      const response = await axios.post('http://localhost:5001/api/ml/adaptive-ui-settings', {
        behaviorPatterns: behaviorTracking,
        currentSettings: settings
      });
      
      if (response.data.success && response.data.suggestions) {
        const suggestions = response.data.suggestions;
        let applied = false;
        
        // Auto-adjust font size if user zooms frequently
        if (suggestions.fontSize && suggestions.fontSize !== settings.fontSize) {
          setSettings(prev => ({ ...prev, fontSize: suggestions.fontSize }));
          applied = true;
        }
        
        // Switch to dark mode for long sessions
        if (suggestions.colorScheme && suggestions.colorScheme !== settings.colorScheme) {
          setSettings(prev => ({ ...prev, colorScheme: suggestions.colorScheme }));
          applied = true;
        }
        
        // Enable text-to-speech if reading speed is low
        if (suggestions.textToSpeech && !settings.textToSpeech) {
          setSettings(prev => ({ ...prev, textToSpeech: true }));
          applied = true;
        }
        
        // Reduce animations for ADHD patterns
        if (suggestions.reducedAnimations && !settings.reducedAnimations) {
          setSettings(prev => ({ ...prev, reducedAnimations: true, focusMode: true }));
          applied = true;
        }
        
        if (applied) {
          setBehaviorTracking(prev => ({ ...prev, lastAdaptation: new Date() }));
          console.log('✨ Auto-adapted UI settings:', suggestions);
        }
      }
    } catch (error) {
      console.error('Adaptive UI check error:', error);
    }
  };

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
    <AccessibilityContext.Provider value={{ settings, updateSetting, resetSettings, behaviorTracking }}>
      <div className={settings.focusMode ? 'focus-mode' : ''}>
        {children}
      </div>
    </AccessibilityContext.Provider>
  );
};
