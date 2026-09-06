import React from 'react';
import { AdCard as AdCardType } from '../../types';
import { ExternalLink, Crown, Sparkles } from 'lucide-react';

interface AdCardProps {
  ad: AdCardType;
  onOpenPremium: () => void;
}

export const AdCard: React.FC<AdCardProps> = ({ ad, onOpenPremium }) => {
  return (
    <div className="relative w-full h-full flex flex-col justify-between pt-16 pb-20 px-5 sm:px-7 max-w-md mx-auto text-neutral-100 select-none overflow-y-auto no-scrollbar">
      {/* Header with clear platform-mandated Sponsored Label below floating app bar */}
      <div className="flex items-center justify-between pt-1 pb-2 shrink-0 border-b border-neutral-800/80">
        <span className="px-2.5 py-0.5 rounded bg-neutral-800 text-neutral-400 text-[10px] uppercase font-bold tracking-wider">
          {ad.badge}
        </span>
        <button
          onClick={onOpenPremium}
          className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-hindi"
        >
          <Crown className="w-3.5 h-3.5" />
          <span>विज्ञापन हटाएं</span>
        </button>
      </div>

      {/* Main Sponsored Card Container */}
      <div className="my-auto py-4 flex flex-col items-center space-y-5 text-center">
        
        {/* Brand Icon / Placeholder Banner */}
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-600/20 to-neutral-800 border border-neutral-700 flex items-center justify-center shadow-md">
          <Sparkles className="w-10 h-10 text-amber-400/80" />
        </div>

        <div className="space-y-1.5 max-w-sm">
          <h3 className="text-xl font-bold text-neutral-100 font-hindi">
            {ad.brandName}
          </h3>
          <p className="text-sm text-neutral-300 font-hindi leading-relaxed">
            {ad.tagline}
          </p>
        </div>

        <div className="w-full bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4 text-left">
          <p className="text-xs text-neutral-400 font-hindi leading-relaxed">
            {ad.description}
          </p>
        </div>

        {/* CTA Button */}
        <a
          href={ad.ctaLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-100 font-semibold text-sm flex items-center justify-center space-x-2 border border-neutral-700 transition-all active:scale-98"
        >
          <span>{ad.ctaText}</span>
          <ExternalLink className="w-4 h-4 text-neutral-400" />
        </a>

        {/* Premium Value Prop */}
        <div 
          onClick={onOpenPremium}
          className="w-full p-3 rounded-xl bg-amber-950/20 border border-amber-500/20 hover:border-amber-500/40 cursor-pointer transition-all text-center"
        >
          <p className="text-xs text-amber-300 font-hindi font-medium flex items-center justify-center gap-1.5">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>GeetaFlow Premium — “शांति से पढ़िए। बिना विज्ञापन।”</span>
          </p>
        </div>

      </div>

      {/* Footer */}
      <div className="py-2 text-center text-xs text-neutral-500 font-hindi">
        स्वाइप करें • गीता श्लोक जारी रखें
      </div>
    </div>
  );
};
