import React, { useState } from 'react';
import { CHAPTERS_META, SHLOKAS_DATA, TOPICS_DATA } from '../../data/gitaData';
import { Shloka } from '../../types';
import { Search, BookOpen, Layers, Sparkles, ArrowRight } from 'lucide-react';
import { ArtworkCanvas } from '../Common/ArtworkCanvas';
import { ThoughtOfTheDay } from '../Feed/ThoughtOfTheDay';

interface ExploreViewProps {
  onSelectShloka: (shloka: Shloka) => void;
  onSelectTopic: (topic: string) => void;
  onSelectChapter: (chapterNumber: number) => void;
  isLight?: boolean;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  onSelectShloka,
  onSelectTopic,
  onSelectChapter,
  isLight = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'topics' | 'chapters' | 'shlokas'>('topics');

  const filteredShlokas = SHLOKAS_DATA.filter(s => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      (s.sanskrit || '').toLowerCase().includes(q) ||
      (s.simpleHindi || '').toLowerCase().includes(q) ||
      (s.transliteration || '').toLowerCase().includes(q) ||
      (s.topics || []).some(t => (t || '').toLowerCase().includes(q)) ||
      (s.bhavarth || '').toLowerCase().includes(q) ||
      `अध्याय ${s.chapter}`.includes(q) ||
      `श्लोक ${s.verse}`.includes(q) ||
      `${s.chapter}.${s.verse}`.includes(q)
    );
  });

  const filteredTopics = TOPICS_DATA.filter(t => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return t.topic.toLowerCase().includes(q) || t.hindiTitle.toLowerCase().includes(q) || t.essence.toLowerCase().includes(q);
  });

  const filteredChapters = CHAPTERS_META.filter(c => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      c.sanskritName.toLowerCase().includes(q) ||
      c.hindiName.toLowerCase().includes(q) ||
      c.englishName.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      `अध्याय ${c.chapter}`.includes(q) ||
      `${c.chapter}` === q
    );
  });

  return (
    <div className={`w-full h-full max-w-lg mx-auto flex flex-col overflow-y-auto no-scrollbar pb-28 p-4 sm:p-6 select-none transition-colors ${
      isLight ? 'bg-white text-amber-950' : 'bg-neutral-950 text-neutral-100'
    }`}>
      
      {/* Header */}
      <div className="pt-2 pb-4">
        <h2 className={`text-2xl font-bold font-hindi ${isLight ? 'text-amber-600' : 'text-amber-200'}`}>
          Explore Gita • अन्वेषण
        </h2>
        <p className={`text-xs font-hindi mt-0.5 ${isLight ? 'text-amber-800/80 font-medium' : 'text-neutral-400'}`}>
          १८ अध्याय, प्रमुख विषय और श्लोक खोजें
        </p>
      </div>

      {/* Fast Search Input */}
      <div className="relative mb-5">
        <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${
          isLight ? 'text-amber-700' : 'text-neutral-400'
        }`} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="श्लोक, विषय, कर्म, क्रोध, अध्याय खोजें..."
          className={`w-full pl-10 pr-4 py-3 rounded-2xl text-sm font-hindi focus:outline-hidden border ${
            isLight
              ? 'bg-amber-50/70 border-amber-300 text-amber-950 placeholder-amber-700/50 focus:border-amber-500'
              : 'bg-neutral-900 border-neutral-800 text-neutral-100 placeholder-neutral-500 focus:border-amber-500/80'
          }`}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className={`absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-hindi ${
              isLight ? 'text-amber-700 hover:text-amber-900' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            साफ करें
          </button>
        )}
      </div>

      {/* Daily-Changing Thought of the Day */}
      {!searchQuery && activeTab === 'topics' && (
        <div className="mb-5">
          <ThoughtOfTheDay
            isLight={isLight}
            onJumpToVerse={(ch, v) => onSelectChapter(ch)}
          />
        </div>
      )}

      {/* Filter Tabs - 'Sabhi' removed per user request */}
      <div className="flex space-x-2 mb-5">
        {[
          { key: 'topics', label: 'प्रमुख विषय (Topics)' },
          { key: 'chapters', label: '१८ अध्याय (Chapters)' },
          { key: 'shlokas', label: 'श्लोक संग्रह (Verses)' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-3 py-1.5 rounded-full text-xs font-hindi transition-all ${
              activeTab === tab.key
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 font-bold shadow-md shadow-amber-500/20'
                : isLight
                  ? 'bg-amber-100/70 text-amber-900 hover:bg-amber-200/60 border border-amber-300'
                  : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Topics Section */}
      {(activeTab === 'topics' || searchQuery.trim().length > 0) && (
        <div className="mb-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold uppercase tracking-wider font-hindi flex items-center gap-1.5 ${
              isLight ? 'text-amber-700' : 'text-amber-400'
            }`}>
              <Layers className="w-3.5 h-3.5" />
              जीवन के विषय (Topics)
            </span>
            <span className={`text-[11px] font-hindi ${isLight ? 'text-amber-700/80 font-medium' : 'text-neutral-500'}`}>
              {filteredTopics.length} विषय
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {filteredTopics.map(t => (
              <div
                key={t.id}
                onClick={() => onSelectTopic(t.topic)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-2 group shadow-xs ${
                  isLight
                    ? 'bg-white border-amber-300 hover:border-amber-400 hover:bg-amber-50/50 text-amber-950 shadow-amber-500/5'
                    : 'bg-neutral-900/80 hover:bg-neutral-900 border-neutral-800 hover:border-amber-500/30 text-neutral-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-bold font-hindi ${
                    isLight ? 'text-amber-900 group-hover:text-amber-700' : 'text-amber-200 group-hover:text-amber-300'
                  }`}>
                    {t.hindiTitle}
                  </span>
                  <ArrowRight className={`w-3.5 h-3.5 transition-all group-hover:translate-x-1 ${
                    isLight ? 'text-amber-700 group-hover:text-amber-900' : 'text-neutral-500 group-hover:text-amber-400'
                  }`} />
                </div>
                <p className={`text-[11px] font-hindi line-clamp-2 ${
                  isLight ? 'text-amber-950/80 font-medium' : 'text-neutral-400'
                }`}>
                  {t.essence}
                </p>
                <div className={`flex items-center justify-between pt-1 border-t text-[10px] font-hindi ${
                  isLight ? 'border-amber-200 text-amber-700' : 'border-neutral-800/60 text-neutral-500'
                }`}>
                  <span>{t.versesCount} श्लोक</span>
                  <span className="font-bold text-amber-600">पढ़ें →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Shlokas Section */}
      {(activeTab === 'shlokas' || searchQuery.trim().length > 0) && (
        <div className="mb-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold uppercase tracking-wider font-hindi flex items-center gap-1.5 ${
              isLight ? 'text-amber-700' : 'text-amber-400'
            }`}>
              <Sparkles className="w-3.5 h-3.5" />
              प्रामाणिक श्लोक (Verses)
            </span>
            <span className={`text-[11px] font-hindi ${isLight ? 'text-amber-700/80 font-medium' : 'text-neutral-500'}`}>
              {filteredShlokas.length} परिणाम
            </span>
          </div>

          <div className="space-y-2.5">
            {filteredShlokas.map(s => (
              <div
                key={s.id}
                onClick={() => onSelectShloka(s)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 shadow-xs ${
                  isLight
                    ? 'bg-white border-amber-300 hover:border-amber-400 hover:bg-amber-50/50 text-amber-950 shadow-amber-500/5'
                    : 'bg-neutral-900/80 hover:bg-neutral-900 border-neutral-800 hover:border-amber-500/40 text-neutral-100'
                }`}
              >
                <div className={`flex items-center justify-between text-xs font-hindi font-bold ${
                  isLight ? 'text-amber-700' : 'text-amber-400'
                }`}>
                  <span>अध्याय {s.chapter} • श्लोक {s.verse}</span>
                  <span className={`text-[11px] font-hindi ${isLight ? 'text-amber-800/80' : 'text-neutral-400'}`}>
                    {s.chapterNameHindi}
                  </span>
                </div>
                <p className={`font-sanskrit text-sm font-semibold whitespace-pre-line leading-relaxed ${
                  isLight ? 'text-amber-900' : 'text-amber-100'
                }`}>
                  {s.sanskrit}
                </p>
                <p className={`font-hindi text-xs leading-normal line-clamp-2 ${
                  isLight ? 'text-amber-950/80 font-medium' : 'text-neutral-300'
                }`}>
                  <span className={`font-bold ${isLight ? 'text-amber-700' : 'text-amber-400'}`}>अर्थ: </span>
                  {s.simpleHindi}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chapters Section */}
      {(activeTab === 'chapters' || searchQuery.trim().length > 0) && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold uppercase tracking-wider font-hindi flex items-center gap-1.5 ${
              isLight ? 'text-amber-700' : 'text-amber-400'
            }`}>
              <BookOpen className="w-3.5 h-3.5" />
              भगवद्गीता के १८ अध्याय
            </span>
            <span className={`text-[11px] font-hindi ${isLight ? 'text-amber-700/80 font-medium' : 'text-neutral-500'}`}>
              {filteredChapters.length} अध्याय
            </span>
          </div>

          <div className="space-y-2">
            {filteredChapters.map(ch => (
              <div
                key={ch.chapter}
                onClick={() => onSelectChapter(ch.chapter)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between shadow-xs ${
                  isLight
                    ? 'bg-white border-amber-300 hover:border-amber-400 hover:bg-amber-50/50 text-amber-950 shadow-amber-500/5'
                    : 'bg-neutral-900/60 hover:bg-neutral-900 border-neutral-800 hover:border-neutral-700 text-neutral-100'
                }`}
              >
                <div className="space-y-0.5 max-w-[85%]">
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs font-bold font-hindi ${
                      isLight ? 'text-amber-700' : 'text-amber-500'
                    }`}>
                      अध्याय {ch.chapter}
                    </span>
                    <span className={`font-sanskrit text-sm font-bold ${
                      isLight ? 'text-amber-900' : 'text-neutral-200'
                    }`}>
                      {ch.sanskritName}
                    </span>
                  </div>
                  <p className={`text-xs font-hindi truncate ${
                    isLight ? 'text-amber-800/80 font-medium' : 'text-neutral-400'
                  }`}>
                    {ch.description}
                  </p>
                </div>
                <span className={`text-[11px] font-hindi shrink-0 ${
                  isLight ? 'text-amber-700/80 font-medium' : 'text-neutral-500'
                }`}>
                  {ch.totalVerses} श्लोक
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
