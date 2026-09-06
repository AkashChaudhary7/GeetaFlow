import React, { useState } from 'react';
import { X, Crown, Check, Sparkles, ShieldCheck, ArrowLeft } from 'lucide-react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPremium: boolean;
  onUpgrade: () => void;
  onRestore: () => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({
  isOpen,
  onClose,
  isPremium,
  onUpgrade,
  onRestore
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('annual');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubscribe = () => {
    onUpgrade();
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col w-full h-full bg-neutral-950 text-neutral-100 overflow-hidden animate-fadeIn">
      {/* Top App Bar with Back Navigation */}
      <div className="w-full px-4 py-3.5 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/90 backdrop-blur-md shrink-0">
        <div className="flex items-center space-x-3">
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors flex items-center gap-1.5"
            aria-label="वापस जाएं"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-xs font-hindi hidden sm:inline">वापस</span>
          </button>
          <div className="flex items-center space-x-2 text-amber-400">
            <Crown className="w-5 h-5 text-amber-400" />
            <span className="font-display font-bold tracking-wider text-sm sm:text-base">GEETAFLOW PREMIUM</span>
          </div>
        </div>
        <button onClick={onClose} className="p-2 rounded-full text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Page Body */}
      <div className="flex-1 overflow-y-auto px-4 py-6 w-full max-w-lg mx-auto space-y-5 text-center no-scrollbar">
        
        <div className="space-y-1.5 pt-2">
          <h2 className="text-2xl font-bold font-hindi text-amber-200">
            “शांति से पढ़िए। बिना विज्ञापन।”
          </h2>
          <p className="text-sm text-neutral-400 font-hindi">
            पवित्र भगवद्गीता के स्वाध्याय में कोई भी रुकावट न आने दें।
          </p>
        </div>

        {/* Benefits Checklist */}
        <div className="p-5 rounded-3xl bg-neutral-900/80 border border-amber-500/20 space-y-3.5 text-left shadow-xl">
          {[
            "100% विज्ञापन-मुक्त स्वाध्याय अनुभव",
            "असीमित ‘Ask Gita’ AI मार्गदर्शन",
            "उच्च गुणवत्ता वाली भारतीय कलाकृतियां",
            "ऑफ़लाइन वैदिक तानपुरा एवं ऑडियो उच्चारण",
            "आगामी रामायण एवं महाभारत श्रृंखला का निःशुल्क प्रवेश"
          ].map((benefit, i) => (
            <div key={i} className="flex items-center space-x-3 text-sm text-neutral-200 font-hindi">
              <Check className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>

        {/* Plans Selection */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div
            onClick={() => setSelectedPlan('monthly')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all text-center space-y-1 ${
              selectedPlan === 'monthly'
                ? 'bg-amber-950/30 border-amber-500 shadow-md ring-1 ring-amber-500'
                : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'
            }`}
          >
            <span className="text-xs text-neutral-400 font-hindi block">मासिक प्लान</span>
            <span className="text-xl font-bold text-neutral-100">₹99</span>
            <span className="text-xs text-neutral-500 block">प्रति माह</span>
          </div>

          <div
            onClick={() => setSelectedPlan('annual')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all text-center space-y-1 relative ${
              selectedPlan === 'annual'
                ? 'bg-amber-950/30 border-amber-500 shadow-md ring-1 ring-amber-500'
                : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'
            }`}
          >
            <span className="absolute -top-2.5 right-2 px-2.5 py-0.5 rounded-full bg-amber-500 text-neutral-950 text-[10px] font-bold">
              60% बचत
            </span>
            <span className="text-xs text-neutral-400 font-hindi block">वार्षिक प्लान</span>
            <span className="text-xl font-bold text-amber-300">₹499</span>
            <span className="text-xs text-neutral-500 block">₹41 / माह</span>
          </div>
        </div>

        {/* Guarantee info */}
        <div className="flex items-center justify-center space-x-1.5 text-xs text-neutral-400 font-hindi">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>कभी भी रद्द करें • सुरक्षित भुगतान</span>
        </div>

        {isSuccess && (
          <div className="p-3.5 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-sm font-hindi">
            धन्यवाद! GeetaFlow Premium सफलतापूर्वक सक्रिय हो गया है।
          </div>
        )}

      </div>

      {/* Action Button Footer */}
      <div className="w-full p-4 border-t border-neutral-800 bg-neutral-900/90 shrink-0">
        <div className="max-w-lg mx-auto space-y-2">
          <button
            onClick={handleSubscribe}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-base font-hindi flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20 transition-all active:scale-98"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isPremium ? 'प्लान नवीनीकृत करें' : 'प्रीमियम शुरू करें'}</span>
          </button>

          <button
            onClick={onRestore}
            className="w-full text-center text-xs text-neutral-500 hover:text-neutral-300 font-hindi py-1"
          >
            खरीदारी पुनर्स्थापित करें (Restore Purchases)
          </button>
        </div>
      </div>
    </div>
  );
};
