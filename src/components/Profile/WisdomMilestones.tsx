import React, { useState } from 'react';
import { 
  Sparkles, 
  Award, 
  Lock, 
  Check, 
  ChevronRight, 
  Share2, 
  BookOpen, 
  Star, 
  ArrowRight,
  X,
  Trophy,
  Flame,
  ShieldCheck
} from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';

export interface Milestone {
  id: string;
  count: number;
  titleHindi: string;
  titleEnglish: string;
  badgeEmoji: string;
  mottoSanskrit: string;
  descriptionHindi: string;
  spiritualMeaning: string;
  tierColor: string;
}

export const WISDOM_MILESTONES: Milestone[] = [
  {
    id: 'first_spark',
    count: 1,
    titleHindi: 'प्रथम दीप',
    titleEnglish: 'First Spark of Wisdom',
    badgeEmoji: '🌱',
    mottoSanskrit: 'विद्यां ददाति विनयं',
    descriptionHindi: 'पवित्र गीता अध्ययन का प्रथम शुभ संकल्प और शुभारम्भ।',
    spiritualMeaning: 'ज्ञान यात्रा का पहला कदम ही अज्ञान के अंधकार को मिटाने की ओर सबसे बड़ा प्रयास है।',
    tierColor: 'from-amber-400 to-amber-600'
  },
  {
    id: 'seeker',
    count: 5,
    titleHindi: 'ज्ञान पिपासु',
    titleEnglish: 'Seeker of Truth',
    badgeEmoji: '📿',
    mottoSanskrit: 'जिज्ञासुरर्थार्थी ज्ञानी',
    descriptionHindi: '5 श्लोक आत्मसात — जीवन के सत्य और समाधान की ओर अग्रसर।',
    spiritualMeaning: 'सच्चा साधक वही है जो प्रश्नों के उत्तर सीधे भगवान के उपदेशों में खोजता है।',
    tierColor: 'from-emerald-400 to-teal-600'
  },
  {
    id: 'equanimity',
    count: 10,
    titleHindi: 'तितिक्षा साधक',
    titleEnglish: 'Practitioner of Balance',
    badgeEmoji: '🕊️',
    mottoSanskrit: 'मात्रास्पर्शास्तु कौन्तेय',
    descriptionHindi: '10 श्लोक पूरे — सुख-दुःख व अनुकूलता-प्रतिकूलता में समत्व का ज्ञान।',
    spiritualMeaning: 'इंद्रियों के द्वंद्व को धैर्यपूर्वक सहन करना ही आंतरिक शांति की पहली सीढ़ी है।',
    tierColor: 'from-cyan-400 to-blue-600'
  },
  {
    id: 'karma_yogi',
    count: 25,
    titleHindi: 'कर्मयोगी',
    titleEnglish: 'Selfless Action Seeker',
    badgeEmoji: '🔱',
    mottoSanskrit: 'योगः कर्मसु कौशलम्',
    descriptionHindi: '25 श्लोक मनन — निष्काम कर्म, कर्तव्य और फल-त्याग का दृढ़ निश्चय।',
    spiritualMeaning: 'कर्म में कुशलता और फल की आसक्ति से मुक्ति ही सच्चा कर्मयोग है।',
    tierColor: 'from-orange-400 to-red-600'
  },
  {
    id: 'sthitaprajna',
    count: 50,
    titleHindi: 'स्थितप्रज्ञ',
    titleEnglish: 'Steady Intellect',
    badgeEmoji: '🔆',
    mottoSanskrit: 'स्थितप्रज्ञस्य का भाषा',
    descriptionHindi: '50 श्लोक सिद्ध — अविचल बुद्धि, शांत मन और आत्म-संतोष।',
    spiritualMeaning: 'जिसका मन सभी परिस्थितियों में शांत और भगवान में स्थिर है, वही स्थितप्रज्ञ है।',
    tierColor: 'from-yellow-400 to-amber-600'
  },
  {
    id: 'sacred_108',
    count: 108,
    titleHindi: 'ब्रह्मनिष्ठ',
    titleEnglish: 'Sacred 108 Knower',
    badgeEmoji: '🪷',
    mottoSanskrit: 'सर्वभूतेषु येनैकं भावम्',
    descriptionHindi: '108 वैदिक श्लोक अध्ययन — सभी प्राणियों में एक ही चेतना का दर्शन।',
    spiritualMeaning: '108 पवित्र वैदिक सूत्रों का ज्ञान अंतर्मन को परमानंद और दिव्यता से भर देता है।',
    tierColor: 'from-purple-400 to-pink-600'
  },
  {
    id: 'gita_marmagya',
    count: 250,
    titleHindi: 'गीता मर्मज्ञ',
    titleEnglish: 'Master of Deep Wisdom',
    badgeEmoji: '👑',
    mottoSanskrit: 'ज्ञानेन तु तदज्ञानं येषां नाशितमात्मनः',
    descriptionHindi: '250 श्लोक सम्पूर्ण — अज्ञान का नाश और परम सत्य का प्रत्यक्ष प्रकाश।',
    spiritualMeaning: 'आधा मार्ग पार कर साधक सांसारिक मोह से ऊपर उठकर दिव्य चेतना में स्थित हो जाता है।',
    tierColor: 'from-amber-300 via-yellow-400 to-orange-500'
  },
  {
    id: 'divine_vision',
    count: 500,
    titleHindi: 'दिव्य दृष्टा',
    titleEnglish: 'Divine Visionary',
    badgeEmoji: '🌌',
    mottoSanskrit: 'दिव्यं ददामि ते चक्षुः',
    descriptionHindi: '500 श्लोक स्वाध्याय — विश्वरूप और अखिल ब्रह्मांड का प्रत्यक्ष बोध।',
    spiritualMeaning: 'भगवान की कृपा से प्राप्त दिव्य दृष्टि से साधक प्रत्येक कण में ईश्वर को देखता है।',
    tierColor: 'from-indigo-400 via-purple-500 to-amber-400'
  },
  {
    id: 'purna_gyanarka',
    count: 700,
    titleHindi: 'पूर्ण ज्ञानार्क',
    titleEnglish: 'Illuminator of Complete Gita',
    badgeEmoji: '🪐',
    mottoSanskrit: 'यत्र योगेश्वरः कृष्णो यत्र पार्थो धनुर्धरः',
    descriptionHindi: 'सम्पूर्ण 700 श्लोक सिद्ध — श्रीमद्भगवद्गीता का पूर्ण आत्मसात।',
    spiritualMeaning: 'सम्पूर्ण गीता का ज्ञान विजय, धर्म, नीति और मोक्ष का अक्षय भंडार है।',
    tierColor: 'from-amber-400 via-rose-500 to-purple-600'
  }
];

interface WisdomMilestonesProps {
  totalReadCount: number;
  onContinueReading: () => void;
  isLight?: boolean;
}

export const WisdomMilestones: React.FC<WisdomMilestonesProps> = ({
  totalReadCount,
  onContinueReading,
  isLight = false
}) => {
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [filterMode, setFilterMode] = useState<'all' | 'unlocked' | 'locked'>('all');

  // Compute unlocked & next milestone
  const unlockedBadges = WISDOM_MILESTONES.filter(m => totalReadCount >= m.count);
  const nextMilestone = WISDOM_MILESTONES.find(m => totalReadCount < m.count) || WISDOM_MILESTONES[WISDOM_MILESTONES.length - 1];
  const highestUnlocked = unlockedBadges.length > 0 ? unlockedBadges[unlockedBadges.length - 1] : null;

  const currentMilestoneBase = highestUnlocked ? highestUnlocked.count : 0;
  const nextTarget = nextMilestone.count;
  const span = Math.max(1, nextTarget - currentMilestoneBase);
  const progressInTier = Math.min(100, Math.max(0, Math.round(((totalReadCount - currentMilestoneBase) / span) * 100)));
  const remainingForNext = Math.max(0, nextMilestone.count - totalReadCount);

  const displayedMilestones = WISDOM_MILESTONES.filter(m => {
    const isUnlocked = totalReadCount >= m.count;
    if (filterMode === 'unlocked') return isUnlocked;
    if (filterMode === 'locked') return !isUnlocked;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* 1. HERO TOTAL WISDOM GATHERED COUNTER CARD */}
      <div className={`p-5 rounded-3xl border relative overflow-hidden transition-all shadow-md ${
        isLight
          ? 'bg-gradient-to-br from-amber-500/10 via-amber-100/40 to-white border-amber-300 text-amber-950 shadow-amber-500/10'
          : 'bg-gradient-to-br from-neutral-900 via-neutral-900 to-amber-950/40 border-amber-500/30 text-neutral-100 shadow-xl'
      }`}>
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-start justify-between relative z-10">
          <div>
            <div className="flex items-center space-x-1.5 mb-1">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className={`text-[11px] font-bold uppercase tracking-wider font-hindi ${
                isLight ? 'text-amber-800' : 'text-amber-400'
              }`}>
                सम्पूर्ण ज्ञान संचय • Total Wisdom Gathered
              </span>
            </div>
            <h3 className={`text-xl font-black font-hindi ${isLight ? 'text-amber-950' : 'text-amber-100'}`}>
              {highestUnlocked ? `${highestUnlocked.badgeEmoji} ${highestUnlocked.titleHindi}` : '🌱 आरंभिक साधक'}
            </h3>
            <p className={`text-xs font-hindi mt-0.5 ${isLight ? 'text-amber-900/80' : 'text-neutral-400'}`}>
              {highestUnlocked ? highestUnlocked.titleEnglish : 'Begin your sacred Gita quest'}
            </p>
          </div>

          {/* Big Number Pill Badge */}
          <div className={`px-4 py-2 rounded-2xl border text-center flex flex-col items-center justify-center shrink-0 shadow-sm ${
            isLight
              ? 'bg-amber-100/80 border-amber-300 text-amber-950'
              : 'bg-neutral-950/80 border-amber-500/40 text-amber-300'
          }`}>
            <span className="text-2xl sm:text-3xl font-black leading-none tracking-tight font-display text-amber-500">
              {totalReadCount}
            </span>
            <span className="text-[10px] font-bold font-hindi mt-0.5 uppercase tracking-wide opacity-90">
              श्लोक आत्मसात
            </span>
          </div>
        </div>

        {/* Next Milestone Progress Bar */}
        <div className="mt-4 pt-3 border-t border-amber-500/20 relative z-10 space-y-2">
          <div className="flex items-center justify-between text-xs font-hindi">
            <span className={`flex items-center gap-1 font-semibold ${isLight ? 'text-amber-900' : 'text-neutral-300'}`}>
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              अगला पदक: <b className="text-amber-500 font-bold">{nextMilestone.badgeEmoji} {nextMilestone.titleHindi}</b> ({nextMilestone.count} श्लोक)
            </span>
            <span className={`font-bold ${isLight ? 'text-amber-950' : 'text-amber-300'}`}>
              {remainingForNext === 0 ? '✓ पूर्ण!' : `${remainingForNext} श्लोक शेष`}
            </span>
          </div>

          {/* Visual Progress Bar */}
          <div className={`w-full h-2.5 rounded-full overflow-hidden p-0.5 border ${
            isLight ? 'bg-amber-100 border-amber-200' : 'bg-neutral-950 border-neutral-800'
          }`}>
            <div 
              className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400 rounded-full transition-all duration-700 shadow-sm"
              style={{ width: `${Math.max(5, progressInTier)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] font-hindi opacity-80 pt-0.5">
            <span>वर्तमान स्तर ({currentMilestoneBase} श्लोक)</span>
            <span>{progressInTier}% पूर्ण</span>
            <span>लक्ष्य ({nextTarget} श्लोक)</span>
          </div>
        </div>

        {/* Quick summary strip */}
        <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs font-hindi">
          <div className={`p-2 rounded-xl border ${
            isLight ? 'bg-white/70 border-amber-200' : 'bg-neutral-950/40 border-neutral-800/80'
          }`}>
            <span className="text-[10px] block opacity-70">अर्जित पदक (Badges)</span>
            <span className="font-bold text-amber-500 text-sm">{unlockedBadges.length} / {WISDOM_MILESTONES.length}</span>
          </div>
          <div className={`p-2 rounded-xl border ${
            isLight ? 'bg-white/70 border-amber-200' : 'bg-neutral-950/40 border-neutral-800/80'
          }`}>
            <span className="text-[10px] block opacity-70">गीता संपूर्णता</span>
            <span className="font-bold text-amber-500 text-sm">{((totalReadCount / 700) * 100).toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* 2. MILESTONE BADGES COLLECTION SECTION */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <Award className="w-4 h-4 text-amber-500" />
            <h4 className={`text-xs font-bold uppercase tracking-wider font-hindi ${
              isLight ? 'text-amber-800' : 'text-amber-400'
            }`}>
              ज्ञान पदक सूची • Badges of Wisdom
            </h4>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-1">
            {(['all', 'unlocked', 'locked'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => {
                  triggerHaptic('light');
                  setFilterMode(mode);
                }}
                className={`px-2 py-0.5 rounded-full text-[10px] font-hindi font-medium transition-all ${
                  filterMode === mode
                    ? 'bg-amber-500 text-neutral-950 font-bold shadow-xs'
                    : isLight
                      ? 'bg-amber-100/60 text-amber-900 hover:bg-amber-100'
                      : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {mode === 'all' ? 'सभी' : mode === 'unlocked' ? `प्राप्त (${unlockedBadges.length})` : 'शेष'}
              </button>
            ))}
          </div>
        </div>

        {/* Milestone Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {displayedMilestones.map((m) => {
            const isUnlocked = totalReadCount >= m.count;
            const isNext = !isUnlocked && m.id === nextMilestone.id;

            return (
              <div
                key={m.id}
                onClick={() => {
                  triggerHaptic('light');
                  setSelectedMilestone(m);
                }}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start space-x-3 group relative overflow-hidden ${
                  isUnlocked
                    ? isLight
                      ? 'bg-gradient-to-br from-amber-50/90 to-white border-amber-300 hover:border-amber-400 text-amber-950 shadow-xs'
                      : 'bg-gradient-to-br from-neutral-900/90 to-neutral-850 border-amber-500/40 hover:border-amber-400 text-neutral-100 shadow-sm'
                    : isNext
                      ? isLight
                        ? 'bg-amber-50/40 border-dashed border-amber-300/80 text-amber-950/70 hover:bg-amber-50'
                        : 'bg-neutral-900/50 border-dashed border-amber-500/30 text-neutral-400 hover:bg-neutral-900'
                      : isLight
                        ? 'bg-neutral-50/50 border-neutral-200 text-neutral-400 opacity-70 hover:opacity-90'
                        : 'bg-neutral-900/30 border-neutral-800/60 text-neutral-500 opacity-60 hover:opacity-85'
                }`}
              >
                {/* Badge Icon Circle */}
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 border transition-transform group-hover:scale-105 shadow-xs ${
                  isUnlocked
                    ? `bg-gradient-to-br ${m.tierColor} text-neutral-950 border-amber-300`
                    : 'bg-neutral-800/60 border-neutral-700/60 text-neutral-400 grayscale'
                }`}>
                  {isUnlocked ? (
                    <span>{m.badgeEmoji}</span>
                  ) : (
                    <Lock className="w-4 h-4 text-neutral-400" />
                  )}
                </div>

                {/* Badge Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h5 className={`text-xs font-bold font-hindi truncate ${
                      isUnlocked 
                        ? isLight ? 'text-amber-950' : 'text-amber-200' 
                        : isLight ? 'text-neutral-600' : 'text-neutral-400'
                    }`}>
                      {m.titleHindi}
                    </h5>
                    
                    {/* Status Chip */}
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-md font-hindi font-bold shrink-0 ${
                      isUnlocked
                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                        : isNext
                          ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                          : 'bg-neutral-800 text-neutral-400'
                    }`}>
                      {isUnlocked ? '✓ प्राप्त' : `${m.count} श्लोक`}
                    </span>
                  </div>

                  <p className={`text-[10px] font-hindi truncate mt-0.5 ${
                    isUnlocked
                      ? isLight ? 'text-amber-800/80 font-medium' : 'text-neutral-300'
                      : 'text-neutral-500'
                  }`}>
                    {m.titleEnglish}
                  </p>

                  <p className={`text-[9px] font-sanskrit italic truncate mt-0.5 ${
                    isUnlocked
                      ? isLight ? 'text-amber-900/70' : 'text-amber-400/80'
                      : 'text-neutral-600'
                  }`}>
                    "{m.mottoSanskrit}"
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. MOTIVATIONAL SCRIPTURAL CALLOUT */}
      <div className={`p-3.5 rounded-2xl border flex items-center space-x-3 text-xs font-hindi ${
        isLight
          ? 'bg-amber-100/50 border-amber-300/70 text-amber-950'
          : 'bg-amber-500/10 border-amber-500/20 text-amber-200'
      }`}>
        <span className="text-xl shrink-0">🪷</span>
        <div className="flex-1 min-w-0">
          <p className="font-sanskrit font-bold text-amber-600 dark:text-amber-400 text-xs">
            "न हि ज्ञानेन सदृशं पवित्रमिह विद्यते"
          </p>
          <p className={`text-[11px] mt-0.5 leading-tight ${isLight ? 'text-amber-900' : 'text-neutral-300'}`}>
            इस संसार में ज्ञान के समान पवित्र करने वाला निःसंदेह कुछ भी नहीं है।
          </p>
        </div>
      </div>

      {/* 4. MODAL / DIALOG FOR MILESTONE DETAILS & CELEBRATION */}
      {selectedMilestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className={`w-full max-w-sm rounded-3xl border p-6 space-y-4 shadow-2xl relative ${
            isLight
              ? 'bg-white border-amber-300 text-amber-950'
              : 'bg-neutral-900 border-amber-500/40 text-neutral-100'
          }`}>
            {/* Close Button */}
            <button
              onClick={() => setSelectedMilestone(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-200 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Big Badge Icon */}
            <div className="text-center pt-2">
              <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center text-4xl shadow-lg border ${
                totalReadCount >= selectedMilestone.count
                  ? `bg-gradient-to-br ${selectedMilestone.tierColor} text-neutral-950 border-amber-300 shadow-amber-500/25 animate-bounce`
                  : 'bg-neutral-800 border-neutral-700 text-neutral-400 grayscale'
              }`}>
                {totalReadCount >= selectedMilestone.count ? selectedMilestone.badgeEmoji : <Lock className="w-8 h-8 text-neutral-400" />}
              </div>

              <span className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-bold font-hindi ${
                totalReadCount >= selectedMilestone.count
                  ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}>
                {totalReadCount >= selectedMilestone.count ? '✓ उपलब्धि अर्जित (Unlocked)' : `${selectedMilestone.count} श्लोक लक्ष्य`}
              </span>

              <h3 className={`text-xl font-black font-hindi mt-2 ${
                isLight ? 'text-amber-950' : 'text-amber-100'
              }`}>
                {selectedMilestone.titleHindi}
              </h3>
              <p className="text-xs font-hindi text-amber-500 font-bold">
                {selectedMilestone.titleEnglish}
              </p>
            </div>

            {/* Vedic Motto */}
            <div className={`p-3 rounded-2xl border text-center font-sanskrit text-sm font-bold ${
              isLight ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-neutral-950 border-neutral-800 text-amber-300'
            }`}>
              ॥ {selectedMilestone.mottoSanskrit} ॥
            </div>

            {/* Description & Meaning */}
            <div className="space-y-2 text-xs font-hindi">
              <p className={isLight ? 'text-amber-950/90' : 'text-neutral-200'}>
                <b>विवरण:</b> {selectedMilestone.descriptionHindi}
              </p>
              <p className={`text-[11px] leading-relaxed ${isLight ? 'text-amber-900/80' : 'text-neutral-400'}`}>
                <b>आध्यात्मिक महत्व:</b> {selectedMilestone.spiritualMeaning}
              </p>
            </div>

            {/* Status & CTA */}
            <div className="pt-2">
              {totalReadCount >= selectedMilestone.count ? (
                <button
                  onClick={() => {
                    triggerHaptic('light');
                    setSelectedMilestone(null);
                    onContinueReading();
                  }}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-neutral-950 font-bold text-xs font-hindi shadow-md hover:brightness-105 active:scale-98 flex items-center justify-center space-x-1.5"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>अगला श्लोक पढ़ें</span>
                </button>
              ) : (
                <div className="space-y-2">
                  <div className="text-center text-xs font-hindi text-amber-500 font-bold">
                    यह पदक अनलॉक करने हेतु {selectedMilestone.count - totalReadCount} और श्लोक पढ़ें
                  </div>
                  <button
                    onClick={() => {
                      triggerHaptic('light');
                      setSelectedMilestone(null);
                      onContinueReading();
                    }}
                    className="w-full py-3 rounded-2xl bg-amber-500 text-neutral-950 font-bold text-xs font-hindi shadow-md hover:brightness-105 active:scale-98 flex items-center justify-center space-x-1.5"
                  >
                    <span>अभी श्लोक पढ़ना जारी रखें</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
