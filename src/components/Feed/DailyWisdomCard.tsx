import React from 'react';
import { DailyWisdomCard as DailyWisdomType } from '../../types';
import { ArtworkCanvas } from '../Common/ArtworkCanvas';
import { ReelActionsRail } from './ReelActionsRail';
import { Sun, CheckCircle } from 'lucide-react';

interface DailyWisdomCardProps {
  card: DailyWisdomType;
  isLiked?: boolean;
  onToggleLike?: () => void;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
  onShare?: () => void;
  onOpenAskGita?: () => void;
  isLight?: boolean;
}

export const DailyWisdomCard: React.FC<DailyWisdomCardProps> = ({ 
  card,
  isLiked = false,
  onToggleLike,
  isBookmarked = false,
  onToggleBookmark,
  onShare,
  onOpenAskGita,
  isLight = false 
}) => {
  return (
    <div className={`relative w-full h-full flex flex-col justify-between pt-14 pb-16 px-4 sm:px-6 max-w-md mx-auto select-none overflow-y-auto no-scrollbar transition-colors ${
      isLight ? 'text-neutral-900 bg-[#fdfbf7]' : 'text-neutral-100 bg-neutral-950'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between pt-1 pb-1 shrink-0">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wider font-hindi flex items-center gap-1.5 border ${
          isLight
            ? 'bg-amber-100/80 border-amber-300/60 text-amber-900'
            : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
        }`}>
          <Sun className="w-3.5 h-3.5" />
          दैनिक अमृत • Daily Gita Reflection
        </span>
        <span className={`text-xs font-hindi ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
          {card.sourceVerse}
        </span>
      </div>

      {/* Center Body (Centered symmetrically) */}
      <div className="my-auto py-2 flex flex-col items-center space-y-4 text-center w-full max-w-sm mx-auto">
        <ArtworkCanvas type={card.illustration} size="md" />

        <h2 className={`font-hindi font-bold text-xl sm:text-2xl ${
          isLight ? 'text-amber-950' : 'text-amber-200'
        }`}>
          {card.title}
        </h2>

        {/* Shloka Quote Snippet */}
        <div className={`px-4 py-2 rounded-xl border ${
          isLight 
            ? 'bg-amber-50 border-amber-300/70 text-amber-950' 
            : 'bg-amber-950/20 border-amber-500/20 text-amber-300'
        }`}>
          <p className="font-sanskrit text-sm sm:text-base font-semibold">
            "{card.quoteSnippet}"
          </p>
        </div>

        {/* Wisdom Takeaway */}
        <div className={`w-full rounded-2xl p-4 text-left border ${
          isLight ? 'bg-white border-neutral-200/80 shadow-xs' : 'bg-neutral-900/80 border-neutral-800'
        }`}>
          <p className={`text-xs sm:text-sm font-hindi leading-relaxed ${
            isLight ? 'text-neutral-800' : 'text-neutral-200'
          }`}>
            {card.wisdomText}
          </p>
        </div>

        {/* Daily Action Step */}
        <div className={`w-full rounded-2xl p-4 text-left border ${
          isLight 
            ? 'bg-emerald-50/60 border-emerald-300/60' 
            : 'bg-emerald-950/20 border-emerald-500/30'
        }`}>
          <div className="flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-1 font-hindi">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>आज का संकल्प (Today's Action):</span>
          </div>
          <p className={`text-xs font-hindi leading-relaxed ${
            isLight ? 'text-neutral-800' : 'text-neutral-200'
          }`}>
            {card.actionStep}
          </p>
        </div>
      </div>

      {/* Horizontal Action Bar */}
      <div className="pt-2 pb-2 flex items-center justify-center w-full shrink-0">
        <ReelActionsRail
          layout="horizontal"
          isLiked={isLiked}
          onToggleLike={onToggleLike}
          isBookmarked={isBookmarked}
          onToggleBookmark={onToggleBookmark}
          onShare={onShare}
          isLight={isLight}
        />
      </div>
    </div>
  );
};
