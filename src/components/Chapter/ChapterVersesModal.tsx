import React, { useState } from 'react';
import { CHAPTERS_META } from '../../data/gitaData';
import { getGitaShloka } from '../../data/allGitaVerses';
import { Shloka } from '../../types';
import { X, Search, BookOpen, Volume2, Bookmark, Share2, Sparkles, ArrowRight, Check, ArrowLeft } from 'lucide-react';
import { audioEngine } from '../../utils/audioEngine';

interface ChapterVersesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectShlokaForFeed?: (shloka: Shloka) => void;
  onSelectShloka?: (shloka: Shloka) => void;
  onOpenShare?: (shloka: Shloka) => void;
  bookmarkedIds?: string[];
  onToggleBookmark?: (id: string) => void;
  initialChapter?: number;
  isLight?: boolean;
}

export const ChapterVersesModal: React.FC<ChapterVersesModalProps> = ({
  isOpen,
  onClose,
  onSelectShlokaForFeed,
  onSelectShloka,
  onOpenShare,
  bookmarkedIds = [],
  onToggleBookmark,
  initialChapter = 2,
  isLight = false
}) => {
  const [selectedChapter, setSelectedChapter] = useState(initialChapter);
  const [selectedVerseNumber, setSelectedVerseNumber] = useState<number | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [searchVerseText, setSearchVerseText] = useState('');

  if (!isOpen) return null;

  const currentChapterMeta = CHAPTERS_META.find(c => c.chapter === selectedChapter) || CHAPTERS_META[0];
  const activeShloka: Shloka | null = selectedVerseNumber ? getGitaShloka(selectedChapter, selectedVerseNumber) : null;

  const handleSelect = (shloka: Shloka) => {
    onClose();
    if (onSelectShlokaForFeed) {
      onSelectShlokaForFeed(shloka);
    } else if (onSelectShloka) {
      onSelectShloka(shloka);
    }
  };

  const handlePlayAudio = (shloka: Shloka) => {
    if (isPlayingAudio) {
      audioEngine.stop();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      audioEngine.playShloka(
        shloka,
        () => setIsPlayingAudio(false),
        () => setIsPlayingAudio(false)
      );
    }
  };

  const safeBookmarks = Array.isArray(bookmarkedIds) ? bookmarkedIds : [];

  return (
    <div className={`fixed inset-0 z-50 flex flex-col w-full h-full overflow-hidden animate-fadeIn transition-colors ${
      isLight ? 'bg-[#fdfbf7] text-neutral-900' : 'bg-neutral-950 text-neutral-100'
    }`}>
      {/* Top App Bar */}
      <div className={`w-full px-4 py-3 border-b flex items-center justify-between shrink-0 ${
        isLight ? 'bg-amber-50/80 border-amber-200' : 'bg-neutral-900/90 border-neutral-800'
      }`}>
        <div className="flex items-center space-x-3">
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors flex items-center gap-1.5 ${
              isLight ? 'hover:bg-amber-100 text-neutral-700' : 'hover:bg-neutral-800 text-neutral-300'
            }`}
            aria-label="वापस जाएं"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-xs font-hindi hidden sm:inline">वापस</span>
          </button>
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-amber-500" />
            <div>
              <h2 className={`text-sm sm:text-base font-bold font-hindi ${isLight ? 'text-amber-950' : 'text-amber-200'}`}>
                सम्पूर्ण १८ अध्याय • ७०० श्लोक
              </h2>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className={`p-2 rounded-full transition-colors ${
            isLight ? 'text-neutral-500 hover:text-neutral-800 hover:bg-amber-100/60' : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
          }`}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 flex flex-col max-w-2xl w-full mx-auto overflow-hidden">

        {/* Horizontal Chapter Selector Slider */}
        <div className={`flex items-center space-x-1.5 p-3 overflow-x-auto no-scrollbar border-b ${
          isLight ? 'bg-white border-amber-100' : 'bg-neutral-950/30 border-neutral-800'
        }`}>
          {CHAPTERS_META.map(ch => (
            <button
              key={ch.chapter}
              onClick={() => {
                setSelectedChapter(ch.chapter);
                setSelectedVerseNumber(null);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-hindi whitespace-nowrap shrink-0 transition-all ${
                selectedChapter === ch.chapter
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow-md shadow-amber-500/20'
                  : isLight
                    ? 'bg-neutral-100 hover:bg-amber-100 text-neutral-700 border border-neutral-200'
                    : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-800'
              }`}
            >
              अध्याय {ch.chapter}
            </button>
          ))}
        </div>

        {/* Chapter Overview Banner */}
        <div className={`p-4 border-b ${
          isLight 
            ? 'bg-gradient-to-r from-amber-100/50 via-amber-50 to-white border-amber-200' 
            : 'bg-gradient-to-r from-amber-950/30 via-neutral-900 to-neutral-900 border-neutral-800/80'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <span className={`text-xs font-semibold font-hindi ${isLight ? 'text-amber-800' : 'text-amber-400'}`}>
                अध्याय {currentChapterMeta.chapter} • {currentChapterMeta.englishName}
              </span>
              <h3 className={`text-lg font-bold font-sanskrit ${isLight ? 'text-amber-950' : 'text-neutral-100'}`}>
                {currentChapterMeta.sanskritName} ({currentChapterMeta.hindiName})
              </h3>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-hindi ${
              isLight ? 'bg-amber-200/60 text-amber-900 border border-amber-300' : 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
            }`}>
              {currentChapterMeta.totalVerses} श्लोक
            </span>
          </div>
          <p className={`text-xs font-hindi mt-1.5 leading-relaxed ${isLight ? 'text-neutral-700' : 'text-neutral-300'}`}>
            {currentChapterMeta.description}
          </p>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          
          {/* If a verse is currently opened */}
          {activeShloka ? (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSelectedVerseNumber(null)}
                  className="text-xs text-amber-600 dark:text-amber-400 hover:underline font-hindi flex items-center gap-1 font-medium"
                >
                  ← सभी श्लोक सूची पर वापस जाएं
                </button>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 font-hindi bg-amber-500/10 px-2.5 py-0.5 rounded-full">
                  श्लोक {activeShloka.verse} / {currentChapterMeta.totalVerses}
                </span>
              </div>

              {/* Shloka Sanskrit Card */}
              <div className={`p-4 rounded-2xl border space-y-3 ${
                isLight ? 'bg-white border-amber-300/70 shadow-xs' : 'bg-neutral-950/60 border-amber-500/20'
              }`}>
                <div className={`font-sanskrit text-lg sm:text-xl font-bold whitespace-pre-line leading-relaxed text-center ${
                  isLight ? 'text-amber-950' : 'text-amber-100'
                }`}>
                  {activeShloka.sanskrit}
                </div>

                {activeShloka.transliteration && (
                  <p className={`text-xs italic font-mono text-center whitespace-pre-line border-t pt-2 ${
                    isLight ? 'border-neutral-200 text-neutral-600' : 'border-neutral-800 text-amber-200/60'
                  }`}>
                    {activeShloka.transliteration}
                  </p>
                )}
              </div>

              {/* Simple Hindi */}
              <div className={`p-3.5 rounded-xl border space-y-1 ${
                isLight ? 'bg-white border-neutral-200' : 'bg-neutral-950/40 border-neutral-800'
              }`}>
                <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 font-hindi">सरल अर्थ:</span>
                <p className={`text-xs sm:text-sm font-hindi leading-relaxed ${isLight ? 'text-neutral-800' : 'text-neutral-200'}`}>
                  {activeShloka.simpleHindi}
                </p>
              </div>

              {/* Bhavarth & Takeaway */}
              <div className={`p-3.5 rounded-xl border space-y-1 ${
                isLight ? 'bg-white border-neutral-200' : 'bg-neutral-950/40 border-neutral-800'
              }`}>
                <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 font-hindi">भावार्थ व जीवनोपयोगी संदेश:</span>
                <p className={`text-xs font-hindi leading-relaxed ${isLight ? 'text-neutral-700' : 'text-neutral-300'}`}>
                  {activeShloka.bhavarth}
                </p>
                <div className={`mt-2 pt-2 border-t text-xs font-hindi ${
                  isLight ? 'border-amber-100 text-amber-800 font-medium' : 'border-neutral-800 text-amber-300'
                }`}>
                  ✨ {activeShloka.aajKiSeekh}
                </div>
              </div>

              {/* Actions Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                <button
                  onClick={() => handlePlayAudio(activeShloka)}
                  className={`py-2 px-3 rounded-xl border text-xs font-hindi flex items-center justify-center space-x-1.5 transition-all ${
                    isPlayingAudio
                      ? 'bg-amber-500 text-neutral-950 font-bold'
                      : isLight
                        ? 'bg-white border-neutral-300 text-neutral-800 hover:bg-neutral-50'
                        : 'bg-neutral-800/80 border-neutral-700 text-neutral-200'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{isPlayingAudio ? 'विराम' : 'सुनें'}</span>
                </button>

                <button
                  onClick={() => onToggleBookmark && onToggleBookmark(activeShloka.id)}
                  className={`py-2 px-3 rounded-xl border text-xs font-hindi flex items-center justify-center space-x-1.5 transition-all ${
                    safeBookmarks.includes(activeShloka.id)
                      ? 'bg-amber-500/20 text-amber-600 dark:text-amber-300 border-amber-500/40 font-semibold'
                      : isLight
                        ? 'bg-white border-neutral-300 text-neutral-800 hover:bg-neutral-50'
                        : 'bg-neutral-800/80 border-neutral-700 text-neutral-200'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{safeBookmarks.includes(activeShloka.id) ? 'सहेजा गया' : 'सहेजें'}</span>
                </button>

                <button
                  onClick={() => onOpenShare && onOpenShare(activeShloka)}
                  className={`py-2 px-3 rounded-xl border text-xs font-hindi flex items-center justify-center space-x-1.5 ${
                    isLight
                      ? 'bg-white border-neutral-300 text-neutral-800 hover:bg-neutral-50'
                      : 'bg-neutral-800/80 border-neutral-700 text-neutral-200'
                  }`}
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>शेयर</span>
                </button>

                <button
                  onClick={() => handleSelect(activeShloka)}
                  className="py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 font-bold text-xs font-hindi flex items-center justify-center space-x-1 shadow-md shadow-amber-500/20 active:scale-95 transition-transform"
                >
                  <span>रील में पढ़ें</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            // Verse Selection Grid (1 to totalVerses)
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold font-hindi ${isLight ? 'text-neutral-700' : 'text-neutral-400'}`}>
                  श्लोक संख्या चुनें (१ से {currentChapterMeta.totalVerses}):
                </span>
                <span className="text-[11px] text-amber-600 dark:text-amber-400 font-hindi">
                  टैप करके पढ़ें
                </span>
              </div>

              <div className="grid grid-cols-5 sm:grid-cols-8 gap-2">
                {Array.from({ length: currentChapterMeta.totalVerses }, (_, i) => i + 1).map(vNum => {
                  const shlokaId = `bg_${selectedChapter}_${vNum}`;
                  const isSaved = safeBookmarks.includes(shlokaId);

                  return (
                    <button
                      key={vNum}
                      onClick={() => setSelectedVerseNumber(vNum)}
                      className={`relative aspect-square rounded-xl flex flex-col items-center justify-center text-xs font-medium font-hindi border transition-all hover:scale-105 active:scale-95 ${
                        isSaved
                          ? isLight
                            ? 'bg-amber-100 border-amber-400 text-amber-900 font-bold shadow-xs'
                            : 'bg-amber-950/50 border-amber-500/60 text-amber-300'
                          : isLight
                            ? 'bg-white border-neutral-200 hover:border-amber-400 text-neutral-800'
                            : 'bg-neutral-800 border-neutral-800 hover:border-amber-500/40 text-neutral-200'
                      }`}
                    >
                      <span className="text-sm font-bold">{vNum}</span>
                      {isSaved && (
                        <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-500" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Footer info */}
        <div className={`p-3 border-t flex items-center justify-between text-xs font-hindi ${
          isLight ? 'bg-amber-50/70 border-amber-200 text-neutral-600' : 'bg-neutral-950 border-neutral-800 text-neutral-400'
        }`}>
          <span>कुल ७०० श्लोक सुरक्षित व सुलभ</span>
          <span className="text-amber-600 dark:text-amber-400 font-medium">GeetaFlow Complete Scripture</span>
        </div>

      </div>
    </div>
  );
};
