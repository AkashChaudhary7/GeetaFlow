import React from 'react';
import { Heart, Bookmark, Share2, Volume2, VolumeX, Download } from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';

interface ReelActionsRailProps {
  isLiked?: boolean;
  onToggleLike?: () => void;
  likeCount?: number;
  onDownloadVideo?: () => void;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
  onShare?: () => void;
  isPlayingAudio?: boolean;
  onToggleAudio?: () => void;
  isLight?: boolean;
  layout?: 'horizontal' | 'vertical';
  className?: string;
}

export const ReelActionsRail: React.FC<ReelActionsRailProps> = ({
  isLiked = false,
  onToggleLike,
  likeCount,
  onDownloadVideo,
  isBookmarked = false,
  onToggleBookmark,
  onShare,
  isPlayingAudio = false,
  onToggleAudio,
  isLight = false,
  layout = 'horizontal',
  className = '',
}) => {
  const isHorizontal = layout === 'horizontal';

  // Independent, compact, semi-transparent glass button style
  const baseBtnClass = `h-7.5 w-7.5 sm:h-8 sm:w-8 rounded-full flex items-center justify-center transition-all duration-200 active:scale-85 select-none backdrop-blur-xs shadow-2xs ${
    isLight
      ? 'bg-black/[0.04] hover:bg-black/[0.09] text-neutral-700 hover:text-neutral-950 border border-black/10'
      : 'bg-white/[0.08] hover:bg-white/[0.16] text-neutral-300 hover:text-white border border-white/12'
  }`;

  if (isHorizontal) {
    return (
      <div 
        onClick={(e) => e.stopPropagation()}
        className={`inline-flex items-center justify-center gap-2 sm:gap-2.5 pointer-events-auto select-none ${className}`}
      >
        {/* 1. Like Button (Independent & Transparent) */}
        {onToggleLike && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              triggerHaptic(isLiked ? 'light' : 'success');
              onToggleLike();
            }}
            className={`${baseBtnClass} ${
              isLiked
                ? isLight
                  ? '!bg-rose-500/15 !text-rose-600 !border-rose-500/30 scale-105'
                  : '!bg-rose-500/20 !text-rose-400 !border-rose-500/40 scale-105'
                : 'hover:text-rose-500'
            }`}
            title={isLiked ? 'पसंद हटाया गया' : 'पसंद करें'}
            aria-label="Like"
          >
            <Heart
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                isLiked ? 'fill-rose-500 text-rose-500 scale-110' : ''
              }`}
            />
            {likeCount !== undefined && likeCount > 0 && (
              <span className="text-[9px] font-bold ml-0.5">{likeCount}</span>
            )}
          </button>
        )}

        {/* 2. Download Video Button (Right to the side of Like, no 30s badge) */}
        {onDownloadVideo && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              triggerHaptic('medium');
              onDownloadVideo();
            }}
            className={`${baseBtnClass} hover:text-amber-400`}
            title="वीडियो डाउनलोड करें (Download Video)"
            aria-label="Download Video"
          >
            <Download className="w-3.5 h-3.5 hover:scale-110 transition-transform text-amber-400" />
          </button>
        )}

        {/* 3. Bookmark / Save Button (Independent & Transparent) */}
        {onToggleBookmark && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              triggerHaptic('medium');
              onToggleBookmark();
            }}
            className={`${baseBtnClass} ${
              isBookmarked
                ? isLight
                  ? '!bg-amber-500/20 !text-amber-700 !border-amber-500/40 scale-105'
                  : '!bg-amber-500/25 !text-amber-300 !border-amber-500/45 scale-105'
                : 'hover:text-amber-400'
            }`}
            title={isBookmarked ? 'सहेजा गया' : 'सहेजें (Save)'}
            aria-label="Save"
          >
            <Bookmark
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                isBookmarked ? 'fill-amber-500 text-amber-500 scale-110' : ''
              }`}
            />
          </button>
        )}

        {/* 4. Share Card Button (Independent & Transparent) */}
        {onShare && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              triggerHaptic('light');
              onShare();
            }}
            className={`${baseBtnClass} hover:text-amber-400`}
            title="कार्ड साझा करें (Share)"
            aria-label="Share"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  }

  // Fallback vertical rail
  return (
    <div className={`absolute right-2 sm:right-3 bottom-20 sm:bottom-24 z-30 flex flex-col items-center gap-2 select-none pointer-events-auto ${className}`}>
      {onToggleLike && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            triggerHaptic(isLiked ? 'light' : 'success');
            onToggleLike();
          }}
          className={`${baseBtnClass} ${
            isLiked 
              ? isLight ? '!bg-rose-500/15 !text-rose-600 !border-rose-500/30' : '!bg-rose-500/20 !text-rose-400 !border-rose-500/40' 
              : ''
          }`}
          aria-label="Like"
        >
          <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>
      )}
      {onDownloadVideo && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            triggerHaptic('medium');
            onDownloadVideo();
          }}
          className={`${baseBtnClass} hover:text-amber-400 relative`}
          title="30s वीडियो डाउनलोड करें"
          aria-label="Download 30s Video"
        >
          <Download className="w-3.5 h-3.5 text-amber-400" />
        </button>
      )}
      {onToggleBookmark && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            triggerHaptic('medium');
            onToggleBookmark();
          }}
          className={`${baseBtnClass} ${
            isBookmarked 
              ? isLight ? '!bg-amber-500/20 !text-amber-700 !border-amber-500/40' : '!bg-amber-500/25 !text-amber-300 !border-amber-500/45' 
              : ''
          }`}
          aria-label="Save"
        >
          <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
        </button>
      )}
      {onShare && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            triggerHaptic('light');
            onShare();
          }}
          className={baseBtnClass}
          aria-label="Share"
        >
          <Share2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
