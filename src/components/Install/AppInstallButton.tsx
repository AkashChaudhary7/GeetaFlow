import React, { useState } from 'react';
import { useAppInstall } from '../../utils/useAppInstall';
import { Download, Smartphone, Share, PlusSquare, X } from 'lucide-react';

interface AppInstallButtonProps {
  variant?: 'compact' | 'card' | 'pill';
  className?: string;
}

export const AppInstallButton: React.FC<AppInstallButtonProps> = ({
  variant = 'card',
  className = ''
}) => {
  const { isInstallable, isInstalled, isIOS, install } = useAppInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);

  // If already running in standalone app mode, do not show install prompt
  if (isInstalled) {
    if (variant === 'card') {
      return (
        <div className={`p-4 rounded-2xl bg-emerald-950/20 border border-emerald-800/40 text-left flex items-center space-x-3 ${className}`}>
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-emerald-300 font-hindi">
              ऐप स्थापित है (App Installed)
            </h4>
            <p className="text-[11px] text-neutral-400 font-hindi">
              GeetaFlow आपकी होम स्क्रीन पर सक्रिय है।
            </p>
          </div>
        </div>
      );
    }
    return null;
  }

  const handleAction = () => {
    if (isInstallable) {
      install();
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      // Fallback instructions for other mobile browsers
      alert('ब्राउज़र मेनू (⋮) खोलें और "Add to Home screen" या "Install app" चुनें।');
    }
  };

  if (variant === 'pill') {
    return (
      <>
        <button
          onClick={handleAction}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 font-bold text-xs shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all ${className}`}
        >
          <Download className="w-3.5 h-3.5 stroke-[2.5]" />
          <span className="font-hindi">ऐप इंस्टॉल</span>
        </button>

        {showIOSModal && (
          <IOSInstallModal onClose={() => setShowIOSModal(false)} />
        )}
      </>
    );
  }

  if (variant === 'compact') {
    return (
      <>
        <button
          onClick={handleAction}
          className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-neutral-900 border border-amber-500/30 text-amber-300 hover:text-amber-200 text-xs font-hindi transition-colors ${className}`}
          title="होम स्क्रीन पर जोड़ें"
        >
          <Download className="w-3.5 h-3.5" />
          <span>ऐप जोड़ें</span>
        </button>

        {showIOSModal && (
          <IOSInstallModal onClose={() => setShowIOSModal(false)} />
        )}
      </>
    );
  }

  // Default 'card' variant
  return (
    <>
      <div className={`p-4 rounded-2xl bg-gradient-to-br from-amber-950/40 to-neutral-900 border border-amber-500/30 text-left space-y-2.5 shadow-md ${className}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src="/icon.svg" 
              alt="GeetaFlow Sacred Chariot" 
              className="w-11 h-11 rounded-xl shadow-md border border-amber-500/30 object-contain p-0.5 bg-neutral-950 shrink-0" 
              referrerPolicy="no-referrer"
            />
            <div>
              <h4 className="text-sm font-bold text-amber-200 font-hindi">
                GeetaFlow ऐप इंस्टॉल करें
              </h4>
              <p className="text-[11px] text-neutral-300 font-hindi">
                पूर्ण स्क्रीन, तीव्र गति और ऑफ़लाइन पठन के लिए
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleAction}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-xs font-hindi flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/25 active:scale-98 transition-all"
        >
          <Download className="w-4 h-4 stroke-[2.5]" />
          <span>होम स्क्रीन पर इंस्टॉल करें (Install App)</span>
        </button>
      </div>

      {showIOSModal && (
        <IOSInstallModal onClose={() => setShowIOSModal(false)} />
      )}
    </>
  );
};

const IOSInstallModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-sm rounded-3xl bg-neutral-900 border border-neutral-800 p-5 text-neutral-100 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <img 
              src="/icon.svg" 
              alt="GeetaFlow Icon" 
              className="w-6 h-6 rounded-lg object-contain" 
              referrerPolicy="no-referrer"
            />
            <h3 className="font-bold text-sm font-hindi text-amber-200">
              iPhone / iPad पर इंस्टॉल करें
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-neutral-400 hover:text-neutral-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs text-neutral-300 font-hindi leading-relaxed">
          <div className="flex items-start space-x-3 p-3 rounded-xl bg-neutral-950/60 border border-neutral-800">
            <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <Share className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-neutral-100">चरण १</p>
              <p className="text-[11px] text-neutral-400">
                Safari ब्राउज़र के निचले बार में <strong>Share</strong> (शेयर) बटन दबाएं।
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 rounded-xl bg-neutral-950/60 border border-neutral-800">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <PlusSquare className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-neutral-100">चरण २</p>
              <p className="text-[11px] text-neutral-400">
                नीचे स्क्रॉल करके <strong>"Add to Home Screen"</strong> (होम स्क्रीन में जोड़ें) पर टैप करें।
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-neutral-800 text-neutral-200 hover:bg-neutral-700 font-semibold text-xs font-hindi transition-colors"
        >
          समझ गया (Done)
        </button>
      </div>
    </div>
  );
};
