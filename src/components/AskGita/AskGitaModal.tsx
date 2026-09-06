import React, { useState } from 'react';
import { X, Sparkles, Send, BookOpen, CheckCircle, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import { AskGitaResponse } from '../../types';

interface AskGitaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToShloka?: (shlokaId: string) => void;
}

const SAMPLE_QUESTIONS = [
  "मुझे नौकरी नहीं मिल रही, क्या करूं?",
  "मैं बहुत गुस्सा करता हूं, कैसे रोकूं?",
  "असफलता से कैसे निपटूं?",
  "मन को एकाग्र कैसे करूं?",
  "भविष्य की चिंता बहुत सताती है"
];

export const AskGitaModal: React.FC<AskGitaModalProps> = ({
  isOpen,
  onClose,
  onJumpToShloka
}) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AskGitaResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (questionText: string) => {
    const q = questionText.trim();
    if (!q) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/ask-gita', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q }),
      });

      if (!response.ok) {
        throw new Error('उत्तर प्राप्त करने में समस्या हुई। कृपया पुनः प्रयास करें।');
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err?.message || 'नेटवर्क त्रुटि। कृपया पुनः प्रयास करें।');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col w-full h-full bg-neutral-950 text-neutral-100 overflow-hidden animate-fadeIn">
      {/* Top App Bar with Back Navigation */}
      <div className="w-full px-4 py-3 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/90 backdrop-blur-md shrink-0">
        <div className="flex items-center space-x-3">
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors flex items-center gap-1.5"
            aria-label="वापस जाएं"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-xs font-hindi hidden sm:inline">वापस</span>
          </button>
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
              <Sparkles className="w-4 h-4 text-neutral-950" />
            </div>
            <div>
              <h2 className="font-hindi font-bold text-base text-amber-200 leading-tight">
                Ask Gita • गीता से मार्गदर्शन
              </h2>
              <p className="text-[10px] text-neutral-400 font-hindi">
                जीवन के प्रश्नों पर भगवद्गीता का प्रामाणिक दृष्टिकोण
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Page Body / Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 w-full max-w-2xl mx-auto space-y-4 no-scrollbar">
          
          {/* Quick Suggestions */}
          {!result && !isLoading && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-amber-400/90 font-hindi block">
                अक्सर पूछे जाने वाले प्रश्न:
              </span>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_QUESTIONS.map((sq, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuery(sq);
                      handleSubmit(sq);
                    }}
                    className="text-xs py-1.5 px-3 rounded-full bg-neutral-800/80 hover:bg-amber-950/40 text-neutral-300 hover:text-amber-200 border border-neutral-700/60 transition-all text-left font-hindi"
                  >
                    {sq}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="py-12 flex flex-col items-center justify-center space-y-3 text-center">
              <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
              <p className="text-sm text-amber-200 font-hindi">
                भगवद्गीता के प्रामाणिक श्लोकों का अनुशीलन हो रहा है...
              </p>
              <p className="text-xs text-neutral-400 italic">
                “सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज...”
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-xs text-rose-300 font-hindi">
              {error}
            </div>
          )}

          {/* Results Area */}
          {result && (
            <div className="space-y-4 animate-fadeIn">
              
              {/* Question Echo */}
              <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800 text-xs font-hindi">
                <span className="text-neutral-400 block mb-0.5">आपका प्रश्न:</span>
                <span className="text-amber-200 font-medium text-sm">"{result.query}"</span>
              </div>

              {/* 1. Authentic Verses (Prioritized and Displayed First) */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-semibold text-amber-400 font-hindi">
                  <div className="flex items-center space-x-1.5">
                    <BookOpen className="w-4 h-4 text-amber-400" />
                    <span>१. प्रामाणिक श्लोक (Authentic Gita Verses):</span>
                  </div>
                  <span className="text-[10px] text-amber-500/80 uppercase tracking-wider font-mono">
                    मूल संदर्भ
                  </span>
                </div>

                {result.relevantVerses.map((v, i) => (
                  <div 
                    key={i} 
                    className="p-3.5 rounded-2xl bg-amber-950/25 border border-amber-500/35 space-y-2 shadow-inner"
                  >
                    <div className="flex items-center justify-between text-xs text-amber-400 font-semibold font-hindi">
                      <span className="flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                        <span>अध्याय {v.chapter} • श्लोक {v.verse}</span>
                      </span>
                      {onJumpToShloka && (
                        <button
                          onClick={() => {
                            onClose();
                            onJumpToShloka(`bg_${v.chapter}_${v.verse}`);
                          }}
                          className="text-[11px] text-amber-300 hover:text-amber-100 hover:underline flex items-center transition-colors"
                        >
                          फ़ीड में देखें <ArrowRight className="w-3 h-3 ml-0.5" />
                        </button>
                      )}
                    </div>
                    <p className="font-sanskrit text-amber-100 text-sm sm:text-base font-medium whitespace-pre-line leading-relaxed tracking-wide">
                      {v.sanskrit}
                    </p>
                    <p className="font-hindi text-xs sm:text-sm text-neutral-300 leading-normal border-t border-amber-500/15 pt-2">
                      <span className="text-amber-400 font-medium">सरल अर्थ: </span>
                      {v.simpleHindi}
                    </p>
                  </div>
                ))}
              </div>

              {/* 2. Clearly labeled Gita Perspective */}
              <div className="p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800 space-y-2">
                <span className="text-xs font-semibold text-amber-300 font-hindi flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>२. भगवद्गीता की शिक्षाओं के आधार पर (Teachings of the Gita):</span>
                </span>
                <p className="text-xs sm:text-sm text-neutral-200 font-hindi leading-relaxed">
                  {result.gitaPerspective}
                </p>
              </div>

              {/* 3. Practical Reflection / Aaj ke Jeevan me prayog */}
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                <div className="flex items-center space-x-1.5 text-xs font-semibold text-emerald-400 font-hindi">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>३. आधुनिक जीवन में प्रयोग (Practical Daily Steps):</span>
                </div>
                <div className="text-xs sm:text-sm text-neutral-200 font-hindi leading-relaxed whitespace-pre-line">
                  {result.practicalReflection}
                </div>
              </div>

              {/* Ask another button */}
              <button
                onClick={() => {
                  setResult(null);
                  setQuery('');
                }}
                className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-hindi text-neutral-300 transition-colors"
              >
                नया प्रश्न पूछें
              </button>
            </div>
          )}

        </div>

      {/* Input Footer */}
      <div className="p-3 sm:p-4 border-t border-neutral-800 bg-neutral-900/90 shrink-0">
        <div className="max-w-2xl mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(query);
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="उदा. नौकरी की चिंता, गुस्सा, असफलता..."
              className="flex-1 bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-hidden focus:border-amber-500 font-hindi"
            />
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-neutral-950 font-bold transition-all flex items-center space-x-1.5"
            >
              <Send className="w-4 h-4" />
              <span className="text-xs font-hindi hidden sm:inline">पूछें</span>
            </button>
          </form>
        </div>
      </div>

    </div>
  );
};
