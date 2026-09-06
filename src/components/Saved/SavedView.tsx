import React, { useState } from 'react';
import { SHLOKAS_DATA } from '../../data/gitaData';
import { Shloka, UserPreferences } from '../../types';
import { Bookmark, Heart, Search, Trash2, Share2, ArrowRight } from 'lucide-react';

interface SavedViewProps {
  preferences: UserPreferences;
  onRemoveBookmark: (id: string) => void;
  onRemoveLike: (id: string) => void;
  onSelectShloka: (shloka: Shloka) => void;
  onOpenShare: (shloka: Shloka) => void;
  isLight?: boolean;
}

export const SavedView: React.FC<SavedViewProps> = ({
  preferences,
  onRemoveBookmark,
  onRemoveLike,
  onSelectShloka,
  onOpenShare,
  isLight = false
}) => {
  const [filterType, setFilterType] = useState<'bookmarks' | 'likes'>('bookmarks');
  const [searchQuery, setSearchQuery] = useState('');

  const targetIds = (filterType === 'bookmarks' ? preferences.bookmarkedIds : preferences.likedIds) || [];
  const savedShlokas = SHLOKAS_DATA.filter(s => targetIds.includes(s.id));

  const filteredItems = savedShlokas.filter(s => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      (s.sanskrit || '').toLowerCase().includes(q) ||
      (s.simpleHindi || '').toLowerCase().includes(q) ||
      (s.topics || []).some(t => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className={`w-full h-full max-w-lg mx-auto flex flex-col overflow-y-auto no-scrollbar pb-28 p-4 sm:p-6 select-none transition-colors ${
      isLight ? 'bg-white text-amber-950' : 'bg-neutral-950 text-neutral-100'
    }`}>
      {/* Header */}
      <div className="pt-2 pb-4">
        <h2 className={`text-2xl font-bold font-hindi ${isLight ? 'text-amber-600' : 'text-amber-200'}`}>
          Saved Library • सहेजे गए श्लोक
        </h2>
        <p className={`text-xs font-hindi mt-0.5 ${isLight ? 'text-amber-800/80 font-medium' : 'text-neutral-400'}`}>
          आपके पसंदीदा और बुकमार्क किए गए गीता श्लोक
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setFilterType('bookmarks')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold font-hindi flex items-center justify-center space-x-1.5 transition-all ${
            filterType === 'bookmarks'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 shadow-md'
              : isLight
                ? 'bg-amber-100/70 text-amber-900 border border-amber-300'
                : 'bg-neutral-900 text-neutral-400 border border-neutral-800'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>बुकमार्क ({preferences.bookmarkedIds.length})</span>
        </button>

        <button
          onClick={() => setFilterType('likes')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold font-hindi flex items-center justify-center space-x-1.5 transition-all ${
            filterType === 'likes'
              ? 'bg-rose-500 text-white shadow-md'
              : isLight
                ? 'bg-amber-100/70 text-amber-900 border border-amber-300'
                : 'bg-neutral-900 text-neutral-400 border border-neutral-800'
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          <span>पसंदीदा ({preferences.likedIds.length})</span>
        </button>
      </div>

      {/* Search Bar */}
      {savedShlokas.length > 0 && (
        <div className="relative mb-4">
          <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${
            isLight ? 'text-amber-700' : 'text-neutral-400'
          }`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="सहेजे गए श्लोकों में खोजें..."
            className={`w-full pl-9 pr-3 py-2.5 rounded-xl text-xs font-hindi focus:outline-hidden border ${
              isLight 
                ? 'bg-amber-50/70 border-amber-300 text-amber-950 placeholder-amber-700/50' 
                : 'bg-neutral-900 border-neutral-800 text-neutral-100 placeholder-neutral-500'
            }`}
          />
        </div>
      )}

      {/* Empty State */}
      {savedShlokas.length === 0 ? (
        <div className="my-auto py-16 flex flex-col items-center justify-center text-center space-y-3">
          <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center ${
            isLight ? 'bg-amber-50 border-amber-300 text-amber-700' : 'bg-neutral-900 border-neutral-800 text-neutral-500'
          }`}>
            {filterType === 'bookmarks' ? <Bookmark className="w-6 h-6" /> : <Heart className="w-6 h-6" />}
          </div>
          <p className={`text-sm font-hindi font-bold ${isLight ? 'text-amber-900' : 'text-neutral-300'}`}>
            अभी तक कोई श्लोक सहेजा नहीं गया है
          </p>
          <p className={`text-xs font-hindi max-w-xs leading-relaxed ${isLight ? 'text-amber-800/80' : 'text-neutral-500'}`}>
            फ़ीड में पढ़ते समय नीचे दिए गए बुकमार्क या दिल आइकन पर टैप करके श्लोक सहेजें।
          </p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className={`py-12 text-center text-xs font-hindi ${isLight ? 'text-amber-800' : 'text-neutral-400'}`}>
          खोज के अनुसार कोई श्लोक नहीं मिला
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map(s => (
            <div
              key={s.id}
              className={`p-4 rounded-2xl border space-y-3 shadow-xs ${
                isLight
                  ? 'bg-white border-amber-300 text-amber-950 shadow-amber-500/5'
                  : 'bg-neutral-900/90 border-neutral-800 text-neutral-100'
              }`}
            >
              <div className={`flex items-center justify-between text-xs font-hindi font-bold ${
                isLight ? 'text-amber-700' : 'text-amber-400'
              }`}>
                <span>अध्याय {s.chapter} • श्लोक {s.verse}</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onOpenShare(s)}
                    className={`p-1 transition-colors ${
                      isLight ? 'text-amber-700 hover:text-amber-900' : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                    title="शेयर करें"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => filterType === 'bookmarks' ? onRemoveBookmark(s.id) : onRemoveLike(s.id)}
                    className={`p-1 transition-colors ${
                      isLight ? 'text-amber-700 hover:text-rose-600' : 'text-neutral-400 hover:text-rose-400'
                    }`}
                    title="हटाएं"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className={`font-sanskrit text-sm font-semibold whitespace-pre-line leading-relaxed ${
                isLight ? 'text-amber-900' : 'text-amber-100'
              }`}>
                {s.sanskrit}
              </p>

              <p className={`font-hindi text-xs leading-normal ${
                isLight ? 'text-amber-950/80 font-medium' : 'text-neutral-300'
              }`}>
                {s.simpleHindi}
              </p>

              <button
                onClick={() => onSelectShloka(s)}
                className={`w-full py-2 px-3 rounded-xl text-xs font-hindi font-bold flex items-center justify-center space-x-1.5 transition-colors ${
                  isLight
                    ? 'bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300'
                    : 'bg-neutral-800 hover:bg-neutral-700 text-amber-300'
                }`}
              >
                <span>फ़ीड में यह श्लोक पढ़ें</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
