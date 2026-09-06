import React from 'react';
import { ChapterIntroCard as ChapterIntroType } from '../../types';
import { ArtworkCanvas } from '../Common/ArtworkCanvas';
import { ReelActionsRail } from './ReelActionsRail';
import { BookOpen, CheckCircle2 } from 'lucide-react';

interface ChapterIntroCardProps {
  card: ChapterIntroType;
  isLiked?: boolean;
  onToggleLike?: () => void;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
  onOpenAskGita?: () => void;
  onShare?: () => void;
  isLight?: boolean;
}

export const ChapterIntroCard: React.FC<ChapterIntroCardProps> = ({ 
  card,
  isLiked = false,
  onToggleLike,
  isBookmarked = false,
  onToggleBookmark,
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
            ? 'bg-amber-100/80 border-amber-300/60 text-amber-900'
            : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
        }`}>
          <BookOpen className="w-3.5 h-3.5" />
          अध्याय प्रवेश • Chapter Introduction
        </span>
        <span className={`text-xs font-hindi ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
          कुल {card.verseCount} श्लोक
        </span>
      </div>

      {/* Center Body (Centered symmetrically) */}
      <div className="my-auto py-2 flex flex-col items-center space-y-4 text-center w-full max-w-sm mx-auto">
        <ArtworkCanvas type={card.illustration} size="md" />

        <div className="space-y-1">
          <span className="text-amber-500 font-bold text-xs uppercase tracking-widest font-hindi">
            अध्याय {card.chapterNumber}
          </span>
          <h2 className={`font-sanskrit font-bold text-2xl sm:text-3xl ${
            isLight ? 'text-amber-950' : 'text-amber-200'
          }`}>
            {card.sanskritName}
          </h2>
          <p className={`text-xs sm:text-sm font-hindi ${isLight ? 'text-neutral-600' : 'text-neutral-300'}`}>
            {card.hindiName}
          </p>
        </div>

        {/* Chapter Summary */}
        <div className={`w-full rounded-2xl p-4 text-left border ${
          isLight ? 'bg-white border-neutral-200/80 shadow-xs' : 'bg-neutral-900/80 border-neutral-800'
        }`}>
          <p className={`text-xs sm:text-sm font-hindi leading-relaxed ${
            isLight ? 'text-neutral-800' : 'text-neutral-200'
          }`}>
            {card.summary}
          </p>
        </div>

        {/* Key Teachings Checklist */}
        <div className={`w-full rounded-2xl p-4 text-left space-y-2 border ${
          isLight 
            ? 'bg-amber-50/50 border-amber-200' 
            : 'bg-neutral-900/50 border-amber-500/20'
        }`}>
          <span className={`text-xs font-semibold font-hindi block mb-1 ${
            isLight ? 'text-amber-800' : 'text-amber-400'
          }`}>
            प्रमुख शिक्षाएं:
          </span>
          {card.keyTeachings.map((teaching, i) => (
            <div key={i} className="flex items-start space-x-2 text-xs font-hindi">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
              <span className={isLight ? 'text-neutral-700' : 'text-neutral-300'}>{teaching}</span>
            </div>
          ))}
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
