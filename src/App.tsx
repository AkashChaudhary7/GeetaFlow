import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { UserPreferences, Shloka, FeedCardItem } from './types';
import { generateCuratedFeed, SHLOKAS_DATA } from './data/gitaData';
import { getGitaShloka } from './data/allGitaVerses';
import { VerticalFeed } from './components/Feed/VerticalFeed';
import { ExploreView } from './components/Explore/ExploreView';
import { SavedView } from './components/Saved/SavedView';
import { JourneyView } from './components/Profile/JourneyView';
import { BottomNav, NavTab } from './components/Navigation/BottomNav';
import { AskGitaModal } from './components/AskGita/AskGitaModal';
import { ShareCardModal } from './components/Share/ShareCardModal';
import { PremiumModal } from './components/Premium/PremiumModal';
import { SettingsModal } from './components/Settings/SettingsModal';
import { OnboardingModal } from './components/Onboarding/OnboardingModal';
import { IllustrationGuideModal } from './components/StyleGuide/IllustrationGuideModal';
import { ChapterVersesModal } from './components/Chapter/ChapterVersesModal';
import { AllVersesView } from './components/Chapter/AllVersesView';
import { DownloadVideoModal } from './components/Feed/DownloadVideoModal';
import { BackgroundVideoRenderer } from './components/Feed/BackgroundVideoRenderer';
import { PrivacyPolicyModal } from './components/Legal/PrivacyPolicyModal';
import { AdMobBannerView } from './components/Common/AdMobBannerView';
import { OfflineIndicator } from './components/Common/OfflineIndicator';
import { admobService } from './services/admob';

const PREFS_STORAGE_KEY = 'geetaflow_user_preferences_v1';

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'dark',
  fontSize: 'md',
  language: 'hi',
  showTransliteration: false,
  isPremium: false,
  bookmarkedIds: ['bg_2_47', 'bg_6_5'],
  likedIds: ['bg_2_47', 'bg_2_14'],
  readVerseIds: ['bg_2_47'],
  lastReadVerseId: 'bg_2_47',
  lastReadIndex: 0,
  streakDays: 3,
  lastActiveDate: new Date().toISOString().split('T')[0],
  ambientAtmosphereEnabled: false,
  ambientAtmosphereType: 'temple_bells',
  ambientSound: false,
  ambientVolume: 0.15,
  dailyNotificationEnabled: true,
  notificationTime: '07:00',
  hasCompletedOnboarding: false,
  hasSeenSwipeTutorial: false
};

export function App() {
  // 1. User Preferences State & LocalStorage Synchronization
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const saved = localStorage.getItem(PREFS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_PREFERENCES,
          ...parsed,
          bookmarkedIds: Array.isArray(parsed.bookmarkedIds) ? parsed.bookmarkedIds : DEFAULT_PREFERENCES.bookmarkedIds,
          likedIds: Array.isArray(parsed.likedIds) ? parsed.likedIds : DEFAULT_PREFERENCES.likedIds,
          readVerseIds: Array.isArray(parsed.readVerseIds) ? parsed.readVerseIds : DEFAULT_PREFERENCES.readVerseIds,
        };
      }
    } catch (e) {
      console.warn('Failed to parse preferences from storage:', e);
    }
    return DEFAULT_PREFERENCES;
  });

  useEffect(() => {
    try {
      localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(preferences));
    } catch (e) {
      console.warn('Failed to save preferences:', e);
    }
  }, [preferences]);

  // System Dark Mode Detection for 'system' theme option
  const [systemIsDark, setSystemIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSystemIsDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const effectiveTheme: 'dark' | 'light' = useMemo(() => {
    if (preferences.theme === 'system') {
      return systemIsDark ? 'dark' : 'light';
    }
    return preferences.theme === 'light' ? 'light' : 'dark';
  }, [preferences.theme, systemIsDark]);

  useEffect(() => {
    const root = document.documentElement;
    if (effectiveTheme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [effectiveTheme]);

  // Streak logic check
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (preferences.lastActiveDate !== today) {
      setPreferences(prev => ({
        ...prev,
        streakDays: (prev.streakDays || 1) + 1,
        lastActiveDate: today
      }));
    }
  }, []);

  // 2. Active Screen / Tab State
  const [activeTab, setActiveTab] = useState<NavTab>('feed');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  // 3. Modals State
  const [isAskGitaOpen, setIsAskGitaOpen] = useState(false);
  const [isPremiumOpen, setIsPremiumOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(() => !preferences.hasCompletedOnboarding);
  const [isStyleGuideOpen, setIsStyleGuideOpen] = useState(false);
  const [isChapterVersesOpen, setIsChapterVersesOpen] = useState(false);
  const [selectedChapterForModal, setSelectedChapterForModal] = useState<number>(2);
  const [shareShloka, setShareShloka] = useState<Shloka | null>(null);
  const [backgroundVideoShloka, setBackgroundVideoShloka] = useState<Shloka | null>(null);
  const [isDetailedVideoModalOpen, setIsDetailedVideoModalOpen] = useState(false);
  const [isPrivacyPolicyOpen, setIsPrivacyPolicyOpen] = useState(false);
  const [privacyPolicyTab, setPrivacyPolicyTab] = useState<'privacy' | 'terms'>('privacy');

  // Initialize Google AdMob SDK on startup (automatically loads banners and pre-caches interstitials)
  useEffect(() => {
    admobService.initialize().catch((err) => {
      console.warn('[AdMob] Init caught:', err);
    });
  }, []);

  const handleCompleteOnboarding = () => {
    setPreferences(prev => ({ ...prev, hasCompletedOnboarding: true }));
    setIsOnboardingOpen(false);
  };

  // Dynamic seed that initializes per session/visit and can be refreshed
  const [feedSeed, setFeedSeed] = useState<number>(() => Date.now());

  const handleRefreshFeed = useCallback(() => {
    setFeedSeed(Date.now());
  }, []);

  // 4. Generate dynamic curated feed with visit-adaptive variety & unread prioritization
  const feedItems: FeedCardItem[] = useMemo(() => {
    return generateCuratedFeed({
      isPremium: preferences.isPremium,
      moodFilter: selectedMood,
      readVerseIds: preferences.readVerseIds,
      refreshSeed: feedSeed,
    });
  }, [selectedMood, preferences.isPremium, preferences.readVerseIds, feedSeed]);

  // 5. Direct Navigation Actions
  const handleSelectShlokaFromExplore = (shloka: Shloka) => {
    setSelectedMood(null);
    const targetIdx = feedItems.findIndex(
      item => item.type === 'shloka' && item.data.id === shloka.id
    );
    if (targetIdx !== -1) {
      setPreferences(prev => ({ ...prev, lastReadIndex: targetIdx }));
    }
    setActiveTab('feed');
  };

  const handleSelectTopic = (topic: string) => {
    setSelectedMood(topic);
    setPreferences(prev => ({ ...prev, lastReadIndex: 0 }));
    setActiveTab('feed');
  };

  const handleSelectChapter = (chapterNum: number) => {
    setSelectedChapterForModal(chapterNum);
    setActiveTab('all_verses');
  };

  const handleSelectShlokaFromAll = (shloka: Shloka) => {
    handleSelectShlokaFromExplore(shloka);
  };

  const handleJumpToShlokaId = (shlokaId: string) => {
    // Try in local dataset or all 700 verses
    let shloka = SHLOKAS_DATA.find(s => s.id === shlokaId);
    if (!shloka) {
      // parse bg_2_47 format
      const parts = shlokaId.split('_');
      if (parts.length === 3) {
        const c = parseInt(parts[1], 10);
        const v = parseInt(parts[2], 10);
        if (!isNaN(c) && !isNaN(v)) {
          shloka = getGitaShloka(c, v);
        }
      }
    }
    if (shloka) {
      handleSelectShlokaFromExplore(shloka);
    }
  };

  const handleResetProgress = () => {
    setPreferences(prev => ({
      ...prev,
      readVerseIds: [],
      lastReadIndex: 0,
      streakDays: 1,
      bookmarkedIds: [],
      likedIds: []
    }));
    setIsSettingsOpen(false);
  };

  const handleTabChange = (tab: NavTab) => {
    setActiveTab(tab);
  };

  const isLight = effectiveTheme === 'light';

  return (
    <div className={`w-full h-[100dvh] flex flex-col font-sans overflow-hidden max-w-md mx-auto relative shadow-2xl transition-colors ${
      isLight ? 'bg-[#fdfbf7] text-neutral-900' : 'bg-neutral-950 text-neutral-100'
    } sm:border-x sm:border-neutral-800/80`}>
      
      {/* Primary View Router */}
      <main className="flex-1 w-full h-full relative overflow-hidden">
        {activeTab === 'feed' && (
          <VerticalFeed
            feedItems={feedItems}
            preferences={preferences}
            onUpdatePreferences={setPreferences}
            onOpenShare={(s) => setShareShloka(s)}
            onDownloadVideo={(s) => {
              setBackgroundVideoShloka(s);
            }}
            onOpenPremium={() => setIsPremiumOpen(true)}
            onOpenAskGita={() => setIsAskGitaOpen(true)}
            onSelectMood={setSelectedMood}
            selectedMood={selectedMood}
            onOpenTopic={handleSelectTopic}
            onOpenChaptersModal={() => setActiveTab('all_verses')}
            onRefreshFeed={handleRefreshFeed}
            isLight={isLight}
          />
        )}

        {activeTab === 'explore' && (
          <ExploreView
            onSelectShloka={handleSelectShlokaFromExplore}
            onSelectTopic={handleSelectTopic}
            onSelectChapter={handleSelectChapter}
            isLight={isLight}
          />
        )}

        {activeTab === 'all_verses' && (
          <AllVersesView
            initialChapter={selectedChapterForModal}
            onSelectShlokaForFeed={handleSelectShlokaFromAll}
            onOpenShare={(s) => setShareShloka(s)}
            onDownloadVideo={(s) => setBackgroundVideoShloka(s)}
            bookmarkedIds={preferences.bookmarkedIds || []}
            readVerseIds={preferences.readVerseIds || []}
            onToggleBookmark={(id) => {
              setPreferences(prev => {
                const current = prev.bookmarkedIds || [];
                return {
                  ...prev,
                  bookmarkedIds: current.includes(id)
                    ? current.filter(item => item !== id)
                    : [...current, id]
                };
              });
            }}
            isLight={isLight}
          />
        )}

        {activeTab === 'saved' && (
          <SavedView
            preferences={preferences}
            onRemoveBookmark={(id) => {
              setPreferences(p => ({
                ...p,
                bookmarkedIds: (p.bookmarkedIds || []).filter(item => item !== id)
              }));
            }}
            onRemoveLike={(id) => {
              setPreferences(p => ({
                ...p,
                likedIds: (p.likedIds || []).filter(item => item !== id)
              }));
            }}
            onSelectShloka={handleSelectShlokaFromExplore}
            onOpenShare={(s) => setShareShloka(s)}
            isLight={isLight}
          />
        )}

        {activeTab === 'journey' && (
          <JourneyView
            preferences={preferences}
            onContinueReading={() => setActiveTab('feed')}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenPremium={() => setIsPremiumOpen(true)}
            onOpenStyleGuide={() => setIsStyleGuideOpen(true)}
            onReplayOnboarding={() => setIsOnboardingOpen(true)}
            onOpenPrivacyPolicy={(tab) => {
              setPrivacyPolicyTab(tab || 'privacy');
              setIsPrivacyPolicyOpen(true);
            }}
            onSelectShloka={handleSelectShlokaFromExplore}
            onSelectChapter={handleSelectChapter}
            onUpdatePreferences={setPreferences}
            isLight={isLight}
          />
        )}
      </main>

      {/* Global Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={handleTabChange}
        savedCount={(preferences.bookmarkedIds || []).length}
        isLight={isLight}
      />

      {/* Google AdMob Adaptive Banner View (For Web preview simulation & Native Android bridge) */}
      {!preferences.isPremium && (
        <div className="fixed bottom-14 inset-x-0 z-30 pointer-events-auto flex justify-center">
          <AdMobBannerView 
            isPremium={preferences.isPremium} 
            onOpenPremium={() => setIsPremiumOpen(true)} 
          />
        </div>
      )}

      {/* All 18 Chapters & 700 Shlokas Navigator Modal */}
      <ChapterVersesModal
        isOpen={isChapterVersesOpen}
        onClose={() => setIsChapterVersesOpen(false)}
        initialChapter={selectedChapterForModal}
        onSelectShlokaForFeed={handleSelectShlokaFromAll}
        onSelectShloka={handleSelectShlokaFromAll}
        onOpenShare={(s) => setShareShloka(s)}
        bookmarkedIds={preferences.bookmarkedIds || []}
        onToggleBookmark={(id) => {
          setPreferences(prev => {
            const current = prev.bookmarkedIds || [];
            return {
              ...prev,
              bookmarkedIds: current.includes(id)
                ? current.filter(item => item !== id)
                : [...current, id]
            };
          });
        }}
        isLight={isLight}
      />

      {/* Onboarding Flow (Auto-triggers on first visit, skippable anytime, replayable from Settings & Journey) */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onComplete={handleCompleteOnboarding}
        onOpenAskGita={() => setIsAskGitaOpen(true)}
      />

      {/* Illustration Style Guide & Character Bible Modal */}
      <IllustrationGuideModal
        isOpen={isStyleGuideOpen}
        onClose={() => setIsStyleGuideOpen(false)}
      />

      {/* Ask Gita Modal */}
      <AskGitaModal
        isOpen={isAskGitaOpen}
        onClose={() => setIsAskGitaOpen(false)}
        onJumpToShloka={handleJumpToShlokaId}
      />

      {/* Share Card Modal */}
      <ShareCardModal
        shloka={shareShloka}
        isOpen={!!shareShloka}
        onClose={() => setShareShloka(null)}
        preferences={preferences}
        onUpdatePreferences={setPreferences}
        isLight={isLight}
      />

      {/* Background Video Renderer & Floating On-Screen Progress Bar */}
      <BackgroundVideoRenderer
        shloka={backgroundVideoShloka}
        preferences={preferences}
        isLight={isLight}
        onClearShloka={() => setBackgroundVideoShloka(null)}
        onOpenDetailedModal={() => setIsDetailedVideoModalOpen(true)}
      />

      {/* 30-Second Video Reel Detailed Preview Modal */}
      <DownloadVideoModal
        shloka={backgroundVideoShloka}
        isOpen={isDetailedVideoModalOpen}
        onClose={() => setIsDetailedVideoModalOpen(false)}
        preferences={preferences}
        isLight={isLight}
        onMinimizeToBackground={() => setIsDetailedVideoModalOpen(false)}
      />

      {/* Premium Upgrade Modal */}
      <PremiumModal
        isOpen={isPremiumOpen}
        onClose={() => setIsPremiumOpen(false)}
        isPremium={preferences.isPremium}
        onUpgrade={() => {
          setPreferences(p => ({ ...p, isPremium: true }));
        }}
        onRestore={() => {
          setPreferences(p => ({ ...p, isPremium: true }));
          alert('आपकी GeetaFlow Premium सदस्यता पुनः स्थापित कर दी गई है।');
          setIsPremiumOpen(false);
        }}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        preferences={preferences}
        onUpdatePreferences={setPreferences}
        onResetProgress={handleResetProgress}
        onReplayOnboarding={() => setIsOnboardingOpen(true)}
        onOpenStyleGuide={() => setIsStyleGuideOpen(true)}
        onOpenPrivacyPolicy={(tab) => {
          setPrivacyPolicyTab(tab || 'privacy');
          setIsPrivacyPolicyOpen(true);
        }}
      />

      {/* Privacy Policy & Terms of Service Modal */}
      <PrivacyPolicyModal
        isOpen={isPrivacyPolicyOpen}
        onClose={() => setIsPrivacyPolicyOpen(false)}
        defaultTab={privacyPolicyTab}
        isLight={isLight}
      />

      {/* Offline Status Connectivity Banner */}
      <OfflineIndicator />

    </div>
  );
}

export default App;
