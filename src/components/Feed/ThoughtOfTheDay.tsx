import React, { useState } from 'react';
import { getTodayThought, DailyThought } from '../../data/dailyWisdomList';
import { Sparkles, ChevronDown, ChevronUp, Volume2, ArrowRight, X } from 'lucide-react';
import { audioEngine } from '../../utils/audioEngine';
import { triggerHaptic } from '../../utils/haptics';

interface ThoughtOfTheDayProps {
  isLight?: boolean;
  language?: 'hi' | 'en' | 'hinglish';
  onJumpToVerse?: (chapter: number, verse: number) => void;
  className?: string;
  defaultExpanded?: boolean;
  onClose?: () => void;
}

export const ThoughtOfTheDay: React.FC<ThoughtOfTheDayProps> = ({
  isLight = false,
  language = 'hi',
  onJumpToVerse,
  className = '',
  defaultExpanded = false,
  onClose
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const thought = getTodayThought();

  const handleToggle = () => {
    triggerHaptic('light');
    setIsExpanded(!isExpanded);
  };

  const handlePlayAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic('light');
    if (isPlayingAudio) {
      audioEngine.stop();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      const ch = thought.sourceRef?.chapter;
      const vr = thought.sourceRef?.verse;
      if (ch && vr) {
        audioEngine.playNaturalShloka(
          ch,
          vr,
          () => setIsPlayingAudio(false),
          () => setIsPlayingAudio(false)
        );
      } else {
        audioEngine.speak(thought.quoteSanskrit, 'sa', () => setIsPlayingAudio(false));
      }
    }
  };

  const getTranslationText = () => {
    if (language === 'en') return thought.englishTranslation;
    if (language === 'hinglish') return thought.hinglishTranslation;
    return thought.hindiTranslation;
  };

  return (
    <div className={`w-full pointer-events-auto select-none ${className}`}>
      <div 
        onClick={onClose ? undefined : handleToggle}
        className={`rounded-2xl border transition-all shadow-md overflow-hidden ${
          !onClose ? 'cursor-pointer' : ''
        } ${
          isLight
            ? 'bg-white border-amber-300/80 text-neutral-900 shadow-amber-500/10'
            : 'bg-neutral-900/95 border-amber-500/30 text-neutral-100 shadow-neutral-950/50'
        }`}
      >
        {/* Header Strip */}
        <div className={`px-3.5 py-2.5 flex items-center justify-between border-b ${
          isLight ? 'bg-amber-50/70 border-amber-200' : 'bg-neutral-950/40 border-neutral-800'
        }`}>
          <div className="flex items-center space-x-2">
            <span className="p-1 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <div>
              <span className={`text-[11px] font-bold tracking-wide font-hindi uppercase ${
                isLight ? 'text-amber-900' : 'text-amber-300'
              }`}>
                आज का दिव्य विचार • Daily Thought
              </span>
              <span className={`text-[10px] ml-2 px-1.5 py-0.5 rounded-md ${
                isLight ? 'bg-amber-200/60 text-amber-950' : 'bg-amber-500/10 text-amber-400'
              }`}>
                {thought.theme}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={handlePlayAudio}
              className={`p-1 rounded-full transition-colors ${
                isPlayingAudio
                  ? 'bg-amber-500 text-neutral-950'
                  : isLight
                    ? 'hover:bg-amber-200 text-amber-900'
                    : 'hover:bg-neutral-800 text-amber-300'
              }`}
              title="विचार सुनें"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
            {onClose ? (
              <button
                onClick={onClose}
                className={`p-1 rounded-full hover:bg-neutral-500/20 ${isLight ? 'text-neutral-600' : 'text-neutral-300'}`}
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <span className={`text-xs ${isLight ? 'text-amber-800' : 'text-amber-400'}`}>
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </span>
            )}
          </div>
        </div>

        {/* Compact View Snippet (If collapsed) */}
        {!isExpanded && !defaultExpanded && (
          <div className="px-3.5 py-2 flex items-center justify-between">
            <p className={`text-xs font-sanskrit font-bold truncate pr-2 ${
              isLight ? 'text-amber-900' : 'text-amber-100'
            }`}>
              "{thought.quoteSanskrit}"
            </p>
            <span className={`text-[10px] font-hindi shrink-0 ${
              isLight ? 'text-amber-700' : 'text-amber-400/80'
            }`}>
              {thought.source}
            </span>
          </div>
        )}

        {/* Expanded View */}
        {(isExpanded || defaultExpanded) && (
          <div className="p-3.5 space-y-3 animate-fadeIn">
            {/* Sanskrit Quote */}
            <div className={`p-3 rounded-xl border text-center space-y-1 ${
              isLight ? 'bg-amber-50/50 border-amber-200' : 'bg-neutral-950/60 border-neutral-800'
            }`}>
              <div className={`font-sanskrit text-sm sm:text-base font-bold whitespace-pre-line ${
                isLight ? 'text-amber-950' : 'text-amber-200'
              }`}>
                {thought.quoteSanskrit}
              </div>
              <span className={`text-[10px] font-hindi block ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
                — {thought.source}
              </span>
            </div>

            {/* Translation in User's Language */}
            <div className="text-xs font-hindi leading-relaxed">
              <span className={`font-semibold ${isLight ? 'text-amber-800' : 'text-amber-400'}`}>
                सरल अर्थ:{' '}
              </span>
              <span className={isLight ? 'text-neutral-800' : 'text-neutral-200'}>
                {getTranslationText()}
              </span>
            </div>

            {/* Deep Reflection */}
            <div className={`p-2.5 rounded-xl border text-xs font-hindi leading-relaxed ${
              isLight ? 'bg-amber-50/40 border-amber-200/60 text-neutral-800' : 'bg-neutral-950/40 border-neutral-800 text-neutral-300'
            }`}>
              <span className={`font-semibold block mb-0.5 ${isLight ? 'text-amber-900' : 'text-amber-300'}`}>
                आज का चिंतन:
              </span>
              {thought.reflection}
            </div>

            {/* Sankalpa (Resolution) & Jump Action */}
            <div className={`p-2.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 ${
              isLight ? 'bg-amber-100/70 border-amber-300 text-amber-950' : 'bg-amber-500/10 border-amber-500/30 text-amber-200'
            }`}>
              <div className="text-xs font-hindi">
                <span className="font-bold">✨ आज का संकल्प: </span>
                <span>{thought.sankalpa}</span>
              </div>

              {onJumpToVerse && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerHaptic('medium');
                    onJumpToVerse(thought.sourceRef.chapter, thought.sourceRef.verse);
                    if (onClose) onClose();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-amber-500 text-neutral-950 font-bold text-xs font-hindi flex items-center space-x-1 shrink-0 shadow-xs hover:brightness-105"
                >
                  <span>श्लोक पढ़ें</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
