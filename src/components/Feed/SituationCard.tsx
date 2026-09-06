import React from 'react';
import { SituationCard as SituationCardType } from '../../types';
import { ArtworkCanvas } from '../Common/ArtworkCanvas';
import { ReelActionsRail } from './ReelActionsRail';
import { Compass, Lightbulb, ArrowRight } from 'lucide-react';

interface SituationCardProps {
  card: SituationCardType;
  isLiked?: boolean;
  onToggleLike?: () => void;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
  onJumpToShloka?: (shlokaId: string) => void;
  onShare?: () => void;
  onOpenAskGita?: () => void;
  isLight?: boolean;
}

export const SituationCard: React.FC<SituationCardProps> = ({
  card,
  isLiked = false,
  onToggleLike,
  isBookmarked = false,
  onToggleBookmark,
  onJumpToShloka,
  onShare,
  onOpenAskGita,
  isLight = false
}) => {
  return (
    <div className={`relative w-full h-full flex flex-col justify-between pt-14 pb-16 px-4 sm:px-6 max-w-md mx-auto select-none overflow-y-auto no-scrollbar transition-colors ${
      isLight ? 'text-neutral-900 bg-[#fdfbf7]' : 'text-neutral-100 bg-neutral-950'
    }`}>
      {/* Category Header */}
      <div className="flex items-center justify-between pt-1 pb-1 shrink-0">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wider font-hindi flex items-center gap-1.5 border ${
          isLight
            ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
            : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
        }`}>
          <Compass className="w-3.5 h-3.5" />
          जीवन परिस्थिति • Life Situation
        </span>
        <span className={`text-xs font-hindi ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
          {card.situationCategory}
        </span>
      </div>

      {/* Main Content (Centered symmetrically) */}
      <div className="my-auto py-2 flex flex-col items-center space-y-4 text-center w-full max-w-sm mx-auto">
        
        {/* Visual Motif */}
        <div className="relative">
          <ArtworkCanvas type={card.illustration} size="md" />
        </div>

        {/* Situation Prompt */}
        <div className="space-y-2 max-w-sm">
          <h2 className={`font-hindi font-bold text-xl sm:text-2xl leading-snug ${
            isLight ? 'text-amber-950' : 'text-amber-200'
          }`}>
            "{card.title}"
          </h2>
          <p className={`text-xs sm:text-sm font-hindi leading-relaxed ${
            isLight ? 'text-neutral-700' : 'text-neutral-300'
          }`}>
            {card.description}
          </p>
        </div>

        {/* Relevant Gita Verse Highlight */}
        <div 
          onClick={() => onJumpToShloka && onJumpToShloka(card.relevantShlokaId)}
          className={`w-full rounded-2xl p-4 text-left cursor-pointer transition-all border group ${
            isLight
              ? 'bg-amber-50/70 border-amber-300 hover:bg-amber-100/60'
              : 'bg-amber-950/20 border-amber-500/30 hover:border-amber-400/60 hover:bg-amber-950/30'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-amber-700 dark:text-amber-400 font-hindi font-semibold mb-1">
            <span>मार्गदर्शक श्लोक: अध्याय {card.relevantShloka.chapter} • श्लोक {card.relevantShloka.verse}</span>
            <span className="flex items-center text-[11px] group-hover:translate-x-0.5 transition-transform">
              श्लोक देखें <ArrowRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
          <p className={`font-sanskrit text-sm font-medium mb-1 ${isLight ? 'text-amber-950' : 'text-amber-100/90'}`}>
            {card.relevantShloka.sanskritSnippet}
          </p>
          <p className={`font-hindi text-xs italic ${isLight ? 'text-neutral-700' : 'text-neutral-300'}`}>
            "{card.relevantShloka.simpleHindi}"
          </p>
        </div>

        {/* Gita's Timeless Perspective */}
        <div className={`w-full rounded-2xl p-4 text-left border ${
          isLight
            ? 'bg-white border-neutral-200/80 shadow-xs'
            : 'bg-neutral-900/80 border-neutral-800'
        }`}>
          <div className="flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-1.5 font-hindi">
            <Lightbulb className="w-3.5 h-3.5" />
            <span>गीता का दृष्टिकोण • Gita's Perspective</span>
          </div>
          <p className={`text-xs sm:text-sm font-hindi leading-relaxed ${
            isLight ? 'text-neutral-800' : 'text-neutral-200'
          }`}>
            {card.gitaPerspective}
          </p>
        </div>

        {/* Practical Life Action */}
        <div className={`w-full rounded-2xl p-3.5 text-left border ${
          isLight
            ? 'bg-emerald-50/50 border-emerald-200/60'
            : 'bg-neutral-900/50 border-emerald-500/20'
        }`}>
          <span className="text-emerald-700 dark:text-emerald-400 text-[11px] font-semibold uppercase tracking-wider font-hindi block mb-1">
            आज के जीवन में प्रयोग:
          </span>
          <p className={`text-xs font-hindi leading-relaxed ${isLight ? 'text-neutral-800' : 'text-neutral-200'}`}>
            {card.practicalAction}
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
