import React, { useState, useRef, useEffect } from 'react';
import { Shloka, UserPreferences } from '../../types';
import { ArtworkCanvas } from '../Common/ArtworkCanvas';
import { ReelActionsRail } from './ReelActionsRail';
import { AmbientParticlesCanvas } from './AmbientParticlesCanvas';
import { BookOpen, Info, Heart, Clock, ChevronDown, ChevronUp, Square } from 'lucide-react';
import { audioEngine } from '../../utils/audioEngine';
import { triggerHaptic } from '../../utils/haptics';
import { getTranslatedShloka } from '../../utils/translation';

interface ShlokaCardProps {
  shloka: Shloka;
  preferences: UserPreferences;
  isBookmarked: boolean;
  isLiked: boolean;
  onToggleBookmark: (id: string) => void;
  onToggleLike: (id: string) => void;
  onOpenShare: (shloka: Shloka) => void;
  onDownloadVideo?: (shloka: Shloka) => void;
  onOpenTopic?: (topic: string) => void;
  onOpenAskGita?: () => void;
  isLight?: boolean;
}

export const ShlokaCard: React.FC<ShlokaCardProps> = ({
  shloka,
  preferences,
  isBookmarked,
  isLiked,
  onToggleBookmark,
  onToggleLike,
  onOpenShare,
  onDownloadVideo,
  onOpenTopic,
  isLight = false,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [showWordMeanings, setShowWordMeanings] = useState(false);
  const [showHeartPop, setShowHeartPop] = useState(false);
  const lastTapRef = useRef<number>(0);

  const translated = getTranslatedShloka(shloka, preferences.language);

  // Subscribe to audio engine state to reflect natural voice recitation
  useEffect(() => {
    const unsubscribe = audioEngine.addStateListener((state) => {
      const isThisShloka = state.chapter === shloka.chapter && state.verse === shloka.verse;
      if (isThisShloka && state.isPlaying) {
        setIsPlayingAudio(true);
        setAudioCurrentTime(state.currentTime);
        setAudioDuration(state.duration);
      } else if (isPlayingAudio && !state.isPlaying) {
        setIsPlayingAudio(false);
      }
    });
    return () => unsubscribe();
  }, [shloka.chapter, shloka.verse, isPlayingAudio]);

  const toggleAudio = () => {
    triggerHaptic('light');
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

  const formatAudioTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Double tap to like (Instagram Reels style)
  const handleCardTap = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      triggerHaptic('doubleTap');
      if (!isLiked) {
        onToggleLike(shloka.id);
      }
      setShowHeartPop(true);
      setTimeout(() => setShowHeartPop(false), 900);
    }
    lastTapRef.current = now;
  };

  const getFontSizeClass = () => {
    switch (preferences.fontSize) {
      case 'sm': return 'text-lg sm:text-xl leading-relaxed';
      case 'lg': return 'text-2xl sm:text-3xl leading-relaxed';
      case 'xl': return 'text-3xl sm:text-4xl leading-relaxed';
      case 'md':
      default:
        return 'text-xl sm:text-2xl leading-relaxed';
    }
  };

  return (
    <div 
      onClick={handleCardTap}
      className={`relative w-full h-full flex flex-col justify-between pt-14 pb-16 px-4 sm:px-6 max-w-md mx-auto select-none overflow-y-auto no-scrollbar transition-colors ${
        isLight ? 'text-amber-950 bg-white' : 'text-neutral-100 bg-neutral-950'
      }`}
    >
      {/* Floating Instagram Reels Double-Tap Heart Animation */}
      {showHeartPop && (
        <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none animate-ping">
          <Heart className="w-20 h-20 text-rose-500 fill-rose-500 drop-shadow-2xl" />
        </div>
      )}

      {/* Subtle Spiritual Doodle Watermarks (Top-Right & Bottom-Left) */}
      <div className="absolute top-2 right-2 pointer-events-none opacity-[0.06] dark:opacity-[0.09] select-none">
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
          <circle cx="30" cy="30" r="28" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
          <circle cx="30" cy="30" r="20" stroke="currentColor" strokeWidth="1" />
          <circle cx="30" cy="30" r="10" stroke="currentColor" strokeWidth="1" strokeDasharray="3 2" />
          <path d="M 30 2 L 30 58 M 2 30 L 58 30" stroke="currentColor" strokeWidth="0.8" />
        </svg>
      </div>
      <div className="absolute bottom-2 left-2 pointer-events-none opacity-[0.05] dark:opacity-[0.08] select-none">
        <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
          <path d="M 5 45 Q 25 25 45 45 M 5 45 Q 25 5 45 45" stroke="currentColor" strokeWidth="1" />
          <circle cx="25" cy="25" r="5" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>

      {/* Top Header Badge & Read Time Indicator */}
      <div className="flex items-center justify-between pt-1 pb-2 shrink-0 relative z-10">
        <div className="flex items-center space-x-2">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide font-hindi shadow-xs ${
            isLight
              ? 'bg-amber-100 border border-amber-300 text-amber-900'
              : 'bg-amber-500/15 border border-amber-500/25 text-amber-400'
          }`}>
            अध्याय {shloka.chapter} • श्लोक {shloka.verse}
          </span>
          <span className={`text-[11px] font-hindi truncate max-w-[120px] sm:max-w-none ${
            isLight ? 'text-amber-800/80 font-medium' : 'text-neutral-400'
          }`}>
            {shloka.chapterNameHindi}
          </span>
        </div>

        {/* Read time indicator */}
        <div 
          className={`flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-medium tracking-wide font-hindi border shrink-0 ${
            isLight
              ? 'bg-amber-50/90 border-amber-300/80 text-amber-800'
              : 'bg-neutral-900/80 border-neutral-800 text-neutral-400'
          }`}
          title="पठन अवधि"
        >
          <Clock className={`w-3 h-3 ${isLight ? 'text-amber-600' : 'text-amber-400'}`} />
          <span>{translated.readTimeEstimate}</span>
        </div>
      </div>

      {/* Central Content Area (Centered symmetrically) */}
      <div className="my-auto py-1 flex flex-col items-center text-center space-y-3 w-full max-w-sm mx-auto relative z-10">
        
        {/* Unique Sacred Doodle Emblem for each Shloka */}
        <div className="relative shrink-0">
          <ArtworkCanvas 
            type={shloka.illustration} 
            shlokaId={shloka.id}
            chapter={shloka.chapter}
            verse={shloka.verse}
            size="sm" 
            isLight={isLight}
          />
        </div>

        {/* Primary Sanskrit Shloka with Synced Ambient Atmosphere Particles */}
        <div className="relative space-y-1.5 max-w-sm w-full py-2.5 px-3 rounded-2xl overflow-hidden">
          {/* Subtle canvas-based particle animation or slow-moving gradient synced to Ambient Atmosphere */}
          <AmbientParticlesCanvas
            isLight={isLight}
            atmosphereType={preferences.ambientAtmosphereType}
            isActive={Boolean(preferences.ambientAtmosphereEnabled || preferences.ambientSound)}
          />

          <div className={`relative z-10 font-sanskrit font-bold tracking-wide whitespace-pre-line ${
            isLight ? 'text-amber-900 drop-shadow-xs' : 'text-amber-100 sanskrit-glow'
          } ${getFontSizeClass()}`}>
            {shloka.sanskrit}
          </div>

          {/* Optional Transliteration */}
          {preferences.showTransliteration && shloka.transliteration && (
            <p className={`relative z-10 text-[11px] italic font-mono tracking-wide whitespace-pre-line pt-0.5 ${
              isLight ? 'text-amber-800/80 font-medium' : 'text-amber-200/60'
            }`}>
              {shloka.transliteration}
            </p>
          )}

          {/* Natural Voice Audio Narration Indicator */}
          {isPlayingAudio && (
            <div className="pt-1 flex justify-center">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-hindi border animate-fadeIn transition-all shadow-xs ${
                isLight
                  ? 'bg-amber-50/95 border-amber-300/80 text-amber-950 shadow-amber-500/10'
                  : 'bg-neutral-900/95 border-amber-500/40 text-amber-300 shadow-amber-500/15'
              }`}>
                {/* Animated Equalizer Waveform */}
                <div className="flex items-end gap-0.5 h-3 w-3.5 pb-0.5">
                  <span className="w-0.5 bg-amber-500 rounded-full animate-pulse h-2.5" />
                  <span className="w-0.5 bg-amber-500 rounded-full animate-pulse [animation-delay:-0.2s] h-3.5" />
                  <span className="w-0.5 bg-amber-500 rounded-full animate-pulse [animation-delay:-0.4s] h-2" />
                </div>
                <span className="font-semibold text-[10.5px] tracking-wide">
                  प्राकृतिक वैदिक पाठ
                </span>
                {audioDuration > 0 && (
                  <span className="text-[10px] font-mono opacity-80">
                    {formatAudioTime(audioCurrentTime)} / {formatAudioTime(audioDuration)}
                  </span>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleAudio();
                  }}
                  className="p-0.5 hover:opacity-75 transition-opacity ml-0.5"
                  title="विराम करें"
                  aria-label="Stop Audio"
                >
                  <Square className="w-2.5 h-2.5 fill-current" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Unified Clutter-Free Meaning & Practical Takeaway Card */}
        <div className={`w-full rounded-2xl p-3.5 sm:p-4 text-left shadow-xs border transition-all ${
          isLight 
            ? 'bg-white border-amber-300/90 text-amber-950 shadow-amber-500/5' 
            : 'bg-neutral-900/80 border-neutral-800 text-neutral-200'
        }`}>
          {/* Meaning Section */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className={`text-[11px] font-bold uppercase tracking-wider font-hindi flex items-center gap-1 ${
                isLight ? 'text-amber-700' : 'text-amber-400'
              }`}>
                <BookOpen className="w-3 h-3" />
                {translated.labelMeaning}
              </span>
              {shloka.wordMeanings && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerHaptic('light');
                    setShowWordMeanings(!showWordMeanings);
                  }}
                  className={`text-[10px] font-medium transition-colors flex items-center gap-0.5 ${
                    isLight ? 'text-amber-800/80 hover:text-amber-950' : 'text-neutral-400 hover:text-amber-300'
                  }`}
                >
                  <Info className="w-2.5 h-2.5" />
                  {showWordMeanings ? 'छिपाएं' : 'शब्दार्थ'}
                </button>
              )}
            </div>
            <p className="text-xs sm:text-sm leading-relaxed font-hindi font-medium">
              {translated.meaning}
            </p>
          </div>

          {/* Word Meanings Drawer (If toggled) */}
          {showWordMeanings && shloka.wordMeanings && (
            <div className={`mt-2 pt-2 border-t text-[11px] font-hindi leading-normal p-2 rounded-xl animate-fadeIn ${
              isLight 
                ? 'border-amber-200 bg-amber-50/60 text-amber-950' 
                : 'border-neutral-800 bg-neutral-950/60 text-neutral-300'
            }`}>
              <span className={`font-bold ${isLight ? 'text-amber-800' : 'text-amber-400'}`}>
                {translated.labelWordMeanings}:{' '}
              </span>
              {shloka.wordMeanings}
            </div>
          )}

          {/* Subtle Golden Divider */}
          <div className={`my-2.5 border-t ${isLight ? 'border-amber-200/80' : 'border-neutral-800'}`} />

          {/* Aaj Ki Seekh (Takeaway) */}
          <div className="space-y-0.5">
            <span className={`text-[11px] font-bold font-hindi flex items-center gap-1 ${
              isLight ? 'text-amber-700' : 'text-amber-400'
            }`}>
              ✨ {translated.labelTakeaway}
            </span>
            <p className={`text-xs font-hindi leading-relaxed ${
              isLight ? 'text-amber-950/90 font-medium' : 'text-neutral-300'
            }`}>
              {translated.takeaway}
            </p>
          </div>

          {/* In-depth Commentary Toggle */}
          <div className="pt-2 mt-2 border-t border-dashed border-amber-500/20 flex justify-end">
            <button
              onClick={(e) => {
                e.stopPropagation();
                triggerHaptic('light');
                setShowDetails(!showDetails);
              }}
              className={`text-[10px] font-hindi font-semibold flex items-center gap-1 transition-colors ${
                isLight ? 'text-amber-700 hover:text-amber-900' : 'text-amber-400 hover:text-amber-300'
              }`}
            >
              <span>{showDetails ? 'विस्तृत भावार्थ बंद करें' : 'विस्तृत भावार्थ पढ़ें'}</span>
              {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          {/* Expanded Bhavarth */}
          {showDetails && (
            <div className={`mt-2 pt-2 border-t text-xs font-hindi leading-relaxed text-left animate-fadeIn ${
              isLight ? 'border-amber-200 text-amber-950' : 'border-neutral-800 text-neutral-300'
            }`}>
              <p className="leading-relaxed">{translated.bhavarth || shloka.bhavarth}</p>
              {shloka.contextNotes && (
                <p className={`text-[11px] italic mt-1.5 pt-1 border-t ${
                  isLight ? 'border-amber-100 text-amber-800/80' : 'border-neutral-800 text-neutral-400'
                }`}>
                  संदर्भ: {shloka.contextNotes}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Topic Chips */}
        <div className="flex flex-wrap justify-center gap-1.5 pt-1">
          {shloka.topics.map((t, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                triggerHaptic('light');
                onOpenTopic && onOpenTopic(t);
              }}
              className={`text-[10px] px-2.5 py-0.5 rounded-full border transition-all font-hindi font-medium ${
                isLight
                  ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300/80 shadow-2xs'
                  : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-amber-300 border-neutral-800'
              }`}
            >
              #{t}
            </button>
          ))}
        </div>
      </div>

      {/* Horizontal Action Bar - Centered at bottom, zero text obstruction */}
      <div className="pt-2 pb-2 flex items-center justify-center w-full shrink-0">
        <ReelActionsRail
          layout="horizontal"
          isLiked={isLiked}
          onToggleLike={() => onToggleLike(shloka.id)}
          onDownloadVideo={onDownloadVideo ? () => onDownloadVideo(shloka) : undefined}
          isBookmarked={isBookmarked}
          onToggleBookmark={() => onToggleBookmark(shloka.id)}
          onShare={() => onOpenShare(shloka)}
          isLight={isLight}
        />
      </div>

    </div>
  );
};
