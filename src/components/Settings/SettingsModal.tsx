import React, { useState, useEffect } from 'react';
import { UserPreferences, ThemeMode, FontSize, AmbientAtmosphereType } from '../../types';
import { 
  X, 
  Globe, 
  Type, 
  Bell, 
  Volume2, 
  RotateCcw, 
  Info, 
  Moon, 
  Sun, 
  Laptop, 
  Palette, 
  HelpCircle, 
  ArrowLeft, 
  User, 
  Sparkles, 
  Play, 
  Square, 
  VolumeX, 
  Trees, 
  Waves, 
  Music,
  ShieldCheck,
  Scale,
  Star,
  Share2,
  ExternalLink
} from 'lucide-react';
import { audioEngine } from '../../utils/audioEngine';
import { ambientAtmosphere } from '../../utils/ambientAtmosphere';
import { AppInstallButton } from '../Install/AppInstallButton';
import { AppLogo } from '../Common/AppLogo';
import { triggerHaptic } from '../../utils/haptics';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  onUpdatePreferences: (updater: (prev: UserPreferences) => UserPreferences) => void;
  onResetProgress: () => void;
  onReplayOnboarding?: () => void;
  onOpenStyleGuide?: () => void;
  onOpenPrivacyPolicy?: (tab?: 'privacy' | 'terms') => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onUpdatePreferences,
  onResetProgress,
  onReplayOnboarding,
  onOpenStyleGuide,
  onOpenPrivacyPolicy,
}) => {
  const [isPreviewing, setIsPreviewing] = useState<boolean>(false);

  // Handle Share App
  const handleShareApp = async () => {
    triggerHaptic('medium');
    const shareData = {
      title: 'GeetaFlow — श्रीमद्भगवद्गीता',
      text: 'श्रीमद्भगवद्गीता का पवित्र ज्ञान, आधुनिक स्वाइप रूप में। अपने जीवन में शांति और स्पष्टता लाएं। डाउनलोड करें GeetaFlow:',
      url: window.location.origin
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled or ignored
      }
    } else {
      navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      alert('GeetaFlow लिंक कॉपी हो गया है! मित्रों के साथ साझा करें।');
    }
  };

  // Handle Rate on Play Store
  const handleRateApp = () => {
    triggerHaptic('success');
    window.open('https://play.google.com/store/apps/details?id=com.geetaflow.app', '_blank');
  };

  // Stop preview sound when modal is closed
  useEffect(() => {
    if (!isOpen && isPreviewing) {
      ambientAtmosphere.stop(0.4);
      setIsPreviewing(false);
    }
  }, [isOpen, isPreviewing]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col w-full h-full bg-neutral-950 text-neutral-100 overflow-hidden animate-fadeIn">
      {/* Top App Bar with Back Navigation */}
      <div className="w-full px-4 py-3.5 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/90 backdrop-blur-md shrink-0">
        <div className="flex items-center space-x-3">
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors flex items-center gap-1.5"
            aria-label="वापस जाएं"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-xs font-hindi hidden sm:inline">वापस</span>
          </button>
          <h2 className="text-base sm:text-lg font-bold font-hindi text-amber-200">
            सेटिंग्स • Settings
          </h2>
        </div>
        <button 
          onClick={onClose} 
          className="p-2 rounded-full text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Scrollable Page Body */}
      <div className="p-4 sm:p-6 flex-1 overflow-y-auto space-y-6 max-w-xl mx-auto w-full no-scrollbar">
          
          {/* App Install Card */}
          <AppInstallButton variant="card" />

          {/* User Profile & Personal Signature for Sharing */}
          <div className="space-y-3 p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800">
            <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400 font-hindi">
              <User className="w-4 h-4" />
              <span>साधक प्रोफ़ाइल व शेयर हस्ताक्षर (Profile & Personal Signature)</span>
            </div>

            <div className="space-y-2.5">
              <div>
                <label className="text-[11px] text-neutral-400 block mb-1 font-hindi">
                  आपका नाम (Your Name):
                </label>
                <input
                  type="text"
                  value={preferences.userName || ''}
                  onChange={(e) => onUpdatePreferences(p => ({ ...p, userName: e.target.value }))}
                  placeholder="उदा. अर्जुन शर्मा / साधक"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-xs font-hindi text-amber-100 placeholder-neutral-500 focus:outline-hidden focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-[11px] text-neutral-400 block mb-1 font-hindi">
                  विचार / परिचय (About / Quote for Share Cards):
                </label>
                <input
                  type="text"
                  value={preferences.userAbout || ''}
                  onChange={(e) => onUpdatePreferences(p => ({ ...p, userAbout: e.target.value }))}
                  placeholder="उदा. कर्मण्येवाधिकारस्ते • साधक"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-xs font-hindi text-amber-100 placeholder-neutral-500 focus:outline-hidden focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-hindi text-neutral-300">
                  श्लोक साझा करते समय मेरा नाम व विचार जोड़ें
                </span>
                <input
                  type="checkbox"
                  checked={preferences.showPersonalSignatureOnShare !== false}
                  onChange={(e) => onUpdatePreferences(p => ({ ...p, showPersonalSignatureOnShare: e.target.checked }))}
                  className="w-4 h-4 accent-amber-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Theme Mode Selector (Light, Dark, System) */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400 font-hindi">
              <Palette className="w-4 h-4" />
              <span>थीम विकल्प (Theme Options)</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { 
                  key: 'light', 
                  label: 'Light (उज्ज्वल)', 
                  icon: <Sun className="w-4 h-4" /> 
                },
                { 
                  key: 'dark', 
                  label: 'Dark (गहरा)', 
                  icon: <Moon className="w-4 h-4" /> 
                },
                { 
                  key: 'system', 
                  label: 'System (सिस्टम)', 
                  icon: <Laptop className="w-4 h-4" /> 
                }
              ].map(th => (
                <button
                  key={th.key}
                  onClick={() => onUpdatePreferences(p => ({ ...p, theme: th.key as ThemeMode }))}
                  className={`py-2.5 px-2 rounded-2xl text-xs font-hindi flex flex-col items-center justify-center space-y-1.5 border transition-all ${
                    preferences.theme === th.key
                      ? 'bg-amber-500 text-neutral-950 font-bold border-amber-400 shadow-md shadow-amber-500/20 scale-102'
                      : 'bg-neutral-950/60 hover:bg-neutral-800 border-neutral-800 text-neutral-300'
                  }`}
                >
                  {th.icon}
                  <span className="text-[11px] whitespace-nowrap">{th.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Language Selection */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400 font-hindi">
              <Globe className="w-4 h-4" />
              <span>पठन भाषा (Reading Language)</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: 'hi', label: 'हिंदी (Hindi)' },
                { key: 'en', label: 'English' },
                { key: 'hinglish', label: 'Hinglish' }
              ].map(lang => (
                <button
                  key={lang.key}
                  onClick={() => onUpdatePreferences(p => ({ ...p, language: lang.key as any }))}
                  className={`py-2 px-3 rounded-xl text-xs font-hindi transition-all ${
                    preferences.language === lang.key
                      ? 'bg-amber-500 text-neutral-950 font-bold'
                      : 'bg-neutral-950/60 border border-neutral-800 text-neutral-300'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* Transliteration Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-950/60 border border-neutral-800">
            <div className="space-y-0.5 max-w-[75%]">
              <span className="text-xs font-medium text-neutral-200 font-hindi block">
                रोमन लिपि (English Transliteration)
              </span>
              <p className="text-[11px] text-neutral-400 font-hindi">
                संस्कृत श्लोकों के नीचे अंग्रेजी उच्चारण दिखाएं
              </p>
            </div>
            <input
              type="checkbox"
              checked={preferences.showTransliteration}
              onChange={(e) => onUpdatePreferences(p => ({ ...p, showTransliteration: e.target.checked }))}
              className="w-5 h-5 accent-amber-500 cursor-pointer rounded"
            />
          </div>

          {/* Font Size Selector */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400 font-hindi">
              <Type className="w-4 h-4" />
              <span>संस्कृत फ़ॉन्ट आकार (Text Size)</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {(['sm', 'md', 'lg', 'xl'] as FontSize[]).map(size => (
                <button
                  key={size}
                  onClick={() => onUpdatePreferences(p => ({ ...p, fontSize: size }))}
                  className={`py-2 rounded-xl text-xs uppercase font-bold transition-all ${
                    preferences.fontSize === size
                      ? 'bg-amber-500 text-neutral-950'
                      : 'bg-neutral-950/60 border border-neutral-800 text-neutral-300'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Daily Notifications */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400 font-hindi">
              <Bell className="w-4 h-4" />
              <span>दैनिक गीता स्मरण (Daily Reminder)</span>
            </div>
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-950/60 border border-neutral-800">
              <span className="text-xs text-neutral-200 font-hindi">सुबह का अमृत संदेश</span>
              <div className="flex items-center space-x-2">
                <input
                  type="time"
                  value={preferences.notificationTime || '07:00'}
                  onChange={(e) => onUpdatePreferences(p => ({ ...p, notificationTime: e.target.value }))}
                  className="bg-neutral-900 border border-neutral-700 rounded-lg px-2 py-1 text-xs text-neutral-200"
                />
                <input
                  type="checkbox"
                  checked={preferences.dailyNotificationEnabled}
                  onChange={(e) => onUpdatePreferences(p => ({ ...p, dailyNotificationEnabled: e.target.checked }))}
                  className="w-4 h-4 accent-amber-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Ambient Atmosphere (लो-फ़ाई ध्यानमय पृष्ठभूमि ध्वनियां) */}
          <div className="space-y-3 p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Volume2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-amber-400 font-hindi block">
                    Ambient Atmosphere • शांत ध्यान वातावरण
                  </span>
                  <span className="text-[10px] text-neutral-400 font-hindi">
                    श्लोक पठन के दौरान शांत व एकाग्र लो-फ़ाई लूप्स
                  </span>
                </div>
              </div>

              {/* Ambient Atmosphere Master Toggle Switch */}
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  id="ambient-atmosphere-toggle"
                  type="checkbox"
                  checked={Boolean(preferences.ambientAtmosphereEnabled || preferences.ambientSound)}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    onUpdatePreferences(p => ({ 
                      ...p, 
                      ambientAtmosphereEnabled: isChecked,
                      ambientSound: isChecked 
                    }));

                    if (isChecked) {
                      ambientAtmosphere.start(
                        preferences.ambientAtmosphereType || 'temple_bells',
                        preferences.ambientVolume || 0.15
                      );
                      setIsPreviewing(true);
                    } else {
                      ambientAtmosphere.stop(0.5);
                      setIsPreviewing(false);
                    }
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>

            {/* When Ambient Atmosphere is Enabled, Show Soundscapes & Volume */}
            {(preferences.ambientAtmosphereEnabled || preferences.ambientSound) && (
              <div className="pt-2 space-y-3.5 border-t border-neutral-800/80 animate-fadeIn">
                
                {/* Soundscapes Selector */}
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-1.5 font-hindi">
                    पृष्ठभूमि ध्यानमय लूप चुनें (Select Meditative Loop):
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { 
                        key: 'temple_bells' as AmbientAtmosphereType, 
                        icon: '🔔', 
                        name: 'मंदिर घंटियां', 
                        sub: 'Temple Bells & Sanctum' 
                      },
                      { 
                        key: 'river' as AmbientAtmosphereType, 
                        icon: '🌊', 
                        name: 'पवित्र गंगा प्रवाह', 
                        sub: 'Mountain River Stream' 
                      },
                      { 
                        key: 'forest' as AmbientAtmosphereType, 
                        icon: '🍃', 
                        name: 'शांत तपोवन', 
                        sub: 'Forest Wind & Chimes' 
                      },
                      { 
                        key: 'tanpura' as AmbientAtmosphereType, 
                        icon: '🕉️', 
                        name: 'वैदिक ओंकार', 
                        sub: 'Vedic Acoustic Drone' 
                      }
                    ].map(item => {
                      const isSelected = (preferences.ambientAtmosphereType || 'temple_bells') === item.key;
                      return (
                        <button
                          key={item.key}
                          onClick={() => {
                            onUpdatePreferences(p => ({ ...p, ambientAtmosphereType: item.key }));
                            ambientAtmosphere.start(item.key, preferences.ambientVolume || 0.15);
                            setIsPreviewing(true);
                          }}
                          className={`p-2.5 rounded-xl border text-left flex items-start space-x-2 transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-amber-500/15 border-amber-400 text-amber-200 shadow-xs'
                              : 'bg-neutral-950/60 hover:bg-neutral-800 border-neutral-800 text-neutral-300'
                          }`}
                        >
                          <span className="text-base leading-none">{item.icon}</span>
                          <div className="leading-tight">
                            <span className="text-[11px] font-bold font-hindi block">{item.name}</span>
                            <span className="text-[9.5px] text-neutral-400 font-sans block">{item.sub}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Volume Slider with percentage */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[11px] font-hindi">
                    <span className="text-neutral-300">वातावरण वॉल्यूम (Atmosphere Volume)</span>
                    <span className="text-amber-400 font-mono font-bold">
                      {Math.round((preferences.ambientVolume || 0.15) * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.03"
                    max="0.45"
                    step="0.02"
                    value={preferences.ambientVolume || 0.15}
                    onChange={(e) => {
                      const vol = parseFloat(e.target.value);
                      onUpdatePreferences(p => ({ ...p, ambientVolume: vol }));
                      ambientAtmosphere.setVolume(vol);
                    }}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-neutral-500 font-sans">
                    <span>धीमी (Subtle)</span>
                    <span>मध्यम (Immersion)</span>
                    <span>स्पष्ट (Deep)</span>
                  </div>
                </div>

                {/* Live Preview Test Toggle Button */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-neutral-400 font-hindi">
                    {isPreviewing ? 'ध्वनि अभी बज रही है (Audio playing)' : 'ध्वनि टेस्ट करने के लिए प्ले करें'}
                  </span>
                  <button
                    onClick={() => {
                      if (isPreviewing) {
                        ambientAtmosphere.stop(0.4);
                        setIsPreviewing(false);
                      } else {
                        ambientAtmosphere.start(
                          preferences.ambientAtmosphereType || 'temple_bells',
                          preferences.ambientVolume || 0.15
                        );
                        setIsPreviewing(true);
                      }
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-hindi flex items-center space-x-1.5 transition-all border cursor-pointer ${
                      isPreviewing
                        ? 'bg-amber-500 text-neutral-950 border-amber-400 font-bold shadow-xs'
                        : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700'
                    }`}
                  >
                    {isPreviewing ? (
                      <>
                        <Square className="w-3 h-3 fill-current" />
                        <span>विराम (Stop)</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 fill-current" />
                        <span>टेस्ट करें (Test)</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            )}
          </div>

          {/* Community & Play Store Actions */}
          <div className="pt-2 border-t border-neutral-800 space-y-2">
            <span className="text-xs font-semibold text-neutral-400 font-hindi block">
              प्ले स्टोर व साझा करें (Google Play & Share)
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleRateApp}
                className="p-3 rounded-xl bg-amber-950/20 hover:bg-amber-950/40 border border-amber-500/40 text-left space-y-1 transition-colors group cursor-pointer"
              >
                <div className="flex items-center space-x-1.5 text-xs text-amber-400 font-hindi font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>५-स्टार रेटिंग दें</span>
                </div>
                <p className="text-[10px] text-neutral-300 font-hindi">
                  Play Store पर अपना अनुभव साझा करें
                </p>
              </button>

              <button
                onClick={handleShareApp}
                className="p-3 rounded-xl bg-neutral-950/60 hover:bg-neutral-800 border border-neutral-800 text-left space-y-1 transition-colors group cursor-pointer"
              >
                <div className="flex items-center space-x-1.5 text-xs text-amber-400 font-hindi font-medium">
                  <Share2 className="w-3.5 h-3.5" />
                  <span>मित्रों को भेजें</span>
                </div>
                <p className="text-[10px] text-neutral-400 font-hindi">
                  व्हाट्सएप पर ऐप लिंक शेयर करें
                </p>
              </button>
            </div>
          </div>

          {/* Guides & Walkthrough */}
          <div className="pt-2 border-t border-neutral-800 space-y-2">
            <span className="text-xs font-semibold text-neutral-400 font-hindi block">
              मार्गदर्शिका व सहायता (Guides & Help)
            </span>
            <div className="grid grid-cols-2 gap-2">
              {onReplayOnboarding && (
                <button
                  onClick={() => {
                    onClose();
                    onReplayOnboarding();
                  }}
                  className="p-3 rounded-xl bg-neutral-950/60 hover:bg-neutral-800 border border-neutral-800 text-left space-y-1 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center space-x-1.5 text-xs text-amber-400 font-hindi font-medium">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>ऐप परिचय (Tour)</span>
                  </div>
                  <p className="text-[10px] text-neutral-400 font-hindi">
                    ऑनबोर्डिंग व कार्ड प्रकार देखें
                  </p>
                </button>
              )}

              {onOpenStyleGuide && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenStyleGuide();
                  }}
                  className="p-3 rounded-xl bg-neutral-950/60 hover:bg-neutral-800 border border-neutral-800 text-left space-y-1 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center space-x-1.5 text-xs text-amber-400 font-hindi font-medium">
                    <Palette className="w-3.5 h-3.5" />
                    <span>कला निर्देशिका</span>
                  </div>
                  <p className="text-[10px] text-neutral-400 font-hindi">
                    चित्र शैली व चरित्र संदर्भ
                  </p>
                </button>
              )}
            </div>
          </div>

          {/* Privacy Policy & Terms of Service */}
          <div className="pt-2 border-t border-neutral-800 space-y-2">
            <span className="text-xs font-semibold text-neutral-400 font-hindi block">
              कानूनी व सुरक्षा नीतियां (Legal & Privacy)
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  if (onOpenPrivacyPolicy) {
                    onOpenPrivacyPolicy('privacy');
                  }
                }}
                className="p-3 rounded-xl bg-neutral-950/60 hover:bg-neutral-800 border border-neutral-800 text-left space-y-1 transition-colors group cursor-pointer"
              >
                <div className="flex items-center space-x-1.5 text-xs text-amber-400 font-hindi font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>गोपनीयता नीति</span>
                </div>
                <p className="text-[10px] text-neutral-400 font-hindi">
                  100% ऑन-डिवाइस डेटा सुरक्षा
                </p>
              </button>

              <button
                onClick={() => {
                  if (onOpenPrivacyPolicy) {
                    onOpenPrivacyPolicy('terms');
                  }
                }}
                className="p-3 rounded-xl bg-neutral-950/60 hover:bg-neutral-800 border border-neutral-800 text-left space-y-1 transition-colors group cursor-pointer"
              >
                <div className="flex items-center space-x-1.5 text-xs text-amber-400 font-hindi font-medium">
                  <Scale className="w-3.5 h-3.5" />
                  <span>सेवा की शर्तें</span>
                </div>
                <p className="text-[10px] text-neutral-400 font-hindi">
                  नियम, शुचिता व मर्यादा
                </p>
              </button>
            </div>
          </div>

          {/* Reset Reading History */}
          <div className="pt-2 border-t border-neutral-800">
            <button
              onClick={() => {
                if (window.confirm('क्या आप अपनी पढ़ने की प्रगति रीसेट करना चाहते हैं?')) {
                  onResetProgress();
                }
              }}
              className="w-full py-2.5 rounded-xl bg-neutral-950/60 hover:bg-rose-950/40 text-neutral-400 hover:text-rose-300 border border-neutral-800 text-xs font-hindi flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>पठन इतिहास रीसेट करें (Reset Data)</span>
            </button>
          </div>

          {/* About GeetaFlow with Unified Logo */}
          <div className="p-4 rounded-3xl bg-neutral-950/80 border border-neutral-800/90 text-left space-y-3">
            <div className="flex items-center space-x-3">
              <AppLogo size="sm" showText={true} />
            </div>
            <p className="text-xs text-neutral-300 font-hindi leading-relaxed">
              GeetaFlow — “The Bhagavad Gita, one scroll at a time.” आधुनिक साधकों और जिज्ञासुओं के लिए श्रीमद्भगवद्गीता का प्रामाणिक, एकाग्र व शांत स्वाध्याय प्रवाह।
            </p>
            <div className="flex items-center justify-between pt-1 border-t border-neutral-800/60 text-[10px] text-neutral-500 font-mono">
              <span>Google Play Store Edition • v1.0.0</span>
              <span className="text-amber-500/80">जय श्रीकृष्ण 🪷</span>
            </div>
          </div>

        </div>

    </div>
  );
};
