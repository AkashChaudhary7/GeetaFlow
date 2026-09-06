import React from 'react';

interface AppLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  isLight?: boolean;
  className?: string;
  onClick?: () => void;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  size = 'md',
  showText = false,
  isLight = false,
  className = '',
  onClick
}) => {
  const getDimensions = () => {
    switch (size) {
      case 'xs': return { box: 'w-6 h-6', icon: 'w-3.5 h-3.5', text: 'text-xs' };
      case 'sm': return { box: 'w-7 h-7 sm:w-8 sm:h-8', icon: 'w-4 h-4', text: 'text-sm' };
      case 'md': return { box: 'w-10 h-10', icon: 'w-5 h-5', text: 'text-base' };
      case 'lg': return { box: 'w-14 h-14', icon: 'w-7 h-7', text: 'text-xl' };
      case 'xl': return { box: 'w-20 h-20', icon: 'w-10 h-10', text: 'text-2xl' };
      default: return { box: 'w-8 h-8', icon: 'w-4 h-4', text: 'text-sm' };
    }
  };

  const dims = getDimensions();

  return (
    <div 
      onClick={onClick}
      className={`inline-flex items-center space-x-2.5 ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Sacred Radiant Emblem */}
      <div className={`relative ${dims.box} rounded-2xl bg-gradient-to-br from-amber-400 via-amber-600 to-amber-800 p-0.5 shadow-md shadow-amber-500/25 flex items-center justify-center shrink-0 group transition-transform duration-300 ${onClick ? 'hover:scale-105 active:scale-95' : ''}`}>
        {/* Inner glow ring */}
        <div className="w-full h-full rounded-[14px] bg-gradient-to-br from-neutral-950 via-neutral-900 to-amber-950/80 flex items-center justify-center relative overflow-hidden border border-amber-400/30">
          
          {/* Subtle radiating aura lines */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.8)_0%,transparent_70%)]" />

          {/* Unified Sacred Vector Icon: Official Sacred Chariot (दिव्य रथ - Sri Krishna & Arjuna Kurukshetra Ratha) */}
          <svg 
            className={`${dims.icon} text-amber-400 drop-shadow-[0_2px_4px_rgba(245,158,11,0.5)]`}
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.6" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            {/* Chariot Base Carriage */}
            <path 
              d="M3.5 15.5h11l-1.6-4.5h-7.8l-1.6 4.5z" 
              fill="rgba(245, 158, 11, 0.35)" 
              stroke="currentColor" 
              strokeWidth="1.5" 
            />
            {/* Chariot Back Arc & Royal Canopy */}
            <path 
              d="M3.5 15.5c-1.2-2.5-0.8-5 1.2-7 1.8-1.5 4-1.5 5.2-0.8" 
              stroke="currentColor" 
              strokeWidth="1.4" 
            />
            {/* Divine Dhwaja (Chariot Flag with Kapidhwaja) */}
            <line x1="5.2" y1="8" x2="5.2" y2="2" stroke="#fbbf24" strokeWidth="1.5" />
            <path 
              d="M5.2 2.5c2.6 0.4 4.2 1.6 2.2 2.8-2 1-2.2 1.5-2.2 1.5" 
              fill="#f59e0b" 
              stroke="#fbbf24" 
              strokeWidth="1.1" 
            />
            <circle cx="5.2" cy="1.8" r="0.8" fill="#fde047" />

            {/* Sri Krishna (Charioteer) with Divine Feather Plume */}
            <circle cx="12" cy="9.2" r="1.3" fill="#38bdf8" stroke="#0284c7" strokeWidth="0.8" />
            <path d="M12.3 8c0.8-0.9 1.5-0.7 1.3 0-0.2 0.6-0.9 0.9-1.3 1" fill="#10b981" />
            
            {/* Arjuna seated in reverence */}
            <circle cx="8" cy="10.2" r="1.1" fill="#fbbf24" stroke="#d97706" strokeWidth="0.8" />
            <path d="M7 14c0.6-1.8 1.8-2.2 2.8-1.4" stroke="#fbbf24" strokeWidth="1.2" />

            {/* Sacred Spoked Chariot Wheel (Dharma Chakra) */}
            <circle cx="10" cy="17.8" r="3.4" stroke="#fbbf24" strokeWidth="1.6" fill="#1c1917" />
            <circle cx="10" cy="17.8" r="1" fill="#fde047" />
            <line x1="10" y1="14.4" x2="10" y2="21.2" stroke="#f59e0b" strokeWidth="1" />
            <line x1="6.6" y1="17.8" x2="13.4" y2="17.8" stroke="#f59e0b" strokeWidth="1" />
            <line x1="7.6" y1="15.4" x2="12.4" y2="20.2" stroke="#f59e0b" strokeWidth="0.8" />
            <line x1="7.6" y1="20.2" x2="12.4" y2="15.4" stroke="#f59e0b" strokeWidth="0.8" />

            {/* Reins & Front Harness */}
            <path d="M13 10.2c2.2 0.6 5 1.6 8 2.6" stroke="#fbbf24" strokeWidth="1.1" strokeDasharray="1.5 1" />
            <path d="M14.5 15.5h4.8" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>
      </div>

      {/* Optional Typography */}
      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center space-x-1.5">
            <span className={`font-display font-black tracking-wider leading-none ${dims.text} ${
              isLight ? 'text-amber-700' : 'text-amber-300'
            }`}>
              GEETAFLOW
            </span>
          </div>
          <span className={`text-[9px] font-hindi tracking-wide font-medium leading-tight mt-0.5 ${
            isLight ? 'text-amber-900/70' : 'text-neutral-400'
          }`}>
            श्रीमद्भगवद्गीता • One Scroll at a Time
          </span>
        </div>
      )}
    </div>
  );
};
