import React, { useState, useEffect } from 'react';

interface SwipeTutorialOverlayProps {
  isLight?: boolean;
  hasSeenTutorial?: boolean;
  onDismiss?: () => void;
}

const TUTORIAL_STORAGE_KEY = 'geetaflow_swipe_tutorial_seen';

export const SwipeTutorialOverlay: React.FC<SwipeTutorialOverlayProps> = ({
  isLight = false,
  hasSeenTutorial = false,
  onDismiss,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Check local storage and preference
    if (typeof window === 'undefined') return;
    const hasSeenInStorage = localStorage.getItem(TUTORIAL_STORAGE_KEY) === 'true';

    if (!hasSeenInStorage && !hasSeenTutorial) {
      // Delay slightly for smooth page entrance, then show for 3 seconds
      const enterTimer = window.setTimeout(() => {
        setIsVisible(true);
      }, 400);

      // Dismiss automatically after 3 seconds of display
      const exitTimer = window.setTimeout(() => {
        handleDismiss();
      }, 3400);

      return () => {
        clearTimeout(enterTimer);
        clearTimeout(exitTimer);
      };
    }
  }, [hasSeenTutorial]);

  const handleDismiss = () => {
    setIsExiting(true);
    try {
      localStorage.setItem(TUTORIAL_STORAGE_KEY, 'true');
    } catch {}

    const cleanupTimer = window.setTimeout(() => {
      setIsVisible(false);
      onDismiss?.();
    }, 450);

    return () => clearTimeout(cleanupTimer);
  };

  if (!isVisible) return null;

  return (
    <div
      id="swipe-tutorial-overlay"
      onClick={handleDismiss}
      className={`fixed bottom-20 inset-x-0 z-50 flex justify-center items-center px-4 pointer-events-auto cursor-pointer transition-all duration-500 ease-out select-none ${
        isExiting ? 'opacity-0 translate-y-3 scale-95' : 'opacity-100 translate-y-0 scale-100 animate-fadeIn'
      }`}
    >
      <div
        className={`relative overflow-hidden flex items-center space-x-3 px-4 py-2.5 rounded-2xl shadow-2xl backdrop-blur-xl border transition-colors max-w-sm w-auto ${
          isLight
            ? 'bg-neutral-900/90 text-amber-50 border-amber-500/40 shadow-amber-950/20'
            : 'bg-neutral-900/92 text-neutral-100 border-amber-500/45 shadow-black/60'
        }`}
      >
        {/* Animated Gesture Icon for Swipe-to-Scroll */}
        <div className="relative w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 shadow-inner">
          {/* Ripple wave */}
          <span className="absolute inset-0 rounded-xl bg-amber-400/20 animate-ping opacity-35" />
          
          {/* Animated Upward Swipe Gesture Icon */}
          <div className="flex flex-col items-center justify-center">
            <svg
              className="w-5 h-5 text-amber-400 animate-bounce transition-transform"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="18 15 12 9 6 15" />
            </svg>
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400/80 -mt-0.5" />
          </div>
        </div>

        {/* Tutorial Message */}
        <div className="text-left pr-2 leading-tight">
          <div className="text-xs font-bold font-hindi text-amber-300 flex items-center gap-1.5">
            <span>श्लोक बदलने हेतु ऊपर स्वाइप करें</span>
            <span className="text-[10px] text-amber-400/70 font-sans font-normal">• 3s</span>
          </div>
          <p className="text-[10px] text-neutral-300 font-sans tracking-tight mt-0.5 opacity-90">
            Swipe up to scroll through verses
          </p>
        </div>

        {/* 3-Second Countdown Progress Bar */}
        <div className="absolute bottom-0 inset-x-0 h-0.5 bg-neutral-800">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-[3000ms] ease-linear"
            style={{ width: isExiting ? '0%' : '100%' }}
          />
        </div>
      </div>
    </div>
  );
};
