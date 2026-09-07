import React, { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 flex items-center space-x-2 rounded-full bg-amber-600/90 text-neutral-950 font-hindi text-xs font-semibold px-4 py-1.5 shadow-xl backdrop-blur-md border border-amber-400/40 animate-pulse">
      <WifiOff className="w-3.5 h-3.5 stroke-[2.5]" />
      <span>ऑफ़लाइन मोड — कैश्ड श्लोक सक्रिय हैं (Offline Mode)</span>
    </div>
  );
};
