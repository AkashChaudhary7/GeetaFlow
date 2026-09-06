import React from 'react';
import { ContextCard as ContextCardType } from '../../types';
import { ArtworkCanvas } from '../Common/ArtworkCanvas';
import { ReelActionsRail } from './ReelActionsRail';
import { History, ShieldAlert, Sparkles, ArrowRight } from 'lucide-react';

interface ContextCardProps {
  card: ContextCardType;
  isLiked?: boolean;
  onToggleLike?: () => void;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
  onJumpToShloka?: (id: string) => void;
  onShare?: () => void;
  onOpenAskGita?: () => void;
  isLight?: boolean;
}

export const ContextCard: React.FC<ContextCardProps> = ({ 
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
      {/* Header */}
      <div className="flex items-center justify-between pt-1 pb-1 shrink-0">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wider font-hindi flex items-center gap-1.5 border ${
          isLight
            ? 'bg-orange-50 border-orange-200 text-orange-800'
            : 'bg-orange-500/10 border-orange-500/20 text-orange-400'
        }`}>
          <History className="w-3.5 h-3.5" />
          ऐतिहासिक पृष्ठभूमि • Scripture Context
        </span>
      </div>

      {/* Main Body (Centered symmetrically) */}
      <div className="my-auto py-2 flex flex-col items-center space-y-4 text-center w-full max-w-sm mx-auto">
        <ArtworkCanvas type={card.illustration} size="md" />

        <h2 className={`font-hindi font-bold text-xl sm:text-2xl ${
          isLight ? 'text-amber-950' : 'text-amber-200'
        }`}>
          {card.title}
        </h2>

        {/* Historical Setting */}
        <div className={`w-full rounded-2xl p-4 text-left border ${
          isLight ? 'bg-white border-neutral-200/80 shadow-xs' : 'bg-neutral-900/80 border-neutral-800'
        }`}>
          <div className={`flex items-center space-x-1.5 text-xs font-semibold mb-1 font-hindi ${
            isLight ? 'text-amber-800' : 'text-amber-400'
          }`}>
            <span>परिदृश्य (The Setting):</span>
          </div>
          <p className={`text-xs sm:text-sm font-hindi leading-relaxed ${
            isLight ? 'text-neutral-800' : 'text-neutral-200'
          }`}>
            {card.historicalContext}
          </p>
        </div>

        {/* Psychological Dilemma */}
        <div className={`w-full rounded-2xl p-4 text-left border ${
          isLight 
            ? 'bg-orange-50/50 border-orange-200' 
            : 'bg-neutral-900/60 border-orange-500/20'
        }`}>
          <div className="flex items-center space-x-1.5 text-orange-600 dark:text-orange-400 text-xs font-semibold mb-1 font-hindi">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>अर्जुन का द्वंद्व (The Dilemma):</span>
          </div>
          <p className={`text-xs sm:text-sm font-hindi leading-relaxed ${
            isLight ? 'text-neutral-800' : 'text-neutral-300'
          }`}>
            {card.psychologicalDilemma}
          </p>
        </div>

        {/* Divine Guidance */}
        <div className={`w-full rounded-2xl p-3.5 text-left border ${
          isLight 
            ? 'bg-amber-50/70 border-amber-300/60' 
            : 'bg-amber-950/20 border-amber-500/20'
        }`}>
          <div className="flex items-center space-x-1.5 text-amber-700 dark:text-amber-300 text-xs font-semibold mb-1 font-hindi">
            <Sparkles className="w-3.5 h-3.5" />
            <span>श्रीकृष्ण का मार्गदर्शन:</span>
          </div>
          <p className={`text-xs font-hindi leading-relaxed ${
            isLight ? 'text-neutral-800' : 'text-neutral-200'
          }`}>
            {card.divineGuidance}
          </p>
        </div>

        {/* Action button to related verse */}
        {card.relatedVerseId && (
          <button
            onClick={() => onJumpToShloka && onJumpToShloka(card.relatedVerseId)}
            className="w-full py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-hindi flex items-center justify-center space-x-1.5 border border-neutral-700 transition-colors"
          >
            <span>संबंधित श्लोक देखें</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
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
