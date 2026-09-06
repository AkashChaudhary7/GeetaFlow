import React, { useState } from 'react';
import { UserPreferences, Shloka } from '../../types';
import { SHLOKAS_DATA, CHAPTERS_META } from '../../data/gitaData';
import { getGitaShloka } from '../../data/allGitaVerses';
import { 
  Crown, 
  Flame, 
  BookOpen, 
  Compass, 
  Settings, 
  ArrowRight, 
  Award, 
  Palette, 
  HelpCircle, 
  Sparkles,
  History,
  Trash2,
  Clock,
  User,
  Edit3,
  Check,
  Share2
} from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';
import { WisdomMilestones } from './WisdomMilestones';
import { AppLogo } from '../Common/AppLogo';
import { ShieldCheck } from 'lucide-react';

interface JourneyViewProps {
  preferences: UserPreferences;
  onContinueReading: () => void;
  onOpenSettings: () => void;
  onOpenPremium: () => void;
  onOpenStyleGuide?: () => void;
  onReplayOnboarding?: () => void;
  onOpenPrivacyPolicy?: (tab?: 'privacy' | 'terms') => void;
  onSelectShloka?: (shloka: Shloka) => void;
  onSelectChapter?: (chapterNumber: number) => void;
  onUpdatePreferences?: (updater: (prev: UserPreferences) => UserPreferences) => void;
  isLight?: boolean;
}

export const JourneyView: React.FC<JourneyViewProps> = ({
  preferences,
  onContinueReading,
  onOpenSettings,
  onOpenPremium,
  onOpenStyleGuide,
  onReplayOnboarding,
  onOpenPrivacyPolicy,
  onSelectShloka,
  onSelectChapter,
  onUpdatePreferences,
  isLight = false
}) => {
  const totalVersesInGita = 700;
  const readVerseIds = Array.isArray(preferences.readVerseIds) ? preferences.readVerseIds : [];
  const readVersesCount = Math.max(readVerseIds.length, preferences.readCount || 0);
  const progressPercent = Math.min(100, Math.round((readVersesCount / totalVersesInGita) * 100));

  // Determine which chapters have been touched
  const readVerseObjs = SHLOKAS_DATA.filter(s => readVerseIds.includes(s.id));
  const chaptersTouched = Array.from(new Set(readVerseObjs.map(s => s.chapter))).length;

  // Chronological Reading History
  const historyList = (preferences.readHistory || []).map(item => {
    const parts = item.shlokaId.split('_');
    const ch = parseInt(parts[1] || '2', 10);
    const v = parseInt(parts[2] || '47', 10);
    const shloka = getGitaShloka(ch, v);
    return {
      ...item,
      shloka
    };
  });

  const formatTimeAgo = (timestamp: number) => {
    const diffMs = Date.now() - timestamp;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 2) return 'अभी-अभी';
    if (diffMins < 60) return `${diffMins} मि. पहले`;
    if (diffHours < 24) return `${diffHours} घंटे पहले`;
    if (diffDays === 1) return 'कल';
    return `${diffDays} दिन पहले`;
  };

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(preferences.userName || '');
  const [profileAbout, setProfileAbout] = useState(preferences.userAbout || '');
  const [showSigOnShare, setShowSigOnShare] = useState(preferences.showPersonalSignatureOnShare !== false);

  const handleClearHistory = () => {
    triggerHaptic('medium');
    if (onUpdatePreferences) {
      onUpdatePreferences(prev => ({
        ...prev,
        readHistory: []
      }));
    }
  };

  const handleSaveProfile = () => {
    triggerHaptic('success');
    if (onUpdatePreferences) {
      onUpdatePreferences(prev => ({
        ...prev,
        userName: profileName.trim(),
        userAbout: profileAbout.trim(),
        showPersonalSignatureOnShare: showSigOnShare
      }));
    }
    setIsEditingProfile(false);
  };

  return (
    <div className={`w-full h-full max-w-lg mx-auto flex flex-col overflow-y-auto no-scrollbar pb-28 p-4 sm:p-6 select-none transition-colors ${
      isLight ? 'bg-white text-amber-950' : 'bg-neutral-950 text-neutral-100'
    }`}>
      
      {/* Header */}
      <div className="pt-2 pb-4 flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold font-hindi ${isLight ? 'text-amber-600' : 'text-amber-200'}`}>
            मेरी गीता यात्रा • My Journey
          </h2>
          <p className={`text-xs font-hindi mt-0.5 ${isLight ? 'text-amber-800/80 font-medium' : 'text-neutral-400'}`}>
            आत्म-कल्याण एवं ज्ञान की शांत प्रगति
          </p>
        </div>
        <button
          onClick={() => {
            triggerHaptic('light');
            onOpenSettings();
          }}
          className={`p-2.5 rounded-2xl border transition-all ${
            isLight
              ? 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100 shadow-xs'
              : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-amber-300 hover:border-neutral-700'
          }`}
          title="सेटिंग्स"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Premium Status Banner */}
      {!preferences.isPremium ? (
        <div 
          onClick={() => {
            triggerHaptic('light');
            onOpenPremium();
          }}
          className={`mb-5 p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
            isLight
              ? 'bg-gradient-to-r from-amber-100/90 via-orange-50/70 to-amber-100/80 border-amber-300 hover:border-amber-400 shadow-xs'
              : 'bg-gradient-to-r from-amber-600/30 via-neutral-900 to-amber-900/20 border-amber-500/30 hover:border-amber-500/60'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${
              isLight ? 'bg-amber-200/80 border-amber-400 text-amber-950' : 'bg-amber-500/20 border-amber-500/40 text-amber-400'
            }`}>
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`text-sm font-bold font-hindi ${isLight ? 'text-amber-900' : 'text-amber-200'}`}>
                GeetaFlow Premium
              </h3>
              <p className={`text-xs font-hindi ${isLight ? 'text-amber-800' : 'text-neutral-300'}`}>
                शांति से पढ़िए। बिना विज्ञापन।
              </p>
            </div>
          </div>
          <button className="px-3 py-1.5 rounded-xl bg-amber-500 text-neutral-950 font-bold text-xs font-hindi shadow-xs">
            अपग्रेड
          </button>
        </div>
      ) : (
        <div className={`mb-5 p-3.5 rounded-2xl border flex items-center space-x-2.5 text-xs font-hindi ${
          isLight
            ? 'bg-amber-100/80 border-amber-300 text-amber-900'
            : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
        }`}>
          <Crown className="w-4 h-4 text-amber-500" />
          <span>आप <b>GeetaFlow Premium</b> सदस्य हैं (विज्ञापन-मुक्त अनुभव)</span>
        </div>
      )}

      {/* Seeker Profile & Personal Signature for Sharing */}
      <div className={`mb-5 p-5 rounded-3xl border transition-all ${
        isLight
          ? 'bg-gradient-to-br from-amber-50/90 via-white to-amber-100/50 border-amber-300 text-amber-950 shadow-xs'
          : 'bg-gradient-to-br from-neutral-900 via-neutral-900 to-amber-950/30 border-neutral-800 text-neutral-100 shadow-md'
      }`}>
        <div className="flex items-center justify-between border-b pb-3.5 mb-3.5">
          <div className="flex items-center space-x-3">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border shadow-xs ${
              isLight ? 'bg-amber-200/80 border-amber-300 text-amber-900' : 'bg-amber-500/20 border-amber-500/30 text-amber-400'
            }`}>
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className={`text-base font-bold font-hindi ${isLight ? 'text-amber-950' : 'text-amber-200'}`}>
                  {preferences.userName || 'साधक प्रोफ़ाइल'}
                </h3>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold font-hindi ${
                  isLight ? 'bg-amber-100 text-amber-900' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  अभ्यासी
                </span>
              </div>
              <p className={`text-xs font-hindi mt-0.5 ${isLight ? 'text-amber-800' : 'text-neutral-400'}`}>
                {preferences.userAbout || 'गीता पथ का पथिक • कर्मयोगी'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              triggerHaptic('light');
              setIsEditingProfile(!isEditingProfile);
            }}
            className={`p-2 rounded-xl border text-xs font-hindi flex items-center space-x-1 transition-all ${
              isLight 
                ? 'bg-white hover:bg-amber-50 border-amber-300 text-amber-900' 
                : 'bg-neutral-800 hover:bg-neutral-700 border-neutral-700 text-neutral-200'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">संपादित करें</span>
          </button>
        </div>

        {/* Profile Edit Fields (Collapsible or Open when editing) */}
        {isEditingProfile ? (
          <div className="space-y-3 pt-1 animate-fadeIn">
            <div>
              <label className={`text-xs font-semibold font-hindi block mb-1 ${isLight ? 'text-amber-900' : 'text-neutral-300'}`}>
                आपका नाम (Your Name):
              </label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="उदा. अर्जुन शर्मा / साधक"
                className={`w-full px-3 py-2 rounded-xl border text-xs font-hindi focus:outline-hidden ${
                  isLight
                    ? 'bg-white border-amber-300 text-amber-950 placeholder-amber-800/40'
                    : 'bg-neutral-950 border-neutral-700 text-amber-100 placeholder-neutral-500'
                }`}
              />
            </div>

            <div>
              <label className={`text-xs font-semibold font-hindi block mb-1 ${isLight ? 'text-amber-900' : 'text-neutral-300'}`}>
                आपके विचार / परिचय (About / Motto):
              </label>
              <input
                type="text"
                value={profileAbout}
                onChange={(e) => setProfileAbout(e.target.value)}
                placeholder="उदा. कर्मण्येवाधिकारस्ते • साधक"
                className={`w-full px-3 py-2 rounded-xl border text-xs font-hindi focus:outline-hidden ${
                  isLight
                    ? 'bg-white border-amber-300 text-amber-950 placeholder-amber-800/40'
                    : 'bg-neutral-950 border-neutral-700 text-amber-100 placeholder-neutral-500'
                }`}
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showSigOnShare}
                  onChange={(e) => setShowSigOnShare(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 rounded"
                />
                <span className={`text-xs font-hindi ${isLight ? 'text-amber-900' : 'text-neutral-300'}`}>
                  शेयर कार्ड पर मेरा नाम व विचार जोड़ें
                </span>
              </label>

              <button
                onClick={handleSaveProfile}
                className="px-4 py-1.5 rounded-xl bg-amber-500 text-neutral-950 font-bold text-xs font-hindi shadow-xs flex items-center space-x-1 hover:bg-amber-400 active:scale-95 transition-all"
              >
                <Check className="w-3.5 h-3.5" />
                <span>सहेजें</span>
              </button>
            </div>
          </div>
        ) : (
          /* Live Personal Signature Preview Banner for Sharing */
          <div className={`p-3 rounded-2xl border flex flex-col space-y-1.5 ${
            isLight
              ? 'bg-amber-100/60 border-amber-300/80 text-amber-950'
              : 'bg-amber-500/10 border-amber-500/20 text-amber-200'
          }`}>
            <div className="flex items-center justify-between text-[11px] font-hindi">
              <span className="font-bold flex items-center gap-1 text-amber-600 dark:text-amber-400">
                <Sparkles className="w-3 h-3" />
                शेयर कार्ड पर व्यक्तिगत स्पर्श (Personal Touch)
              </span>
              <span className={`text-[10px] ${preferences.showPersonalSignatureOnShare !== false ? 'text-emerald-500 font-bold' : 'text-neutral-400'}`}>
                {preferences.showPersonalSignatureOnShare !== false ? '✓ सक्रिय' : 'निष्क्रीय'}
              </span>
            </div>

            <div className={`px-3 py-2 rounded-xl text-center border ${
              isLight ? 'bg-white/80 border-amber-200' : 'bg-neutral-950/80 border-amber-500/30'
            }`}>
              <p className="text-xs font-bold font-hindi text-amber-500">
                {preferences.userName || 'आपका नाम यहाँ दिखेगा'}
              </p>
              <p className={`text-[11px] font-hindi italic ${isLight ? 'text-amber-800' : 'text-neutral-300'}`}>
                "{preferences.userAbout || 'आपके विचार या पसंदीदा सूत्र यहाँ कार्ड पर प्रकाशित होंगे'}"
              </p>
            </div>
            <p className={`text-[10px] font-hindi text-center ${isLight ? 'text-amber-800/80' : 'text-neutral-400'}`}>
              जब आप कोई भी श्लोक व्हाट्सएप या सोशल मीडिया पर साझा करेंगे, तो आपका नाम सुंदर और स्पष्ट रूप से कार्ड पर उभरेगा।
            </p>
          </div>
        )}
      </div>

      {/* VISUAL 'TOTAL WISDOM GATHERED' COUNTER & MILESTONE BADGES */}
      <div className="mb-5">
        <WisdomMilestones
          totalReadCount={readVersesCount}
          onContinueReading={onContinueReading}
          isLight={isLight}
        />
      </div>

      {/* Reading Progress Card */}
      <div className={`mb-5 p-5 rounded-3xl border space-y-4 shadow-sm ${
        isLight
          ? 'bg-white border-amber-300 text-amber-950 shadow-amber-500/5'
          : 'bg-neutral-900/90 border-neutral-800 text-neutral-100'
      }`}>
        <div className="flex items-center justify-between">
          <span className={`text-xs font-bold uppercase tracking-wider font-hindi ${
            isLight ? 'text-amber-700' : 'text-amber-400'
          }`}>
            सम्पूर्ण गीता प्रगति
          </span>
          <span className={`text-sm font-bold font-hindi ${isLight ? 'text-amber-900' : 'text-amber-200'}`}>
            {readVersesCount} / {totalVersesInGita} श्लोक ({progressPercent}%)
          </span>
        </div>

        {/* Progress Bar */}
        <div className={`w-full h-3 rounded-full overflow-hidden p-0.5 border ${
          isLight ? 'bg-amber-100/80 border-amber-200' : 'bg-neutral-950 border-neutral-800'
        }`}>
          <div 
            className="h-full bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${Math.max(progressPercent, 4)}%` }}
          />
        </div>

        {/* Stats Grid */}
        <div className={`grid grid-cols-3 gap-2 pt-2 border-t text-center ${
          isLight ? 'border-amber-200' : 'border-neutral-800/80'
        }`}>
          <div className={`p-2.5 rounded-xl border ${
            isLight ? 'bg-amber-50/70 border-amber-200' : 'bg-neutral-950/60 border-neutral-800/60'
          }`}>
            <div className="flex items-center justify-center text-amber-500 mb-1">
              <Flame className="w-4 h-4" />
            </div>
            <span className={`text-base font-bold font-hindi block ${isLight ? 'text-amber-950' : 'text-neutral-100'}`}>
              {preferences.streakDays || 1} दिन
            </span>
            <span className={`text-[10px] font-hindi ${isLight ? 'text-amber-800/80' : 'text-neutral-400'}`}>
              नियमित स्वाध्याय
            </span>
          </div>

          <div className={`p-2.5 rounded-xl border ${
            isLight ? 'bg-amber-50/70 border-amber-200' : 'bg-neutral-950/60 border-neutral-800/60'
          }`}>
            <div className="flex items-center justify-center text-emerald-500 mb-1">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className={`text-base font-bold font-hindi block ${isLight ? 'text-amber-950' : 'text-neutral-100'}`}>
              {chaptersTouched || 1} / 18
            </span>
            <span className={`text-[10px] font-hindi ${isLight ? 'text-amber-800/80' : 'text-neutral-400'}`}>
              अध्याय स्पर्श
            </span>
          </div>

          <div className={`p-2.5 rounded-xl border ${
            isLight ? 'bg-amber-50/70 border-amber-200' : 'bg-neutral-950/60 border-neutral-800/60'
          }`}>
            <div className="flex items-center justify-center text-indigo-500 mb-1">
              <Award className="w-4 h-4" />
            </div>
            <span className={`text-base font-bold font-hindi block ${isLight ? 'text-amber-950' : 'text-neutral-100'}`}>
              {(preferences.bookmarkedIds || []).length}
            </span>
            <span className={`text-[10px] font-hindi ${isLight ? 'text-amber-800/80' : 'text-neutral-400'}`}>
              सहेजे गए श्लोक
            </span>
          </div>
        </div>

        {/* Continue Reading Button */}
        <button
          onClick={() => {
            triggerHaptic('light');
            onContinueReading();
          }}
          className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:brightness-105 text-neutral-950 font-bold text-sm font-hindi flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20 transition-all active:scale-98"
        >
          <span>आगे का स्वाध्याय जारी रखें</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* RECENTLY READ VERSES HISTORY SECTION (Requested Feature) */}
      <div className="mb-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <History className={`w-4 h-4 ${isLight ? 'text-amber-700' : 'text-amber-400'}`} />
            <span className={`text-xs font-bold uppercase tracking-wider font-hindi ${
              isLight ? 'text-amber-700' : 'text-amber-400'
            }`}>
              पठन इतिहास • Recently Read Verses
            </span>
          </div>
          {historyList.length > 0 && (
            <button
              onClick={handleClearHistory}
              className={`text-[11px] font-hindi flex items-center space-x-1 transition-colors ${
                isLight ? 'text-amber-800/70 hover:text-rose-600' : 'text-neutral-400 hover:text-rose-400'
              }`}
              title="इतिहास साफ़ करें"
            >
              <Trash2 className="w-3 h-3" />
              <span>साफ़ करें</span>
            </button>
          )}
        </div>

        {historyList.length === 0 ? (
          <div className={`p-4 rounded-2xl border text-center space-y-2 ${
            isLight ? 'bg-amber-50/50 border-amber-200/80 text-amber-900' : 'bg-neutral-900/60 border-neutral-800/80 text-neutral-300'
          }`}>
            <p className="text-xs font-hindi">
              आपने अभी तक कोई श्लोक नहीं पढ़ा है। जैसे-जैसे आप श्लोक पढ़ेंगे, वे कालक्रम (chronological order) में यहाँ दिखेंगे।
            </p>
            <button
              onClick={() => {
                triggerHaptic('light');
                onContinueReading();
              }}
              className="px-3 py-1 rounded-xl bg-amber-500 text-neutral-950 font-bold text-xs font-hindi inline-flex items-center space-x-1"
            >
              <span>पहला श्लोक पढ़ें</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {historyList.slice(0, 10).map((item, idx) => (
              <div
                key={`${item.shlokaId}-${item.timestamp}-${idx}`}
                onClick={() => {
                  triggerHaptic('light');
                  if (onSelectShloka) {
                    onSelectShloka(item.shloka);
                  } else {
                    onContinueReading();
                  }
                }}
                className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between group shadow-xs ${
                  isLight
                    ? 'bg-white border-amber-200/90 hover:border-amber-400 hover:bg-amber-50/40 text-amber-950'
                    : 'bg-neutral-900/70 border-neutral-800 hover:border-amber-500/50 hover:bg-neutral-850 text-neutral-100'
                }`}
              >
                <div className="space-y-1 pr-3 flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-hindi ${
                      isLight ? 'bg-amber-100 text-amber-950' : 'bg-amber-500/15 text-amber-300'
                    }`}>
                      अध्याय {item.shloka.chapter} • श्लोक {item.shloka.verse}
                    </span>
                    <span className={`text-[10px] font-hindi truncate ${
                      isLight ? 'text-amber-800/70' : 'text-neutral-400'
                    }`}>
                      {item.shloka.chapterNameHindi}
                    </span>
                  </div>
                  <p className={`font-sanskrit text-xs font-bold truncate ${
                    isLight ? 'text-amber-800' : 'text-amber-200'
                  }`}>
                    {item.shloka.sanskrit.split('\n')[0]}
                  </p>
                  <p className={`text-[11px] font-hindi line-clamp-1 ${
                    isLight ? 'text-amber-950/80 font-medium' : 'text-neutral-300'
                  }`}>
                    {item.shloka.simpleHindi}
                  </p>
                </div>

                <div className="flex flex-col items-end space-y-1 shrink-0">
                  <span className={`text-[10px] font-hindi flex items-center gap-1 ${
                    isLight ? 'text-amber-700/80 font-medium' : 'text-neutral-400'
                  }`}>
                    <Clock className="w-2.5 h-2.5" />
                    {formatTimeAgo(item.timestamp)}
                  </span>
                  <div className="w-6 h-6 rounded-full bg-amber-500/15 text-amber-500 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chapters Overview List */}
      <div className="space-y-3">
        <span className={`text-xs font-bold uppercase tracking-wider font-hindi block ${
          isLight ? 'text-amber-700' : 'text-amber-400'
        }`}>
          अध्यायवार प्रगति
        </span>

        <div className="space-y-2">
          {CHAPTERS_META.slice(0, 6).map(ch => {
            const isTouched = readVerseObjs.some(v => v.chapter === ch.chapter);
            return (
              <div 
                key={ch.chapter}
                onClick={() => {
                  triggerHaptic('light');
                  if (onSelectChapter) onSelectChapter(ch.chapter);
                }}
                className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  isLight
                    ? 'bg-white border-amber-200/90 hover:border-amber-400 hover:bg-amber-50/50 text-amber-950'
                    : 'bg-neutral-900/60 border-neutral-800/80 hover:border-amber-500/40 hover:bg-neutral-850 text-neutral-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold font-hindi ${
                    isTouched 
                      ? 'bg-amber-500 text-neutral-950 font-bold' 
                      : isLight 
                        ? 'bg-amber-100 text-amber-800' 
                        : 'bg-neutral-800 text-neutral-400'
                  }`}>
                    {ch.chapter}
                  </span>
                  <div>
                    <span className={`font-sanskrit text-sm font-bold ${
                      isLight ? 'text-amber-900' : 'text-neutral-200'
                    }`}>
                      {ch.sanskritName}
                    </span>
                    <p className={`text-[11px] font-hindi ${
                      isLight ? 'text-amber-800/80 font-medium' : 'text-neutral-400'
                    }`}>
                      {ch.hindiName}
                    </p>
                  </div>
                </div>
                <span className={`text-[11px] font-hindi ${
                  isLight ? 'text-amber-700/80 font-medium' : 'text-neutral-500'
                }`}>
                  {ch.totalVerses} श्लोक
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Guides & Design System Section */}
      <div className="space-y-3 pt-4">
        <span className={`text-xs font-bold uppercase tracking-wider font-hindi block ${
          isLight ? 'text-amber-700' : 'text-amber-400'
        }`}>
          मार्गदर्शिका व सौंदर्यशास्त्र
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {onOpenStyleGuide && (
            <button
              onClick={() => {
                triggerHaptic('light');
                onOpenStyleGuide();
              }}
              className={`p-3.5 rounded-2xl border text-left space-y-1.5 transition-all group shadow-xs ${
                isLight
                  ? 'bg-white border-amber-300/80 hover:border-amber-400 hover:bg-amber-50/50 text-amber-950'
                  : 'bg-neutral-900/80 hover:bg-neutral-850 border-amber-500/20 hover:border-amber-500/40 text-neutral-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`flex items-center space-x-2 font-hindi font-bold text-xs ${
                  isLight ? 'text-amber-800' : 'text-amber-400'
                }`}>
                  <Palette className="w-4 h-4 text-amber-500" />
                  <span>कला निर्देशिका (Style Guide)</span>
                </div>
                <span className="text-[10px] font-mono text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded-md font-bold">
                  v1.0
                </span>
              </div>
              <p className={`text-[11px] font-hindi leading-snug ${
                isLight ? 'text-amber-950/80' : 'text-neutral-300'
              }`}>
                श्रीकृष्ण व अर्जुन के प्रामाणिक रूप, वैदिक रंग पैलेट और AI प्रॉम्प्ट नियमावली।
              </p>
            </button>
          )}

          {onReplayOnboarding && (
            <button
              onClick={() => {
                triggerHaptic('light');
                onReplayOnboarding();
              }}
              className={`p-3.5 rounded-2xl border text-left space-y-1.5 transition-all group shadow-xs cursor-pointer ${
                isLight
                  ? 'bg-white border-amber-200 hover:border-amber-400 hover:bg-amber-50/50 text-amber-950'
                  : 'bg-neutral-900/80 hover:bg-neutral-850 border-neutral-800 hover:border-neutral-700 text-neutral-100'
              }`}
            >
              <div className={`flex items-center space-x-2 font-hindi font-bold text-xs ${
                isLight ? 'text-amber-800' : 'text-amber-400'
              }`}>
                <HelpCircle className="w-4 h-4 text-amber-500" />
                <span>ऐप परिचय (Replay Tour)</span>
              </div>
              <p className={`text-[11px] font-hindi leading-snug ${
                isLight ? 'text-amber-950/80' : 'text-neutral-300'
              }`}>
                स्वाइप प्रणाली, कार्ड प्रकार और 'Ask Gita' AI मार्गदर्शक का संक्षिप्त परिचय।
              </p>
            </button>
          )}

          {onOpenPrivacyPolicy && (
            <button
              onClick={() => {
                triggerHaptic('light');
                onOpenPrivacyPolicy('privacy');
              }}
              className={`p-3.5 rounded-2xl border text-left space-y-1.5 transition-all group shadow-xs cursor-pointer ${
                isLight
                  ? 'bg-white border-amber-200 hover:border-amber-400 hover:bg-amber-50/50 text-amber-950'
                  : 'bg-neutral-900/80 hover:bg-neutral-850 border-neutral-800 hover:border-neutral-700 text-neutral-100'
              }`}
            >
              <div className={`flex items-center space-x-2 font-hindi font-bold text-xs ${
                isLight ? 'text-amber-800' : 'text-amber-400'
              }`}>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>गोपनीयता नीति (Privacy)</span>
              </div>
              <p className={`text-[11px] font-hindi leading-snug ${
                isLight ? 'text-amber-950/80' : 'text-neutral-300'
              }`}>
                100% ऑन-डिवाइस डेटा सुरक्षा, शून्य ट्रैकिंग एवं प्ले स्टोर नियम।
              </p>
            </button>
          )}
        </div>
      </div>

      {/* Brand Footer */}
      <div className="pt-4 flex flex-col items-center justify-center space-y-2 text-center opacity-80">
        <AppLogo size="xs" showText={true} isLight={isLight} />
        <span className="text-[10px] font-mono text-neutral-500">
          GeetaFlow • v1.0.0 (Play Store Edition)
        </span>
      </div>

    </div>
  );
};
