import React from 'react';
import { TopicCard as TopicCardType } from '../../types';
import { ArtworkCanvas } from '../Common/ArtworkCanvas';
import { ReelActionsRail } from './ReelActionsRail';
import { Sparkles, ArrowRight, Layers } from 'lucide-react';

interface TopicCardProps {
  card: TopicCardType;
  isLiked?: boolean;
  onToggleLike?: () => void;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
  onExploreTopic?: (topic: string) => void;
  onOpenAskGita?: () => void;
  onShare?: () => void;
  isLight?: boolean;
}

export const TopicCard: React.FC<TopicCardProps> = ({ 
  card, 
  isLiked = false,
  onToggleLike,
  isBookmarked = false,
  onToggleBookmark,
  onExploreTopic,
  onOpenAskGita,
  onShare,
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
            ? 'bg-indigo-50 border-indigo-200 text-indigo-800'
            : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300'
        }`}>
          <Layers className="w-3.5 h-3.5" />
          विषय दर्शन • Topic Focus
        </span>
        <span className={`text-xs font-hindi ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
          {card.versesCount} संबंधित श्लोक
        </span>
      </div>

      {/* Center Body (Centered symmetrically) */}
      <div className="my-auto py-2 flex flex-col items-center space-y-4 text-center w-full max-w-sm mx-auto">
        <ArtworkCanvas type={card.illustration} size="lg" />

        <div className="space-y-1">
          <h2 className={`font-hindi font-black text-2xl sm:text-3xl tracking-tight ${
            isLight ? 'text-amber-950' : 'text-amber-200'
          }`}>
            {card.hindiTitle}
          </h2>
          <p className={`text-xs sm:text-sm font-hindi ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
            {card.subtitle}
          </p>
        </div>

        {/* Topic Essence */}
        <div className={`w-full rounded-2xl p-4 text-left shadow-xs border ${
          isLight ? 'bg-white border-neutral-200/80' : 'bg-neutral-900/80 border-neutral-800'
        }`}>
          <div className={`flex items-center space-x-1.5 text-xs font-semibold mb-1 font-hindi ${
            isLight ? 'text-amber-800' : 'text-amber-400'
          }`}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>गीता का सार</span>
          </div>
          <p className={`text-xs sm:text-sm font-hindi leading-relaxed ${
            isLight ? 'text-neutral-800' : 'text-neutral-200'
          }`}>
            {card.essence}
          </p>
        </div>

        {/* Action button to explore all topic verses */}
        <button
          onClick={() => onExploreTopic && onExploreTopic(card.topic)}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-neutral-950 font-bold font-hindi text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/15 transition-all transform active:scale-98"
        >
          <span>‘{card.topic}’ के सभी श्लोक पढ़ें</span>
          <ArrowRight className="w-4 h-4" />
        </button>
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
