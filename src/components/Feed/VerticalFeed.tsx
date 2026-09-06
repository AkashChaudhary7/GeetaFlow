import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { FeedCardItem, UserPreferences, Shloka } from '../../types';
import { ShlokaCard } from './ShlokaCard';
import { SituationCard } from './SituationCard';
import { TopicCard } from './TopicCard';
import { ChapterIntroCard } from './ChapterIntroCard';
import { ContextCard } from './ContextCard';
import { DailyWisdomCard } from './DailyWisdomCard';
import { AdCard } from './AdCard';
import { SwipeTutorialOverlay } from './SwipeTutorialOverlay';
import { triggerHaptic } from '../../utils/haptics';
import { audioEngine } from '../../utils/audioEngine';
import { ambientAtmosphere } from '../../utils/ambientAtmosphere';
import { AppLogo } from '../Common/AppLogo';
import { admobService } from '../../services/admob';
import { 
  Sparkles, 
  ChevronUp, 
  ChevronDown, 
  Compass, 
  X,
  RotateCw
} from 'lucide-react';

interface VerticalFeedProps {
  feedItems: FeedCardItem[];
  preferences: UserPreferences;
  onUpdatePreferences: (updater: (prev: UserPreferences) => UserPreferences) => void;
  onOpenShare: (shloka: Shloka) => void;
  onDownloadVideo?: (shloka: Shloka) => void;
  onOpenPremium: () => void;
  onOpenAskGita: () => void;
  onSelectMood: (mood: string | null) => void;
  selectedMood: string | null;
  onOpenTopic?: (topic: string) => void;
  onOpenChaptersModal?: () => void;
  onRefreshFeed?: () => void;
  isLight?: boolean;
}

const QUICK_MOODS = [
  { label: 'तनाव व चिंता', emoji: '🌧️', query: 'anxiety' },
  { label: 'निर्णय न ले पाना', emoji: '⚖️', query: 'confusion' },
  { label: 'क्रोध व अशांति', emoji: '🔥', query: 'anger' },
  { label: 'उत्साह की कमी', emoji: '🌱', query: 'motivation' },
  { label: 'आंतरिक शांति', emoji: '🕊️', query: 'peace' },
  { label: 'भय व असुरक्षा', emoji: '🛡️', query: 'fear' }
];

export const VerticalFeed: React.FC<VerticalFeedProps> = ({
  feedItems,
  preferences,
  onUpdatePreferences,
  onOpenShare,
  onDownloadVideo,
  onOpenPremium,
  onOpenAskGita,
  onSelectMood,
  selectedMood,
  onOpenTopic,
  onOpenChaptersModal,
  onRefreshFeed,
  isLight = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    return Math.min(preferences.lastReadIndex || 0, Math.max(0, feedItems.length - 1));
  });
  const [showMoodBanner, setShowMoodBanner] = useState(false);
  const touchStartY = useRef<number>(0);
  const touchStartTime = useRef<number>(0);
  const isTransitioningRef = useRef<boolean>(false);
  const isWheelLockedRef = useRef<boolean>(false);
  const shlokasReadSinceAdRef = useRef<number>(0);

  // Time of day badge indicator
  const timeGreeting = useMemo(() => {
    const h = new Date().getHours();
    if (h >= 4 && h < 12) return { text: 'प्रातःकालीन चिंतन', icon: '🌅' };
    if (h >= 12 && h < 17) return { text: 'मध्याह्न कर्मयोग', icon: '☀️' };
    if (h >= 17 && h < 21) return { text: 'संध्याकालीन शांति', icon: '🌇' };
    return { text: 'रात्रिकालीन आत्ममंथन', icon: '🌙' };
  }, []);

  // Scroll to targeted index smoothly
  const scrollToIndex = useCallback((index: number) => {
    if (index < 0 || index >= feedItems.length) return;
    setCurrentIndex(index);
  }, [feedItems.length]);

  // Touch Swipe Handling (Native Instagram Reels feel)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartTime.current = Date.now();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isTransitioningRef.current) return;
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY;
    const duration = Date.now() - touchStartTime.current;

    const isFlick = Math.abs(diff) > 25 && duration < 300;
    const isDrag = Math.abs(diff) > 40;

    if (isFlick || isDrag) {
      if (diff > 0 && currentIndex < feedItems.length - 1) {
        triggerHaptic('light');
        isTransitioningRef.current = true;
        setCurrentIndex(prev => prev + 1);
        setTimeout(() => {
          isTransitioningRef.current = false;
        }, 320);
      } else if (diff < 0 && currentIndex > 0) {
        triggerHaptic('light');
        isTransitioningRef.current = true;
        setCurrentIndex(prev => prev - 1);
        setTimeout(() => {
          isTransitioningRef.current = false;
        }, 320);
      }
    }
  };

  // Mouse Wheel swipe handling
  const handleWheel = (e: React.WheelEvent) => {
    if (isWheelLockedRef.current) return;
    const WHEEL_THRESHOLD = 25;
    if (Math.abs(e.deltaY) > WHEEL_THRESHOLD) {
      isWheelLockedRef.current = true;
      if (e.deltaY > 0 && currentIndex < feedItems.length - 1) {
        triggerHaptic('light');
        setCurrentIndex(prev => prev + 1);
      } else if (e.deltaY < 0 && currentIndex > 0) {
        triggerHaptic('light');
        setCurrentIndex(prev => prev - 1);
      }
      setTimeout(() => {
        isWheelLockedRef.current = false;
      }, 350);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'j') {
        scrollToIndex(currentIndex + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        scrollToIndex(currentIndex - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, scrollToIndex]);

  // Track progress and update history
  useEffect(() => {
    const currentItem = feedItems[currentIndex];
    if (currentItem && currentItem.type === 'shloka') {
      const shloka = currentItem.data;
      shlokasReadSinceAdRef.current += 1;

      // Smart Frequency-Capped Interstitial Ad Trigger
      if (shlokasReadSinceAdRef.current >= 8 && !preferences.isPremium) {
        admobService.showInterstitialAd('feed_milestone').then((shown) => {
          if (shown) {
            shlokasReadSinceAdRef.current = 0;
          }
        });
      }

      onUpdatePreferences(prev => {
        const readIds = Array.isArray(prev.readVerseIds) ? prev.readVerseIds : [];
        const updatedReadIds = readIds.includes(shloka.id) ? readIds : [...readIds, shloka.id];
        
        const history = Array.isArray(prev.readHistory) ? prev.readHistory : [];
        const filteredHistory = history.filter(item => item.shlokaId !== shloka.id);
        const updatedHistory = [
          { shlokaId: shloka.id, timestamp: Date.now() },
          ...filteredHistory
        ].slice(0, 50);

        return {
          ...prev,
          lastReadVerseId: shloka.id,
          lastReadIndex: currentIndex,
          readVerseIds: updatedReadIds,
          readHistory: updatedHistory,
          readCount: updatedReadIds.length,
        };
      });
    }
  }, [currentIndex, feedItems, onUpdatePreferences]);

  const toggleBookmark = (id: string) => {
    onUpdatePreferences(prev => {
      const current = Array.isArray(prev.bookmarkedIds) ? prev.bookmarkedIds : [];
      const exists = current.includes(id);
      return {
        ...prev,
        bookmarkedIds: exists ? current.filter(x => x !== id) : [...current, id]
      };
    });
  };

  const toggleLike = (id: string) => {
    onUpdatePreferences(prev => {
      const current = Array.isArray(prev.likedIds) ? prev.likedIds : [];
      const exists = current.includes(id);
      return {
        ...prev,
        likedIds: exists ? current.filter(x => x !== id) : [...current, id]
      };
    });
  };

  const jumpToShlokaId = (shlokaId: string) => {
    const targetIdx = feedItems.findIndex(
      item => item.type === 'shloka' && item.data.id === shlokaId
    );
    if (targetIdx !== -1) {
      scrollToIndex(targetIdx);
    }
  };

  const jumpToVerse = (chapter: number, verse: number) => {
    const targetId = `bg_${chapter}_${verse}`;
    const targetIdx = feedItems.findIndex(
      item => item.type === 'shloka' && (item.data.id === targetId || (item.data.chapter === chapter && item.data.verse === verse))
    );
    if (targetIdx !== -1) {
      scrollToIndex(targetIdx);
    }
  };

  const currentCard = feedItems[currentIndex];
  const progressPercent = Math.min(100, Math.round(((currentIndex + 1) / Math.max(1, feedItems.length)) * 100));

  // Stop previous audio playback when swiping to a new card
  useEffect(() => {
    audioEngine.stop();
  }, [currentIndex]);

  // Meditative Ambient Atmosphere management during shloka reading
  useEffect(() => {
    const isShlokaCard = currentCard?.type === 'shloka';
    const isAtmosphereEnabled = Boolean(preferences.ambientAtmosphereEnabled || preferences.ambientSound);

    if (isAtmosphereEnabled && isShlokaCard) {
      ambientAtmosphere.start(
        preferences.ambientAtmosphereType || 'temple_bells',
        preferences.ambientVolume || 0.15
      );
    } else {
      ambientAtmosphere.stop(0.8);
    }
  }, [
    currentCard?.type, 
    preferences.ambientAtmosphereEnabled, 
    preferences.ambientSound, 
    preferences.ambientAtmosphereType, 
    preferences.ambientVolume
  ]);

  // Clean up ambient audio when unmounting
  useEffect(() => {
    return () => {
      ambientAtmosphere.stop(0.5);
    };
  }, []);

  // Duck ambient atmosphere when spoken shloka recitation starts, unduck when it finishes
  useEffect(() => {
    const unsubscribe = audioEngine.addStateListener((state) => {
      if (state.isPlaying) {
        ambientAtmosphere.duck();
      } else {
        ambientAtmosphere.unduck();
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className={`relative w-full h-full flex flex-col justify-center items-center overflow-hidden transition-colors select-none ${
      isLight ? 'bg-white text-amber-950' : 'bg-neutral-950 text-neutral-100'
    }`}>
      
      {/* Top Instagram Reels Thin Progress Bar */}
      <div className="absolute top-0 inset-x-0 z-40 h-0.5 sm:h-1 bg-amber-950/20">
        <div 
          className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Top Floating App Bar - Minimalist with ONLY Logo, App Name, Refresh, and Ask Gita */}
      <div className={`absolute top-0 inset-x-0 z-30 pt-2.5 pb-2 px-3.5 sm:px-4 flex items-center justify-between pointer-events-none ${
        isLight 
          ? 'bg-gradient-to-b from-white/95 via-white/80 to-transparent' 
          : 'bg-gradient-to-b from-neutral-950/95 via-neutral-950/60 to-transparent'
      }`}>
        {/* Brand Logo & Name */}
        <div className="pointer-events-auto shrink-0">
          <AppLogo size="sm" showText={true} isLight={isLight} />
        </div>

        {/* Top Right: Refresh Feed Action & Ask Gita Action */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 pointer-events-auto shrink-0">
          {onRefreshFeed && (
            <button
              id="top-refresh-feed-btn"
              onClick={() => {
                triggerHaptic('success');
                onRefreshFeed();
                scrollToIndex(0);
              }}
              title="नया प्रवाह"
              aria-label="Refresh Feed"
              className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-full text-xs flex items-center space-x-1.5 font-hindi font-medium transition-all active:scale-95 border ${
                isLight
                  ? 'bg-amber-100/80 hover:bg-amber-200/90 text-amber-950 border-amber-300 shadow-2xs'
                  : 'bg-neutral-900/85 hover:bg-neutral-800 text-neutral-200 border-neutral-700/80 shadow-2xs'
              }`}
            >
              <RotateCw className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden xs:inline">नया प्रवाह</span>
            </button>
          )}

          <button
            id="top-ask-gita-btn"
            onClick={onOpenAskGita}
            className="px-3 py-1 sm:py-1.5 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-neutral-950 font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-all font-hindi whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-neutral-950" />
            <span>Ask Gita</span>
          </button>
        </div>
      </div>

      {/* Mood Selector Drawer */}
      {showMoodBanner && (
        <div className={`absolute top-12 inset-x-3 sm:inset-x-auto sm:w-full sm:max-w-md z-30 p-4 rounded-3xl border shadow-2xl backdrop-blur-xl animate-fadeIn ${
          isLight
            ? 'bg-white/95 border-amber-300 text-neutral-900'
            : 'bg-neutral-900/95 border-amber-500/30 text-neutral-100'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div className={`flex items-center space-x-1.5 text-xs font-semibold font-hindi ${
              isLight ? 'text-amber-900' : 'text-amber-300'
            }`}>
              <Compass className="w-4 h-4 text-amber-500" />
              <span>नमस्ते 🙏 आज आपके मन में क्या है?</span>
            </div>
            <button
              onClick={() => setShowMoodBanner(false)}
              className="text-neutral-400 hover:text-neutral-200 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1">
            {QUICK_MOODS.map(m => (
              <button
                key={m.label}
                onClick={() => {
                  triggerHaptic('light');
                  onSelectMood(m.label);
                  setShowMoodBanner(false);
                }}
                className={`p-2 rounded-2xl flex flex-col items-center justify-center space-y-1 transition-all font-hindi border ${
                  selectedMood === m.label
                    ? 'bg-amber-500 text-neutral-950 font-bold shadow-md'
                    : isLight
                      ? 'bg-amber-50/70 hover:bg-amber-100 text-neutral-800 border border-amber-200'
                      : 'bg-neutral-800/80 hover:bg-neutral-700/80 text-neutral-200 border border-neutral-700/50'
                }`}
              >
                <span>{m.emoji}</span>
                <span className="text-[11px] truncate">{m.label}</span>
              </button>
            ))}
          </div>

          <div className="mt-3 pt-2 border-t border-neutral-800/20 flex items-center justify-between">
            <button
              onClick={() => {
                onSelectMood(null);
                setShowMoodBanner(false);
              }}
              className="text-xs text-amber-600 dark:text-amber-400 font-hindi font-medium hover:underline"
            >
              सम्पूर्ण गीता पढ़ें →
            </button>
            <span className="text-[10px] text-neutral-500">
              {feedItems.length} कार्ड
            </span>
          </div>
        </div>
      )}

      {/* Active Filter Pill */}
      {selectedMood && (
        <div className="absolute top-12 z-20 flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-700 dark:text-amber-300 text-xs font-hindi shadow-md backdrop-blur-md">
          <span>मन: <b>{selectedMood}</b></span>
          <button
            onClick={() => onSelectMood(null)}
            className="text-amber-500 hover:text-amber-700 ml-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Vertical Swiper Container (Full Height, hardware-accelerated reels) */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
        className="w-full h-full max-w-md overflow-hidden select-none relative touch-pan-y"
      >
        <div 
          className="w-full h-full flex flex-col will-change-transform transition-transform duration-300 ease-out"
          style={{ transform: `translate3d(0, -${currentIndex * 100}%, 0)` }}
        >
          {feedItems.map((item, idx) => {
            const isVisible = Math.abs(currentIndex - idx) <= 1;
            if (!isVisible) {
              return (
                <div
                  key={`feed-placeholder-${idx}`}
                  className="w-full h-full shrink-0"
                />
              );
            }

            return (
              <div
                key={`feed-card-${idx}`}
                className="w-full h-full shrink-0 relative flex flex-col justify-center overflow-hidden"
              >
                {item.type === 'shloka' && (
                  <ShlokaCard
                    shloka={item.data}
                    preferences={preferences}
                    isBookmarked={(preferences.bookmarkedIds || []).includes(item.data.id)}
                    isLiked={(preferences.likedIds || []).includes(item.data.id)}
                    onToggleBookmark={toggleBookmark}
                    onToggleLike={toggleLike}
                    onOpenShare={onOpenShare}
                    onDownloadVideo={onDownloadVideo}
                    onOpenTopic={onOpenTopic}
                    onOpenAskGita={onOpenAskGita}
                    isLight={isLight}
                  />
                )}

                {item.type === 'situation' && (
                  <SituationCard
                    card={item.data}
                    isBookmarked={(preferences.bookmarkedIds || []).includes(item.data.id)}
                    isLiked={(preferences.likedIds || []).includes(item.data.id)}
                    onToggleBookmark={() => toggleBookmark(item.data.id)}
                    onToggleLike={() => toggleLike(item.data.id)}
                    onJumpToShloka={jumpToShlokaId}
                    onOpenAskGita={onOpenAskGita}
                    onShare={() => onOpenShare({
                      id: `sit_${item.data.id}`,
                      chapter: item.data.relevantShloka.chapter,
                      verse: item.data.relevantShloka.verse,
                      chapterNameSanskrit: `अध्यायः ${item.data.relevantShloka.chapter}`,
                      chapterNameHindi: `अध्याय ${item.data.relevantShloka.chapter}`,
                      sanskrit: item.data.relevantShloka.sanskritSnippet,
                      transliteration: '',
                      simpleHindi: item.data.relevantShloka.simpleHindi,
                      bhavarth: item.data.gitaPerspective,
                      aajKiSeekh: item.data.practicalAction,
                      illustration: item.data.illustration,
                      topics: [item.data.situationCategory],
                      moods: [item.data.situationCategory],
                    })}
                    isLight={isLight}
                  />
                )}

                {item.type === 'topic' && (
                  <TopicCard
                    card={item.data}
                    isBookmarked={(preferences.bookmarkedIds || []).includes(item.data.id)}
                    isLiked={(preferences.likedIds || []).includes(item.data.id)}
                    onToggleBookmark={() => toggleBookmark(item.data.id)}
                    onToggleLike={() => toggleLike(item.data.id)}
                    onExploreTopic={onOpenTopic}
                    onOpenAskGita={onOpenAskGita}
                    onShare={() => onOpenShare({
                      id: `topic_${item.data.id}`,
                      chapter: 2,
                      verse: 47,
                      chapterNameSanskrit: 'विषय दर्शनम्',
                      chapterNameHindi: 'विषय दर्शन',
                      sanskrit: item.data.hindiTitle,
                      transliteration: '',
                      simpleHindi: item.data.subtitle,
                      bhavarth: item.data.essence,
                      aajKiSeekh: `विषय: ${item.data.hindiTitle} • गीता में इस विषय पर गहन मार्गदर्शन प्राप्त करें।`,
                      illustration: item.data.illustration,
                      topics: [item.data.hindiTitle],
                      moods: [item.data.topic],
                    })}
                    isLight={isLight}
                  />
                )}

                {item.type === 'chapter_intro' && (
                  <ChapterIntroCard
                    card={item.data}
                    isBookmarked={(preferences.bookmarkedIds || []).includes(`ch_${item.data.chapterNumber}`)}
                    isLiked={(preferences.likedIds || []).includes(`ch_${item.data.chapterNumber}`)}
                    onToggleBookmark={() => toggleBookmark(`ch_${item.data.chapterNumber}`)}
                    onToggleLike={() => toggleLike(`ch_${item.data.chapterNumber}`)}
                    onOpenAskGita={onOpenAskGita}
                    onShare={() => onOpenShare({
                      id: `ch_intro_${item.data.chapterNumber}`,
                      chapter: item.data.chapterNumber,
                      verse: 1,
                      chapterNameSanskrit: item.data.sanskritName,
                      chapterNameHindi: item.data.hindiName,
                      sanskrit: item.data.sanskritName,
                      transliteration: item.data.englishName,
                      simpleHindi: item.data.hindiName,
                      bhavarth: item.data.summary,
                      aajKiSeekh: item.data.keyTeachings.join(' • '),
                      illustration: item.data.illustration,
                      topics: ['अध्याय परिचय'],
                      moods: ['ज्ञान'],
                    })}
                    isLight={isLight}
                  />
                )}

                {item.type === 'context' && (
                  <ContextCard
                    card={item.data}
                    isBookmarked={(preferences.bookmarkedIds || []).includes(item.data.id)}
                    isLiked={(preferences.likedIds || []).includes(item.data.id)}
                    onToggleBookmark={() => toggleBookmark(item.data.id)}
                    onToggleLike={() => toggleLike(item.data.id)}
                    onJumpToShloka={jumpToShlokaId}
                    onOpenAskGita={onOpenAskGita}
                    onShare={() => onOpenShare({
                      id: `ctx_${item.data.id}`,
                      chapter: 1,
                      verse: 1,
                      chapterNameSanskrit: 'महाभारत कुरुक्षेत्रम्',
                      chapterNameHindi: 'महाभारत कुरुक्षेत्र',
                      sanskrit: item.data.title,
                      transliteration: '',
                      simpleHindi: item.data.historicalContext,
                      bhavarth: item.data.psychologicalDilemma,
                      aajKiSeekh: item.data.divineGuidance,
                      illustration: item.data.illustration,
                      topics: ['ऐतिहासिक संदर्भ'],
                      moods: ['मार्गदर्शन'],
                    })}
                    isLight={isLight}
                  />
                )}

                {item.type === 'daily_wisdom' && (
                  <DailyWisdomCard
                    card={item.data}
                    isBookmarked={(preferences.bookmarkedIds || []).includes(item.data.id)}
                    isLiked={(preferences.likedIds || []).includes(item.data.id)}
                    onToggleBookmark={() => toggleBookmark(item.data.id)}
                    onToggleLike={() => toggleLike(item.data.id)}
                    onOpenAskGita={onOpenAskGita}
                    onShare={() => onOpenShare({
                      id: `dw_${item.data.id}`,
                      chapter: 2,
                      verse: 47,
                      chapterNameSanskrit: item.data.sourceVerse,
                      chapterNameHindi: item.data.sourceVerse,
                      sanskrit: item.data.quoteSnippet,
                      transliteration: '',
                      simpleHindi: item.data.title,
                      bhavarth: item.data.wisdomText,
                      aajKiSeekh: item.data.actionStep,
                      illustration: item.data.illustration,
                      topics: ['दैनिक अमृत'],
                      moods: ['शांति'],
                    })}
                    isLight={isLight}
                  />
                )}

                {item.type === 'ad' && (
                  <AdCard
                    ad={item.data}
                    onOpenPremium={onOpenPremium}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Discrete Desktop Chevron Navigation Buttons */}
      <div className="absolute left-2 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col space-y-2 opacity-50 hover:opacity-100 transition-opacity">
        <button
          onClick={() => scrollToIndex(currentIndex - 1)}
          disabled={currentIndex === 0}
          className="p-2 rounded-full bg-neutral-900/70 border border-neutral-800 text-neutral-300 disabled:opacity-20 hover:text-amber-300"
          title="पिछला कार्ड (Up)"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
        <button
          onClick={() => scrollToIndex(currentIndex + 1)}
          disabled={currentIndex === feedItems.length - 1}
          className="p-2 rounded-full bg-neutral-900/70 border border-neutral-800 text-neutral-300 disabled:opacity-20 hover:text-amber-300"
          title="अगला कार्ड (Down)"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Floating 3-Second First-Time User Swipe Gesture Tutorial Overlay */}
      <SwipeTutorialOverlay
        isLight={isLight}
        hasSeenTutorial={Boolean(preferences.hasSeenSwipeTutorial)}
        onDismiss={() => {
          onUpdatePreferences(p => ({ ...p, hasSeenSwipeTutorial: true }));
        }}
      />

      {/* Bottom subtle gradient spacer */}
    </div>
  );
};
