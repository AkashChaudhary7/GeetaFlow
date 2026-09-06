import React, { useEffect, useState } from 'react';
import { admobService } from '../../services/admob';
import { Sparkles, Crown } from 'lucide-react';

interface AdMobBannerViewProps {
  isPremium?: boolean;
  onOpenPremium?: () => void;
  className?: string;
}

export const AdMobBannerView: React.FC<AdMobBannerViewProps> = ({
  isPremium = false,
  onOpenPremium,
  className = '',
}) => {
  const [isNative, setIsNative] = useState(false);
  const [config, setConfig] = useState(() => admobService.getConfig());

  useEffect(() => {
    setIsNative(admobService.isNative());
    if (!isPremium) {
      // In native Android, Capacitor manages the native Google AdView overlay
      admobService.showBanner(56).catch(() => {});
    } else {
      admobService.hideBanner().catch(() => {});
    }

    return () => {
      // Cleanup if unmounting
    };
  }, [isPremium]);

  if (isPremium) {
    return null;
  }

  // If on native Android, the Capacitor plugin overlays the native AdMob AdView directly on the screen
  if (isNative) {
    return null;
  }

  // On Web / AI Studio Preview: Render a clean, compliant simulated AdMob banner placeholder
  return (
    <div 
      id="admob-adaptive-banner-container"
      className={`w-full max-w-md mx-auto px-3 py-1.5 ${className}`}
    >
      <div className="w-full h-12 bg-neutral-900/90 border border-neutral-800 rounded-xl px-3 flex items-center justify-between shadow-sm overflow-hidden text-xs">
        <div className="flex items-center space-x-2 truncate">
          <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono text-[9px] font-bold uppercase tracking-wider shrink-0">
            {config.isTesting ? 'AdMob Test' : 'Ad'}
          </span>
          <div className="flex items-center space-x-1.5 text-neutral-300 truncate font-sans">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate text-[11px]">
              {config.isTesting 
                ? 'Google AdMob Banner Active • Ready for AAB' 
                : 'गीता ज्ञान प्रचार • प्रायोजक'}
            </span>
          </div>
        </div>

        {onOpenPremium && (
          <button
            onClick={onOpenPremium}
            title="विज्ञापन मुक्त अनुभव"
            className="flex items-center space-x-1 px-2 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-[10px] font-medium transition-colors shrink-0 ml-2"
          >
            <Crown className="w-3 h-3 text-amber-400" />
            <span className="hidden sm:inline">Ad-Free</span>
          </button>
        )}
      </div>
    </div>
  );
};
