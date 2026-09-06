import React, { useState } from 'react';
import { CHAPTERS_META } from '../../data/gitaData';
import { getGitaShloka } from '../../data/allGitaVerses';
import { Shloka } from '../../types';
import { 
  Search, 
  BookOpen, 
  Volume2, 
  Bookmark, 
  Share2, 
  ArrowRight, 
  Check, 
  Sparkles, 
  LayoutGrid, 
  List, 
  ChevronLeft, 
  ChevronRight,
  Eye,
  Download
} from 'lucide-react';
import { audioEngine } from '../../utils/audioEngine';
import { triggerHaptic } from '../../utils/haptics';

interface AllVersesViewProps {
  initialChapter?: number;
  onSelectShlokaForFeed: (shloka: Shloka) => void;
  onOpenShare?: (shloka: Shloka) => void;
  onDownloadVideo?: (shloka: Shloka) => void;
  bookmarkedIds?: string[];
  readVerseIds?: string[];
  onToggleBookmark?: (id: string) => void;
  onToggleRead?: (id: string) => void;
  isLight?: boolean;
}

export const AllVersesView: React.FC<AllVersesViewProps> = ({
  initialChapter = 2,
  onSelectShlokaForFeed,
  onOpenShare,
  onDownloadVideo,
  bookmarkedIds = [],
  readVerseIds = [],
  onToggleBookmark,
  onToggleRead,
  isLight = false
}) => {
  const [selectedChapter, setSelectedChapter] = useState(initialChapter);
  const [selectedVerseNumber, setSelectedVerseNumber] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'reading' | 'grid'>('reading');
  const [playingShlokaId, setPlayingShlokaId] = useState<string | null>(null);
  const [searchVerseText, setSearchVerseText] = useState('');

  const currentChapterMeta = CHAPTERS_META.find(c => c.chapter === selectedChapter) || CHAPTERS_META[0];
  const activeShloka: Shloka | null = selectedVerseNumber ? getGitaShloka(selectedChapter, selectedVerseNumber) : null;

  const handleSelectVerse = (verseNum: number) => {
    triggerHaptic('light');
    setSelectedVerseNumber(verseNum);
  };

  const handlePlayAudio = (shloka: Shloka) => {
    triggerHaptic('light');
    if (playingShlokaId === shloka.id) {
      audioEngine.stop();
      setPlayingShlokaId(null);
    } else {
      setPlayingShlokaId(shloka.id);
      audioEngine.playShloka(
        shloka,
        () => setPlayingShlokaId(null),
        () => setPlayingShlokaId(null)
      );
    }
  };

  const safeBookmarks = Array.isArray(bookmarkedIds) ? bookmarkedIds : [];
  const safeReads = Array.isArray(readVerseIds) ? readVerseIds : [];

  // Filter verses by search query if any
  const verseNumbers = Array.from({ length: currentChapterMeta.totalVerses }, (_, i) => i + 1);
  const filteredVerses = verseNumbers.filter(v => {
    if (!searchVerseText.trim()) return true;
    const numMatch = v.toString().includes(searchVerseText.trim());
    if (numMatch) return true;
    const s = getGitaShloka(selectedChapter, v);
    const q = searchVerseText.toLowerCase().trim();
    return s.sanskrit.toLowerCase().includes(q) || s.simpleHindi.toLowerCase().includes(q);
  });

  return (
    <div className={`w-full h-full max-w-lg mx-auto flex flex-col overflow-hidden select-none transition-colors ${
      isLight ? 'bg-[#fdfbf7] text-neutral-900' : 'bg-neutral-950 text-neutral-100'
    }`}>
      {/* Sticky Header Bar */}
      <div className={`px-4 py-3 border-b flex flex-col space-y-2.5 shrink-0 ${
        isLight ? 'bg-[#f8f5ee]/95 border-amber-200' : 'bg-neutral-900/90 border-neutral-800'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-amber-500" />
            <h2 className={`text-base font-bold font-hindi ${isLight ? 'text-amber-950' : 'text-neutral-100'}`}>
              सम्पूर्ण गीता श्लोक पठन
            </h2>
          </div>

          {/* Mode Switcher: Reading vs Grid */}
          <div className={`flex items-center p-1 rounded-xl border ${
            isLight ? 'bg-amber-100/60 border-amber-200' : 'bg-neutral-950 border-neutral-800'
          }`}>
            <button
              onClick={() => {
                triggerHaptic('light');
                setViewMode('reading');
                setSelectedVerseNumber(null);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-hindi flex items-center space-x-1 transition-all ${
                viewMode === 'reading' && !selectedVerseNumber
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow-xs'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>पठन सूची</span>
            </button>

            <button
              onClick={() => {
                triggerHaptic('light');
                setViewMode('grid');
                setSelectedVerseNumber(null);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-hindi flex items-center space-x-1 transition-all ${
                viewMode === 'grid' && !selectedVerseNumber
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow-xs'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>ग्रिड</span>
            </button>
          </div>
        </div>

        {/* Chapter Selector & Search */}
        <div className="flex items-center space-x-2">
          {/* Chapter Dropdown */}
          <select
            value={selectedChapter}
            onChange={(e) => {
              triggerHaptic('light');
              setSelectedChapter(Number(e.target.value));
              setSelectedVerseNumber(null);
            }}
            className={`flex-1 px-3 py-2 rounded-xl text-xs font-hindi font-semibold border focus:outline-hidden ${
              isLight
                ? 'bg-white border-amber-200 text-amber-950'
                : 'bg-neutral-950 border-neutral-800 text-neutral-200'
            }`}
          >
            {CHAPTERS_META.map((ch) => (
              <option key={ch.chapter} value={ch.chapter} className="bg-neutral-900 text-neutral-100">
                अध्याय {ch.chapter}: {ch.sanskritName} ({ch.totalVerses} श्लोक)
              </option>
            ))}
          </select>

          {/* Search Verse */}
          <div className="relative w-32 sm:w-36">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="श्लोक खोजें..."
              value={searchVerseText}
              onChange={(e) => setSearchVerseText(e.target.value)}
              className={`w-full pl-8 pr-2 py-2 rounded-xl text-xs font-hindi border focus:outline-hidden ${
                isLight
                  ? 'bg-white border-amber-200 text-amber-950 placeholder-neutral-400'
                  : 'bg-neutral-950 border-neutral-800 text-neutral-200 placeholder-neutral-500'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Chapter Overview Banner */}
      <div className={`px-4 py-2.5 border-b shrink-0 ${
        isLight 
          ? 'bg-gradient-to-r from-amber-100/50 via-amber-50 to-white border-amber-200' 
          : 'bg-gradient-to-r from-amber-950/30 via-neutral-900 to-neutral-900 border-neutral-800/80'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <span className={`text-[11px] font-semibold font-hindi ${isLight ? 'text-amber-800' : 'text-amber-400'}`}>
              अध्याय {currentChapterMeta.chapter} • {currentChapterMeta.englishName}
            </span>
            <h3 className={`text-sm sm:text-base font-bold font-sanskrit ${isLight ? 'text-amber-950' : 'text-neutral-100'}`}>
              {currentChapterMeta.sanskritName} ({currentChapterMeta.hindiName})
            </h3>
          </div>
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-hindi font-bold ${
            isLight ? 'bg-amber-200/60 text-amber-900 border border-amber-300' : 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
          }`}>
            {currentChapterMeta.totalVerses} श्लोक
          </span>
        </div>
      </div>

      {/* Main Body - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar pb-32">
        
        {/* Single Shloka Focused Reader View */}
        {activeShloka ? (
          <div className="space-y-4 animate-fadeIn">
            {/* Navigation & Back Controls */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  triggerHaptic('light');
                  setSelectedVerseNumber(null);
                }}
                className={`text-xs hover:underline font-hindi flex items-center gap-1 font-bold ${
                  isLight ? 'text-amber-700' : 'text-amber-400'
                }`}
              >
                ← सम्पूर्ण सूची पर वापस जाएं
              </button>

              <div className="flex items-center space-x-1">
                <button
                  disabled={activeShloka.verse <= 1}
                  onClick={() => {
                    triggerHaptic('light');
                    setSelectedVerseNumber(Math.max(1, activeShloka.verse - 1));
                  }}
                  className="p-1.5 rounded-lg border border-neutral-700 text-neutral-300 disabled:opacity-30 hover:bg-neutral-800"
                  title="पिछला श्लोक"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className={`text-xs font-bold font-hindi px-2.5 py-1 rounded-full ${
                  isLight ? 'bg-amber-100 text-amber-900 border border-amber-200' : 'bg-amber-500/15 text-amber-400'
                }`}>
                  श्लोक {activeShloka.verse} / {currentChapterMeta.totalVerses}
                </span>
                <button
                  disabled={activeShloka.verse >= currentChapterMeta.totalVerses}
                  onClick={() => {
                    triggerHaptic('light');
                    setSelectedVerseNumber(Math.min(currentChapterMeta.totalVerses, activeShloka.verse + 1));
                  }}
                  className="p-1.5 rounded-lg border border-neutral-700 text-neutral-300 disabled:opacity-30 hover:bg-neutral-800"
                  title="अगला श्लोक"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Shloka Sanskrit Card */}
            <div className={`p-5 rounded-3xl border space-y-3 shadow-md ${
              isLight ? 'bg-white border-amber-300 text-amber-950 shadow-amber-900/5' : 'bg-neutral-900/95 border-amber-500/30 text-amber-100 shadow-black'
            }`}>
              <div className="flex items-center justify-between text-xs font-hindi opacity-70 border-b pb-2">
                <span>अध्याय {activeShloka.chapter} • श्लोक {activeShloka.verse}</span>
                <span>{currentChapterMeta.sanskritName}</span>
              </div>

              <div className="font-sanskrit text-lg sm:text-xl font-bold whitespace-pre-line leading-relaxed text-center py-2">
                {activeShloka.sanskrit}
              </div>

              {activeShloka.transliteration && (
                <p className={`text-xs italic font-mono text-center whitespace-pre-line border-t pt-2.5 ${
                  isLight ? 'border-amber-100 text-amber-900/80' : 'border-neutral-800 text-amber-200/70'
                }`}>
                  {activeShloka.transliteration}
                </p>
              )}
            </div>

            {/* Simple Hindi Meaning */}
            <div className={`p-4 rounded-2xl border space-y-1.5 ${
              isLight ? 'bg-white border-amber-200 text-neutral-800 shadow-2xs' : 'bg-neutral-900/70 border-neutral-800 text-neutral-200'
            }`}>
              <span className={`text-xs font-bold font-hindi ${isLight ? 'text-amber-700' : 'text-amber-400'}`}>
                सरल अर्थ (हिंदी):
              </span>
              <p className="text-sm font-hindi leading-relaxed">
                {activeShloka.simpleHindi}
              </p>
            </div>

            {/* Bhavarth & Takeaway */}
            <div className={`p-4 rounded-2xl border space-y-2 ${
              isLight ? 'bg-white border-amber-200 text-neutral-800 shadow-2xs' : 'bg-neutral-900/70 border-neutral-800 text-neutral-200'
            }`}>
              <span className={`text-xs font-bold font-hindi ${isLight ? 'text-amber-700' : 'text-amber-400'}`}>
                भावार्थ व आध्यात्मिक संदेश:
              </span>
              <p className="text-xs sm:text-sm font-hindi leading-relaxed">
                {activeShloka.bhavarth}
              </p>
              <div className={`mt-2.5 pt-2.5 border-t text-xs font-hindi ${
                isLight ? 'border-amber-100 text-amber-900 font-semibold' : 'border-neutral-800 text-amber-300'
              }`}>
                ✨ <span className="font-bold">आज की सीख:</span> {activeShloka.aajKiSeekh}
              </div>
            </div>

            {/* Actions Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              <button
                onClick={() => handlePlayAudio(activeShloka)}
                className={`py-2.5 px-3 rounded-xl border text-xs font-hindi font-semibold flex items-center justify-center space-x-1.5 transition-all ${
                  playingShlokaId === activeShloka.id
                    ? 'bg-amber-500 text-neutral-950 font-bold'
                    : isLight
                      ? 'bg-white border-amber-200 text-amber-950 hover:bg-amber-50'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-200 hover:bg-neutral-800'
                }`}
              >
                <Volume2 className="w-4 h-4" />
                <span>{playingShlokaId === activeShloka.id ? 'विराम' : 'सुनें'}</span>
              </button>

              <button
                onClick={() => onToggleBookmark && onToggleBookmark(activeShloka.id)}
                className={`py-2.5 px-3 rounded-xl border text-xs font-hindi font-semibold flex items-center justify-center space-x-1.5 transition-all ${
                  safeBookmarks.includes(activeShloka.id)
                    ? 'bg-amber-500/20 text-amber-600 border-amber-500/40 font-bold'
                    : isLight
                      ? 'bg-white border-amber-200 text-amber-950 hover:bg-amber-50'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-200 hover:bg-neutral-800'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                <span>{safeBookmarks.includes(activeShloka.id) ? 'सहेजा गया' : 'सहेजें'}</span>
              </button>

              <button
                onClick={() => onOpenShare && onOpenShare(activeShloka)}
                className={`py-2.5 px-3 rounded-xl border text-xs font-hindi font-semibold flex items-center justify-center space-x-1.5 ${
                  isLight
                    ? 'bg-white border-amber-200 text-amber-950 hover:bg-amber-50'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-200 hover:bg-neutral-800'
                }`}
              >
                <Share2 className="w-4 h-4" />
                <span>शेयर</span>
              </button>

              {onDownloadVideo && (
                <button
                  onClick={() => {
                    triggerHaptic('light');
                    onDownloadVideo(activeShloka);
                  }}
                  title="30-सेकंड वीडियो रील डाउनलोड करें"
                  className={`py-2.5 px-3 rounded-xl border text-xs font-hindi font-semibold flex items-center justify-center space-x-1.5 ${
                    isLight
                      ? 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100'
                      : 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
                  }`}
                >
                  <Download className="w-4 h-4 text-amber-500" />
                  <span>वीडियो रील</span>
                </button>
              )}

              <button
                onClick={() => {
                  triggerHaptic('medium');
                  onSelectShlokaForFeed(activeShloka);
                }}
                className="py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-hindi font-bold flex items-center justify-center space-x-1.5 shadow-sm"
              >
                <Eye className="w-4 h-4" />
                <span>रील में देखें</span>
              </button>
            </div>
          </div>
        ) : viewMode === 'reading' ? (
          /* ============================================================ */
          /* READING MODE: Continuous list of Shlokas for direct reading  */
          /* ============================================================ */
          <div className="space-y-4 animate-fadeIn">
            {filteredVerses.length === 0 ? (
              <div className="text-center py-12 text-neutral-500 font-hindi text-sm">
                कोई श्लोक नहीं मिला।
              </div>
            ) : (
              filteredVerses.map(vNum => {
                const shloka = getGitaShloka(selectedChapter, vNum);
                const isBookmarked = safeBookmarks.includes(shloka.id);
                const isRead = safeReads.includes(shloka.id);
                const isPlayingThis = playingShlokaId === shloka.id;

                return (
                  <div
                    key={shloka.id}
                    className={`p-4 rounded-3xl border transition-all ${
                      isLight
                        ? 'bg-white border-amber-200/90 text-amber-950 shadow-xs hover:border-amber-300'
                        : 'bg-neutral-900/80 border-neutral-800 text-neutral-100 hover:border-amber-500/30'
                    }`}
                  >
                    {/* Header: Verse number & status */}
                    <div className="flex items-center justify-between border-b pb-2 mb-3 text-xs font-hindi">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-xs ${
                          isLight ? 'bg-amber-100 text-amber-900' : 'bg-amber-500/15 text-amber-400'
                        }`}>
                          श्लोक {shloka.verse}
                        </span>
                        <span className={`text-[11px] ${isLight ? 'text-amber-800/70' : 'text-neutral-400'}`}>
                          अध्याय {shloka.chapter}
                        </span>
                      </div>

                      {isRead && (
                        <span className="flex items-center space-x-1 text-emerald-500 text-[11px] font-bold">
                          <Check className="w-3.5 h-3.5" />
                          <span>पढ़ा गया</span>
                        </span>
                      )}
                    </div>

                    {/* Sanskrit Shloka */}
                    <p className={`font-sanskrit text-base sm:text-lg font-bold leading-relaxed whitespace-pre-line text-center mb-2.5 ${
                      isLight ? 'text-amber-950' : 'text-amber-100'
                    }`}>
                      {shloka.sanskrit}
                    </p>

                    {/* Transliteration */}
                    {shloka.transliteration && (
                      <p className={`text-[11px] italic font-mono text-center whitespace-pre-line mb-3 ${
                        isLight ? 'text-amber-800/70' : 'text-neutral-400'
                      }`}>
                        {shloka.transliteration}
                      </p>
                    )}

                    {/* Simple Hindi Translation */}
                    <div className={`p-3 rounded-2xl border text-left mb-3 ${
                      isLight ? 'bg-amber-50/60 border-amber-200 text-amber-950' : 'bg-neutral-950/70 border-neutral-800 text-neutral-200'
                    }`}>
                      <p className="font-hindi text-xs sm:text-sm leading-relaxed">
                        <span className={`font-bold ${isLight ? 'text-amber-700' : 'text-amber-400'}`}>सरल अर्थ: </span>
                        {shloka.simpleHindi}
                      </p>
                    </div>

                    {/* Today's Wisdom (Aaj Ki Seekh) */}
                    <div className={`p-2.5 rounded-xl border text-left mb-3 text-[11px] font-hindi ${
                      isLight ? 'bg-amber-100/50 border-amber-200 text-amber-900' : 'bg-amber-500/10 border-amber-500/20 text-amber-300'
                    }`}>
                      <span className="font-bold">✨ आज की सीख: </span>
                      {shloka.aajKiSeekh}
                    </div>

                    {/* Card Actions */}
                    <div className="flex items-center justify-between pt-1 border-t border-neutral-800/40 text-xs font-hindi">
                      <div className="flex items-center space-x-2">
                        {/* Audio Listen */}
                        <button
                          onClick={() => handlePlayAudio(shloka)}
                          className={`p-2 rounded-xl border flex items-center space-x-1 transition-all ${
                            isPlayingThis
                              ? 'bg-amber-500 text-neutral-950 font-bold border-amber-400'
                              : isLight
                                ? 'bg-white border-amber-200 text-amber-950 hover:bg-amber-50'
                                : 'bg-neutral-800 border-neutral-700 text-neutral-200 hover:bg-neutral-700'
                          }`}
                          title="ऑडियो सुनें"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span className="text-[11px]">{isPlayingThis ? 'विराम' : 'सुनें'}</span>
                        </button>

                        {/* Bookmark */}
                        <button
                          onClick={() => onToggleBookmark && onToggleBookmark(shloka.id)}
                          className={`p-2 rounded-xl border flex items-center space-x-1 transition-all ${
                            isBookmarked
                              ? 'bg-amber-500/20 border-amber-500/40 text-amber-500 font-bold'
                              : isLight
                                ? 'bg-white border-amber-200 text-amber-950 hover:bg-amber-50'
                                : 'bg-neutral-800 border-neutral-700 text-neutral-200 hover:bg-neutral-700'
                          }`}
                          title="सहेजें"
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                        </button>

                        {/* Share */}
                        <button
                          onClick={() => onOpenShare && onOpenShare(shloka)}
                          className={`p-2 rounded-xl border flex items-center space-x-1 transition-all ${
                            isLight
                              ? 'bg-white border-amber-200 text-amber-950 hover:bg-amber-50'
                              : 'bg-neutral-800 border-neutral-700 text-neutral-200 hover:bg-neutral-700'
                          }`}
                          title="शेयर करें"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Download Video Reel */}
                        {onDownloadVideo && (
                          <button
                            onClick={() => {
                              triggerHaptic('light');
                              onDownloadVideo(shloka);
                            }}
                            className={`p-2 rounded-xl border flex items-center space-x-1 transition-all ${
                              isLight
                                ? 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100'
                                : 'bg-neutral-800 border-amber-500/40 text-amber-400 hover:bg-neutral-700'
                            }`}
                            title="30-सेकंड वीडियो रील डाउनलोड करें"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* View in Reel Button */}
                      <button
                        onClick={() => {
                          triggerHaptic('light');
                          onSelectShlokaForFeed(shloka);
                        }}
                        className={`px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1 text-xs transition-all ${
                          isLight
                            ? 'bg-amber-200/80 hover:bg-amber-300 text-amber-950'
                            : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300'
                        }`}
                      >
                        <span>रील में देखें</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          /* ============================================================ */
          /* GRID MODE: Quick numerical index navigation                  */
          /* ============================================================ */
          <div>
            <div className="flex items-center justify-between text-xs font-hindi mb-3">
              <span className={isLight ? 'text-amber-800' : 'text-neutral-400'}>
                श्लोक संख्या चुनें (कुल {currentChapterMeta.totalVerses} श्लोक):
              </span>
              <span className="text-[11px] text-amber-500">
                टैप करके तुरंत पढ़ें
              </span>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
              {filteredVerses.map((vNum) => {
                const shlokaId = `bg_${selectedChapter}_${vNum}`;
                const isBookmarked = safeBookmarks.includes(shlokaId);
                const isRead = safeReads.includes(shlokaId);

                return (
                  <button
                    key={vNum}
                    onClick={() => handleSelectVerse(vNum)}
                    className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center border text-sm font-bold transition-all active:scale-95 ${
                      isLight
                        ? 'bg-white hover:bg-amber-50 border-amber-200 text-amber-950 shadow-2xs'
                        : 'bg-neutral-900/80 hover:bg-neutral-800 border-neutral-800 text-neutral-200'
                    }`}
                  >
                    <span>{vNum}</span>

                    {/* Bookmark Indicator */}
                    {isBookmarked && (
                      <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-amber-500" />
                    )}

                    {/* Read indicator */}
                    {isRead && (
                      <span className="absolute bottom-1 right-1 text-[9px] text-emerald-400">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
