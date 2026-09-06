export type ContentType = 
  | 'shloka'
  | 'situation'
  | 'topic'
  | 'chapter_intro'
  | 'context'
  | 'daily_wisdom'
  | 'ad';

export interface Shloka {
  id: string; // e.g. "bg_2_47"
  chapter: number;
  verse: number;
  chapterNameSanskrit: string;
  chapterNameHindi: string;
  sanskrit: string;
  transliteration: string;
  wordMeanings?: string;
  simpleHindi: string; // सरल अर्थ
  bhavarth: string; // भावार्थ
  aajKiSeekh: string; // आज की सीख / practical life application
  topics: string[];
  moods: string[];
  illustration: IllustrationType;
  audioPronunciationText?: string;
  contextNotes?: string;
}

export type IllustrationType = 
  | 'chariot_krishna_arjuna'
  | 'karma_wheel'
  | 'meditating_yogi'
  | 'divine_flute'
  | 'sacred_tree'
  | 'bow_and_arrow'
  | 'cosmic_ocean'
  | 'lotus_flower'
  | 'peaceful_sunrise'
  | 'battlefield_dharma'
  | 'flame_of_knowledge'
  | 'inner_peace';

export interface SituationCard {
  id: string;
  title: string; // e.g. "जब परिणाम को लेकर चिंता हो रही हो..."
  situationCategory: string; // e.g. "चिंता और भय"
  description: string;
  relevantShlokaId: string;
  relevantShloka: {
    chapter: number;
    verse: number;
    sanskritSnippet: string;
    simpleHindi: string;
  };
  gitaPerspective: string; // गीता का दृष्टिकोण
  practicalAction: string; // आज के जीवन में अभ्यास
  illustration: IllustrationType;
}

export interface TopicCard {
  id: string;
  topic: string; // e.g. "कर्म", "क्रोध", "चिंता"
  hindiTitle: string;
  subtitle: string;
  essence: string;
  keyVerseIds: string[];
  illustration: IllustrationType;
  versesCount: number;
}

export interface ChapterIntroCard {
  id: string;
  chapterNumber: number;
  sanskritName: string;
  hindiName: string;
  englishName: string;
  verseCount: number;
  summary: string;
  keyTeachings: string[];
  illustration: IllustrationType;
}

export interface ContextCard {
  id: string;
  title: string;
  historicalContext: string;
  psychologicalDilemma: string;
  divineGuidance: string;
  relatedVerseId: string;
  illustration: IllustrationType;
}

export interface DailyWisdomCard {
  id: string;
  title: string;
  quoteSnippet: string;
  sourceVerse: string;
  wisdomText: string;
  actionStep: string;
  illustration: IllustrationType;
}

export interface AdCard {
  id: string;
  brandName: string;
  tagline: string;
  ctaText: string;
  ctaLink: string;
  badge: string; // "Sponsored" / "प्रायोजित"
  description: string;
}

export type FeedCardItem = 
  | { type: 'shloka'; data: Shloka; feedIndex: number }
  | { type: 'situation'; data: SituationCard; feedIndex: number }
  | { type: 'topic'; data: TopicCard; feedIndex: number }
  | { type: 'chapter_intro'; data: ChapterIntroCard; feedIndex: number }
  | { type: 'context'; data: ContextCard; feedIndex: number }
  | { type: 'daily_wisdom'; data: DailyWisdomCard; feedIndex: number }
  | { type: 'ad'; data: AdCard; feedIndex: number };

export interface ChapterMeta {
  chapter: number;
  sanskritName: string;
  hindiName: string;
  englishName: string;
  totalVerses: number;
  description: string;
}

export type ThemeMode = 'dark' | 'light' | 'system' | 'vedic';
export type FontSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ReadHistoryItem {
  shlokaId: string;
  timestamp: number;
}

export type AmbientAtmosphereType = 'temple_bells' | 'river' | 'forest' | 'tanpura';

export interface UserPreferences {
  theme: ThemeMode;
  fontSize: FontSize;
  showTransliteration: boolean;
  isPremium: boolean;
  autoPlayAudio?: boolean;
  ambientSound?: boolean;
  ambientAtmosphereEnabled?: boolean;
  ambientAtmosphereType?: AmbientAtmosphereType;
  ambientVolume: number;
  language: 'hi' | 'en' | 'hinglish';
  dailyNotificationEnabled?: boolean;
  notificationTime?: string;
  dailyNotificationTime?: 'morning' | 'evening' | 'none';
  lastReadVerseId: string;
  lastReadIndex: number;
  bookmarkedIds: string[];
  likedIds: string[];
  readVerseIds: string[];
  readHistory?: ReadHistoryItem[];
  readCount?: number;
  streakDays: number;
  lastActiveDate: string;
  hasCompletedOnboarding?: boolean;
  hasSeenSwipeTutorial?: boolean;
  userName?: string;
  userAbout?: string;
  showPersonalSignatureOnShare?: boolean;
}

export interface AskGitaResponse {
  query: string;
  matchedTheme: string;
  relevantVerses: {
    chapter: number;
    verse: number;
    sanskrit: string;
    simpleHindi: string;
    bhavarth: string;
    aajKiSeekh: string;
  }[];
  gitaPerspective: string; // "गीता के संबंधित श्लोकों के आधार पर..."
  practicalReflection: string; // practical takeaway
}
