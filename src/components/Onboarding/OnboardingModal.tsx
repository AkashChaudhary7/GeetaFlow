import React, { useState } from 'react';
import { AppLogo } from '../Common/AppLogo';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  BookOpen, 
  Compass, 
  HeartHandshake, 
  ArrowUp, 
  Layers, 
  Flame, 
  Check,
  Volume2
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  onOpenAskGita?: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  onOpenAskGita
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const totalSteps = 4;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col w-full h-full bg-neutral-950 text-neutral-100 overflow-hidden animate-fadeIn">
      {/* Top Bar with Progress Indicators & Skip Button */}
      <div className="w-full p-4 sm:p-5 flex items-center justify-between border-b border-neutral-800 bg-neutral-900/90 backdrop-blur-md shrink-0">
        <div className="flex items-center space-x-3">
          <AppLogo size="xs" />
          <div className="flex items-center space-x-1.5">
            {Array.from({ length: totalSteps }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentStep 
                    ? 'w-7 bg-amber-400' 
                    : idx < currentStep 
                      ? 'w-3 bg-amber-600/70' 
                      : 'w-2 bg-neutral-700'
                }`}
                aria-label={`Go to step ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        <button
          onClick={handleSkip}
          className="text-xs font-hindi font-medium text-neutral-400 hover:text-amber-300 py-1 px-2.5 rounded-lg hover:bg-neutral-800/80 transition-colors flex items-center space-x-1"
        >
          <span>छोड़ें (Skip)</span>
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

        {/* Dynamic Step Content - Full Size & Immersive */}
        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col justify-between p-6 sm:p-8 max-w-lg w-full mx-auto">
          
          {/* STEP 0: Swipe to Discover */}
          {currentStep === 0 && (
            <div className="flex-1 flex flex-col justify-center items-center space-y-6 animate-fadeIn my-auto py-2">
              <div className="relative w-44 h-64 sm:w-52 sm:h-72 rounded-3xl bg-gradient-to-b from-neutral-900 to-neutral-950 border-2 border-amber-500/50 p-4 flex flex-col items-center justify-between shadow-2xl shadow-amber-500/20">
                <div className="w-full flex justify-between items-center text-[11px] text-amber-400 font-hindi border-b border-amber-500/20 pb-1.5">
                  <span className="font-bold">अध्याय २ • श्लोक ४७</span>
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                </div>
                <div className="text-center my-auto py-2 space-y-2">
                  <p className="font-sanskrit text-amber-100 text-sm sm:text-base font-bold leading-relaxed">
                    कर्मण्येवाधिकारस्ते<br />मा फलेषु कदाचन...
                  </p>
                  <p className="font-hindi text-xs text-neutral-300">
                    तुम्हारा अधिकार केवल कर्म पर है, फल पर कभी नहीं।
                  </p>
                </div>
                <div className="w-full flex flex-col items-center animate-bounce pt-1">
                  <ArrowUp className="w-5 h-5 text-amber-400" />
                  <span className="text-[9px] text-amber-300 uppercase tracking-widest font-mono font-bold">ऊपर स्वाइप करें</span>
                </div>
              </div>

              <div className="text-center space-y-2.5 max-w-sm">
                <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-amber-400 bg-amber-950/60 border border-amber-500/40 px-3.5 py-1 rounded-full font-hindi shadow-xs">
                  <span>सरल • आधुनिक • एकाग्र</span>
                </div>
                <h3 className="font-hindi font-bold text-2xl sm:text-3xl text-neutral-100 leading-snug">
                  एक समय में एक श्लोक, बिना किसी तनाव
                </h3>
                <p className="font-hindi text-sm text-neutral-300 leading-relaxed">
                  आधुनिक रील्स और शॉर्ट्स के सहज रूप में श्रीमद्भगवद्गीता के ७०० श्लोक। ऊपर या नीचे स्वाइप कर शांतिपूर्वक नए श्लोक व जीवन सूत्र खोजें।
                </p>
              </div>

              <div className="w-full p-3.5 rounded-2xl bg-neutral-900/80 border border-neutral-800 text-xs text-neutral-300 flex items-center justify-center space-x-2.5 font-hindi text-center shadow-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0"></span>
                <span>मोबाइल पर स्वाइप, और डेस्कटॉप पर स्क्रॉल व कीबोर्ड एरो कीज़ (↑ / ↓) समर्थित हैं।</span>
              </div>
            </div>
          )}

          {/* STEP 1: Content Card Types */}
          {currentStep === 1 && (
            <div className="flex-1 flex flex-col justify-center space-y-5 animate-fadeIn my-auto py-2">
              <div className="text-center space-y-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest font-mono bg-amber-950/40 border border-amber-500/30 px-3 py-0.5 rounded-full">
                  सामग्री के ३ मुख्य रूप
                </span>
                <h3 className="font-hindi font-bold text-2xl sm:text-3xl text-neutral-100">
                  हर परिस्थिति के लिए प्रासंगिक ज्ञान
                </h3>
                <p className="font-hindi text-sm text-neutral-300 max-w-sm mx-auto">
                  GeetaFlow में केवल श्लोक ही नहीं, दैनिक जीवन के व्यावहारिक संदर्भ भी शामिल हैं:
                </p>
              </div>

              <div className="space-y-3">
                {/* 1. Shloka Card */}
                <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 flex items-start space-x-3.5 shadow-sm">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 shadow-inner">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-hindi font-bold text-sm sm:text-base text-amber-200">
                      १. मूल श्लोक कार्ड (Shloka Cards)
                    </h4>
                    <p className="font-hindi text-xs sm:text-sm text-neutral-300 leading-relaxed">
                      प्रामाणिक संस्कृत श्लोक, सरल हिंदी अर्थ, भावार्थ और तुरंत आजमाने योग्य <span className="text-amber-300 font-semibold">"आज की सीख"</span>।
                    </p>
                  </div>
                </div>

                {/* 2. Life Situation Card */}
                <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 flex items-start space-x-3.5 shadow-sm">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 shadow-inner">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-hindi font-bold text-sm sm:text-base text-emerald-200">
                      २. जीवन प्रसंग (Life Situations)
                    </h4>
                    <p className="font-hindi text-xs sm:text-sm text-neutral-300 leading-relaxed">
                      नौकरी की चिंता, क्रोध नियंत्रण, असफलता, संशय और रिश्तों के द्वंद्व पर गीता का स्पष्ट समाधान।
                    </p>
                  </div>
                </div>

                {/* 3. Topic Focus Card */}
                <div className="p-4 rounded-2xl bg-sky-950/30 border border-sky-500/40 flex items-start space-x-3.5 shadow-sm">
                  <div className="w-10 h-10 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 mt-0.5 shadow-inner">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-hindi font-bold text-sm sm:text-base text-sky-200">
                      ३. विषय विस्तार (Topic Focus)
                    </h4>
                    <p className="font-hindi text-xs sm:text-sm text-neutral-300 leading-relaxed">
                      कर्मयोग, ध्यान, मन-नियंत्रण, भक्ति और समत्व भाव पर समग्र ज्ञान का सार।
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Ask Gita AI Feature */}
          {currentStep === 2 && (
            <div className="flex-1 flex flex-col justify-center space-y-5 animate-fadeIn my-auto py-2">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-amber-400 bg-amber-950/60 border border-amber-500/40 px-3.5 py-1 rounded-full font-hindi shadow-xs">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Ask Gita • प्रामाणिक AI मार्गदर्शक</span>
                </div>
                <h3 className="font-hindi font-bold text-2xl sm:text-3xl text-neutral-100">
                  अपने जीवन के प्रश्न पूछें
                </h3>
                <p className="font-hindi text-sm text-neutral-300 max-w-sm mx-auto">
                  मनमाने उत्तर नहीं—हमेशा सबसे पहले श्रीमद्भगवद्गीता के प्रामाणिक श्लोक सामने आते हैं।
                </p>
              </div>

              {/* Mockup Preview */}
              <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-3 shadow-lg">
                <div className="text-xs sm:text-sm font-hindi text-neutral-300 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold text-xs">प्रश्न</span>
                  <span className="italic">"नौकरी में तनाव है और असफलता का डर सताता है"</span>
                </div>

                <div className="p-3 sm:p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs sm:text-sm font-hindi text-amber-100">
                  <span className="text-xs text-amber-400 font-bold block mb-1">
                    १. प्रामाणिक श्लोक (प्राथमिकता):
                  </span>
                  "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन..." (अध्याय २, श्लोक ४७)
                </div>

                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs sm:text-sm font-hindi text-neutral-300">
                  <span className="text-emerald-400 font-semibold">२. गीता की शिक्षाओं के आधार पर: </span>
                  हमारा अधिकार केवल आज के सच्चे प्रयास पर है, भविष्य के भय पर नहीं। जब फल की चिंता छूटती है, तो मन एकाग्र हो जाता है।
                </div>
              </div>

              <div className="flex justify-center pt-1">
                {onOpenAskGita && (
                  <button
                    onClick={() => {
                      onComplete();
                      onOpenAskGita();
                    }}
                    className="text-sm font-hindi text-amber-300 hover:text-amber-200 underline flex items-center space-x-1.5 font-semibold transition-colors"
                  >
                    <span>अभी प्रश्न पूछकर देखें</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: Your Sacred Journey */}
          {currentStep === 3 && (
            <div className="flex-1 flex flex-col justify-center space-y-5 animate-fadeIn my-auto py-2">
              <div className="text-center space-y-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest font-mono bg-amber-950/40 border border-amber-500/30 px-3 py-0.5 rounded-full">
                  दैनिक साधना व अभ्यास
                </span>
                <h3 className="font-hindi font-bold text-2xl sm:text-3xl text-neutral-100">
                  आंतरिक शांति की आपकी निजी यात्रा
                </h3>
                <p className="font-hindi text-sm text-neutral-300 max-w-sm mx-auto">
                  GeetaFlow को अपनी दिनचर्या का एक शांत, ध्यानपूर्ण अंग बनाएं।
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-1.5 shadow-sm">
                  <Flame className="w-6 h-6 text-amber-500" />
                  <div className="font-hindi font-bold text-sm text-neutral-100">दैनिक स्ट्रीक</div>
                  <div className="font-hindi text-xs text-neutral-400 leading-relaxed">
                    प्रतिदिन १-२ श्लोक पढ़कर अपनी निरंतरता बनाए रखें।
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-1.5 shadow-sm">
                  <Volume2 className="w-6 h-6 text-amber-400" />
                  <div className="font-hindi font-bold text-sm text-neutral-100">तानपुरा ध्वनि</div>
                  <div className="font-hindi text-xs text-neutral-400 leading-relaxed">
                    वैदिक तानपुरा की शांत धुन में संस्कृत उच्चारण सुनें।
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-1.5 shadow-sm">
                  <Layers className="w-6 h-6 text-emerald-400" />
                  <div className="font-hindi font-bold text-sm text-neutral-100">७०० श्लोक लक्ष्य</div>
                  <div className="font-hindi text-xs text-neutral-400 leading-relaxed">
                    १८ अध्यायों में अपनी प्रगति को ट्रैक करें।
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-1.5 shadow-sm">
                  <Sparkles className="w-6 h-6 text-sky-400" />
                  <div className="font-hindi font-bold text-sm text-neutral-100">कार्ड शेयरिंग</div>
                  <div className="font-hindi text-xs text-neutral-400 leading-relaxed">
                    व्हाट्सएप व मित्रों के साथ सुंदर श्लोक कार्ड साझा करें।
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-center font-hindi text-sm text-amber-300 font-semibold shadow-xs">
                “सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज”
              </div>
            </div>
          )}

        </div>

        {/* Footer Navigation Controls */}
        <div className="p-4 sm:p-5 border-t border-neutral-800 bg-neutral-950/80 flex items-center justify-between">
          <div>
            {currentStep > 0 ? (
              <button
                onClick={handlePrev}
                className="px-3 py-2 rounded-xl text-xs font-hindi text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors flex items-center space-x-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>पिछला</span>
              </button>
            ) : (
              <button
                onClick={handleSkip}
                className="text-xs font-hindi text-neutral-500 hover:text-neutral-300 px-2 py-1"
              >
                छोड़ें
              </button>
            )}
          </div>

          <button
            onClick={handleNext}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-hindi font-bold text-xs sm:text-sm shadow-md shadow-amber-500/20 flex items-center space-x-1.5 transition-all transform active:scale-95"
          >
            <span>{currentStep === totalSteps - 1 ? 'आरंभ करें (Begin)' : 'आगे बढ़ें (Next)'}</span>
            {currentStep === totalSteps - 1 ? (
              <Check className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
  );
};
