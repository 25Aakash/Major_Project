import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { userAPI } from '../services/api';
import { FaSave, FaPalette, FaFont, FaAccessibleIcon, FaBrain } from 'react-icons/fa';

const Settings = () => {
  const { user, isAuthenticated, updateUser } = useUser();
  const { settings, updateSetting, resetSettings } = useAccessibility();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated]);

  const handleSaveSettings = async () => {
    setSaving(true);
    setMessage('');
    
    try {
      await userAPI.updateSettings(user.id, {
        accessibilitySettings: settings
      });
      
      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error saving settings. Please try again.');
      console.error('Save settings error:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Accessibility Settings</h1>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {message}
          </div>
        )}

        {/* Font Settings */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center mb-4">
            <FaFont className="mr-3 text-primary-600 text-xl" />
            <h2 className="text-2xl font-semibold">Text Settings</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Font Size
              </label>
              <select
                value={settings.fontSize}
                onChange={(e) => updateSetting('fontSize', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="small">Small (14px)</option>
                <option value="medium">Medium (16px)</option>
                <option value="large">Large (20px)</option>
                <option value="xlarge">Extra Large (24px)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Font Family
              </label>
              <select
                value={settings.fontFamily}
                onChange={(e) => updateSetting('fontFamily', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="sans">Standard (Sans-serif)</option>
                <option value="opendyslexic">OpenDyslexic (For Dyslexia)</option>
              </select>
              <p className="text-sm text-gray-500 mt-1">
                OpenDyslexic is designed to increase readability for readers with dyslexia
              </p>
            </div>
          </div>
        </div>

        {/* Visual Settings */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center mb-4">
            <FaPalette className="mr-3 text-primary-600 text-xl" />
            <h2 className="text-2xl font-semibold">Visual Settings</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color Scheme
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => updateSetting('colorScheme', 'light')}
                  className={`px-4 py-3 rounded-lg border-2 ${
                    settings.colorScheme === 'light'
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-300'
                  }`}
                >
                  ☀️ Light Mode
                </button>
                <button
                  onClick={() => updateSetting('colorScheme', 'dark')}
                  className={`px-4 py-3 rounded-lg border-2 ${
                    settings.colorScheme === 'dark'
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-300'
                  }`}
                >
                  🌙 Dark Mode
                </button>
              </div>
            </div>

            <ToggleSetting
              label="High Contrast Mode"
              description="Increases contrast for better visibility"
              value={settings.highContrast}
              onChange={(val) => updateSetting('highContrast', val)}
            />

            <ToggleSetting
              label="Reduced Animations"
              description="Minimizes animations and transitions"
              value={settings.reducedAnimations}
              onChange={(val) => updateSetting('reducedAnimations', val)}
            />
          </div>
        </div>

        {/* Focus & Attention Settings */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center mb-4">
            <FaBrain className="mr-3 text-primary-600 text-xl" />
            <h2 className="text-2xl font-semibold">Focus & Attention</h2>
          </div>

          <div className="space-y-4">
            <ToggleSetting
              label="Focus Mode"
              description="Minimizes distractions with centered, simplified layout"
              value={settings.focusMode}
              onChange={(val) => updateSetting('focusMode', val)}
            />

            <ToggleSetting
              label="Text-to-Speech"
              description="Enable audio reading of content"
              value={settings.textToSpeech}
              onChange={(val) => updateSetting('textToSpeech', val)}
            />
          </div>
        </div>

        {/* Learning Preferences */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center mb-4">
            <FaAccessibleIcon className="mr-3 text-primary-600 text-xl" />
            <h2 className="text-2xl font-semibold">Learning Preferences</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Learning Style
              </label>
              <select
                value={user?.learningStyle || 'mixed'}
                onChange={(e) => updateUser({ learningStyle: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="visual">Visual (Images, Videos, Diagrams)</option>
                <option value="auditory">Auditory (Audio, Lectures)</option>
                <option value="kinesthetic">Kinesthetic (Hands-on, Interactive)</option>
                <option value="reading-writing">Reading/Writing (Text-based)</option>
                <option value="mixed">Mixed (Variety of formats)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button
            onClick={resetSettings}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
          >
            Reset to Defaults
          </button>
          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium flex items-center disabled:opacity-50"
          >
            <FaSave className="mr-2" />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

const ToggleSetting = ({ label, description, value, onChange }) => (
  <div className="flex items-center justify-between">
    <div className="flex-1">
      <p className="font-medium text-gray-900">{label}</p>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
    <button
      onClick={() => onChange(!value)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        value ? 'bg-primary-600' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          value ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
);

export default Settings;
