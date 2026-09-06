import React from 'react';
import { Home, Compass, BookOpen, Bookmark, User } from 'lucide-react';

export type NavTab = 'feed' | 'explore' | 'all_verses' | 'saved' | 'journey';

interface BottomNavProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
  savedCount: number;
  isLight?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  savedCount,
  isLight = false
}) => {
  const tabs = [
    { id: 'feed' as NavTab, label: 'फ़ीड', icon: Home },
    { id: 'explore' as NavTab, label: 'अन्वेषण', icon: Compass },
    { id: 'all_verses' as NavTab, label: '७०० श्लोक', icon: BookOpen },
    { id: 'saved' as NavTab, label: 'सहेजे गए', icon: Bookmark, badge: savedCount > 0 ? savedCount : null },
    { id: 'journey' as NavTab, label: 'मेरी यात्रा', icon: User },
  ];

  return (
    <nav 
      aria-label="Bottom Navigation" 
      className={`fixed bottom-0 inset-x-0 z-40 max-w-md mx-auto backdrop-blur-xl border-t shadow-2xl transition-colors pb-[env(safe-area-inset-bottom,0px)] ${
        isLight
          ? 'bg-[#fdfbf7]/95 border-amber-900/15 text-neutral-800'
          : 'bg-neutral-950/95 border-neutral-800/80 text-neutral-100'
      }`}
    >
      <div className="flex items-center justify-around px-1.5 py-1.5 sm:py-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => onChangeTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition-all relative min-h-[46px] ${
                isActive 
                  ? isLight ? 'text-amber-800 font-bold' : 'text-amber-400 font-bold' 
                  : isLight ? 'text-neutral-500 hover:text-neutral-900' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {/* Active Indicator bar */}
              {isActive && (
                <span className={`absolute -top-1.5 w-6 h-0.5 rounded-full ${
                  isLight ? 'bg-amber-700 shadow-[0_0_8px_#b45309]' : 'bg-amber-400 shadow-[0_0_8px_#f59e0b]'
                }`} />
              )}

              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                {tab.badge && (
                  <span className="absolute -top-1 -right-2.5 w-4 h-4 rounded-full bg-amber-500 text-neutral-950 text-[9px] font-bold flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </div>

              <span className="text-[10px] font-hindi mt-1 tracking-tight">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
