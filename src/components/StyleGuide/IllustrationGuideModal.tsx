import React, { useState } from 'react';
import { 
  X, 
  Palette, 
  User, 
  ShieldAlert, 
  Copy, 
  Check, 
  Sparkles, 
  BookOpen, 
  Layers, 
  Eye, 
  Feather,
  ArrowLeft
} from 'lucide-react';

interface IllustrationGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IllustrationGuideModal: React.FC<IllustrationGuideModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeSection, setActiveSection] = useState<'aesthetic' | 'characters' | 'palette' | 'prompts'>('characters');
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptId(id);
    setTimeout(() => setCopiedPromptId(null), 2500);
  };

  const PALETTE_SWATCHES = [
    { name: "Pitambari Gold", hex: "#F59E0B", role: "Divine wisdom, illumination, optimism", textColor: "text-neutral-950" },
    { name: "Yamuna Dusk Blue", hex: "#1E3A5F", role: "Shyam-varna, Krishna's skin, cosmic calm", textColor: "text-white" },
    { name: "Vedic Saffron", hex: "#D97706", role: "Sacred fire, renunciation, spiritual energy", textColor: "text-neutral-950" },
    { name: "Chariot Ochre", hex: "#8C5B32", role: "Teakwood ratha, earthiness, grounding", textColor: "text-white" },
    { name: "Lotus Blush", hex: "#E88D88", role: "Bhakti, gentle compassion, tender heart", textColor: "text-neutral-950" },
    { name: "Tulsi Emerald", hex: "#10B981", role: "Auspicious nature, balance, equanimity", textColor: "text-neutral-950" },
    { name: "Vedic Charcoal", hex: "#121214", role: "Dark canvas, infinite stillness, high contrast", textColor: "text-white" },
    { name: "Parchment Cream", hex: "#FDFBF7", role: "Sacred text, Devanagari clarity, daylight tone", textColor: "text-neutral-950" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col w-full h-full bg-neutral-950 text-neutral-100 overflow-hidden animate-fadeIn">
      {/* Top App Bar */}
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
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-neutral-950 shadow-md shadow-amber-500/20">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-hindi font-bold text-sm sm:text-base text-amber-200">
                  कला निर्देशिका • Style Guide
                </h2>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-mono border border-amber-500/30">
                  v1.0
                </span>
              </div>
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

      {/* Main Page Content Wrapper */}
      <div className="flex-1 flex flex-col max-w-4xl w-full mx-auto overflow-hidden">

        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-neutral-800 bg-neutral-950/40 px-3 sm:px-5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveSection('characters')}
            className={`py-3 px-3 text-xs font-hindi font-medium border-b-2 transition-colors whitespace-nowrap flex items-center space-x-1.5 ${
              activeSection === 'characters'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>चरित्र निर्देशिका (Krishna & Arjuna)</span>
          </button>
          
          <button
            onClick={() => setActiveSection('aesthetic')}
            className={`py-3 px-3 text-xs font-hindi font-medium border-b-2 transition-colors whitespace-nowrap flex items-center space-x-1.5 ${
              activeSection === 'aesthetic'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>सौंदर्यशास्त्र व वर्जनाएं (Rules & Avoid)</span>
          </button>

          <button
            onClick={() => setActiveSection('palette')}
            className={`py-3 px-3 text-xs font-hindi font-medium border-b-2 transition-colors whitespace-nowrap flex items-center space-x-1.5 ${
              activeSection === 'palette'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>रंग पैलेट (Palettes)</span>
          </button>

          <button
            onClick={() => setActiveSection('prompts')}
            className={`py-3 px-3 text-xs font-hindi font-medium border-b-2 transition-colors whitespace-nowrap flex items-center space-x-1.5 ${
              activeSection === 'prompts'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI प्रॉम्प्ट फॉर्मूला (Prompt Formulas)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto space-y-5 no-scrollbar text-xs sm:text-sm">
          
          {/* TAB 1: CHARACTERS (Krishna & Arjuna & Setting) */}
          {activeSection === 'characters' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Highlight Note */}
              <div className="p-3 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex items-start space-x-2.5">
                <Feather className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="font-hindi text-xs text-amber-200 leading-relaxed">
                  <span className="font-semibold text-amber-300">दृश्य निरंतरता का नियम (Visual Consistency): </span>
                  हर चित्रण में पात्रों की पहचान (रंग, वस्त्र, आभूषण और भाव-भंगिमा) एक समान होनी चाहिए ताकि पाठक को सहज आत्मीयता का अनुभव हो।
                </p>
              </div>

              {/* Character 1: Shri Krishna */}
              <div className="p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-full bg-blue-900/60 border border-blue-400/40 flex items-center justify-center text-blue-300 font-bold text-xs">
                      श्री
                    </div>
                    <div>
                      <h3 className="font-hindi font-bold text-base text-neutral-100">
                        श्रीकृष्ण (Shri Krishna) • परम सखा व गुरु
                      </h3>
                      <span className="text-[10px] text-amber-400 font-mono">The Compassionate Spiritual Guide</span>
                    </div>
                  </div>
                  <span className="text-[11px] bg-blue-950/80 text-blue-300 px-2.5 py-1 rounded-full border border-blue-500/30 font-hindi">
                    श्याम-वर्ण (#1E3A5F)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800/80 space-y-1">
                    <span className="text-amber-400 font-hindi font-semibold block">त्वचा व शारीरिक रूप (Physical Form):</span>
                    <p className="font-hindi text-neutral-300 text-[11px] leading-relaxed">
                      वर्षाकालीन सजल मेघ जैसा सांवला-नीला वर्ण (Dusky twilight-blue)। कभी भी चमकीला एलियन नीला या भूरा नहीं। सौम्य, शांत, मुस्कानयुक्त चेहरा (मन्दहास्य)।
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800/80 space-y-1">
                    <span className="text-amber-400 font-hindi font-semibold block">केश व मुकुट (Hair & Crown):</span>
                    <p className="font-hindi text-neutral-300 text-[11px] leading-relaxed">
                      मुलायम घुंघराले काले केश जूड़े में बंधे हुए। एक झुका हुआ प्रामाणिक मयूर पंख (Peacock feather)। अत्यधिक भारी मुकुट के स्थान पर सादा, सुरुचिपूर्ण स्वर्ण पट्टी।
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800/80 space-y-1">
                    <span className="text-amber-400 font-hindi font-semibold block">वस्त्र व आभूषण (Attire):</span>
                    <p className="font-hindi text-neutral-300 text-[11px] leading-relaxed">
                      पीताम्बरी (उष्ण स्वर्ण-पीला रेशमी धोती), कंधे पर सादा उत्तरीय। कमर में हल्की बांसुरी (बांसुरी) या हाथ में कमल। तुलसी माला।
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800/80 space-y-1">
                    <span className="text-amber-400 font-hindi font-semibold block">भाव-भंगिमा (Demeanor):</span>
                    <p className="font-hindi text-neutral-300 text-[11px] leading-relaxed">
                      सहानुभूतिपूर्ण गुरु। ज्ञान देते समय एक खुला हुआ हाथ (ज्ञान-मुद्रा या आश्वासन)। कोई भी आक्रामक या क्रोधी भाव नहीं।
                    </p>
                  </div>
                </div>
              </div>

              {/* Character 2: Arjuna */}
              <div className="p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-full bg-amber-900/60 border border-amber-400/40 flex items-center justify-center text-amber-300 font-bold text-xs">
                      अर्जुन
                    </div>
                    <div>
                      <h3 className="font-hindi font-bold text-base text-neutral-100">
                        अर्जुन (Arjuna) • समर्पित जिज्ञासु व योद्धा
                      </h3>
                      <span className="text-[10px] text-amber-400 font-mono">The Earnest Seeker & Noble Disciple</span>
                    </div>
                  </div>
                  <span className="text-[11px] bg-amber-950/80 text-amber-300 px-2.5 py-1 rounded-full border border-amber-500/30 font-hindi">
                    गौर-श्याम वर्ण (#9C6644)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800/80 space-y-1">
                    <span className="text-amber-400 font-hindi font-semibold block">शारीरिक रूप व वर्ण:</span>
                    <p className="font-hindi text-neutral-300 text-[11px] leading-relaxed">
                      सुगठित धनुर्धर की देहयष्टि, गेहूंआ वर्ण (Warm wheatish skin)। चेहरे पर विनम्रता, चिंतन और आत्म-संशय से ज्ञान की ओर अग्रसर होने का भाव।
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800/80 space-y-1">
                    <span className="text-amber-400 font-hindi font-semibold block">वस्त्र व गांडीव (Attire & Gandiva):</span>
                    <p className="font-hindi text-neutral-300 text-[11px] leading-relaxed">
                      मृत्तिका-रंग (टेराकोटा) व गहरे गेरुए रंग के सादे योद्धा वस्त्र। कलाई पर धनुर्धर आवरण। गांडीव धनुष रथ के पहिए के सहारे शांत अवस्था में रखा हुआ।
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800/80 space-y-1 sm:col-span-2">
                    <span className="text-amber-400 font-hindi font-semibold block">भाव की यात्रा:</span>
                    <p className="font-hindi text-neutral-300 text-[11px] leading-relaxed">
                      अध्याय १ में: झुके हुए कंधे, विषाद व करबद्ध जिज्ञासा। अध्याय १८ में: स्थिर, निडर, स्पष्टता व समत्व भाव में प्रतिष्ठित।
                    </p>
                  </div>
                </div>
              </div>

              {/* Setting: Chariot and Kurukshetra */}
              <div className="p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800 space-y-2">
                <h4 className="font-hindi font-semibold text-xs text-amber-300 flex items-center space-x-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  <span>दिव्य रथ व कुरुक्षेत्र का वातावरण (Atmosphere):</span>
                </h4>
                <p className="font-hindi text-neutral-300 text-[11px] leading-relaxed">
                  रथ प्राकृतिक सागौन की लकड़ी और पीतल का बना हुआ। चार श्वेत अश्व शांत खड़े हैं (मन और इंद्रियों के संयम का प्रतीक)। युद्धभूमि को रक्त या हिंसा से नहीं, बल्कि गोधूलि वेला की सुनहरी आभा, दूर उड़ती धूल की शांत किरणें और असीम क्षितिज के रूप में चित्रित करें।
                </p>
              </div>

            </div>
          )}

          {/* TAB 2: AESTHETIC & AVOID */}
          {activeSection === 'aesthetic' && (
            <div className="space-y-5 animate-fadeIn">
              
              {/* Aesthetic Pillars */}
              <div className="space-y-3">
                <h3 className="font-hindi font-bold text-sm text-amber-300">
                  मूल सौंदर्यशास्त्र सिद्धांत (Core Visual Pillars)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
                    <div className="text-amber-400 font-hindi font-semibold text-xs">
                      १. प्यारा परंतु परम आदरणीय
                    </div>
                    <p className="font-hindi text-[11px] text-neutral-400">
                      "Cute but deeply respectful" — सुगम और कोमल, किंतु दिव्यता और गंभीरता की पूरी मर्यादा के साथ।
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
                    <div className="text-amber-400 font-hindi font-semibold text-xs">
                      २. हस्तलिखित / डूडल प्रभाव
                    </div>
                    <p className="font-hindi text-[11px] text-neutral-400">
                      हल्की स्याही रेखाएं (Hand-inked line art), गुआश (Gouache) व जलरंग (Watercolor) की गर्म अनुभूति।
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
                    <div className="text-amber-400 font-hindi font-semibold text-xs">
                      ३. विषयवस्तु सर्वोपरि (Content-First)
                    </div>
                    <p className="font-hindi text-[11px] text-neutral-400">
                      चित्र श्लोक को सहायता प्रदान करने के लिए हैं, उस पर हावी होने के लिए नहीं। ४०% से अधिक स्थान न लें।
                    </p>
                  </div>
                </div>
              </div>

              {/* Elements to Avoid Matrix */}
              <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-3">
                <div className="flex items-center space-x-2 text-rose-300 font-hindi font-bold text-sm">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>सख्ती से वर्जित तत्व (Strict Negative Constraints)</span>
                </div>

                <div className="space-y-2 text-[11px] font-hindi text-rose-200/90 leading-relaxed">
                  <div className="flex items-start space-x-2">
                    <span className="text-rose-400 font-bold shrink-0">✕</span>
                    <span><strong>फोटोरियलिज्म व 3D ग्लॉस नहीं:</strong> प्लास्टिक जैसी गुड़िया चेहरे, हाइपर-विस्तृत त्वचा के रोमछिद्र या चमकीले सिनेमाई 3D रेंडर का प्रयोग न करें।</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-rose-400 font-bold shrink-0">✕</span>
                    <span><strong>अत्यधिक काल्पनिक (Fantasy/Sci-Fi) प्रभाव नहीं:</strong> नीयॉन लेज़र आंखें, मार्वल-कॉमिक जैसे आक्रामक मांसपेशी दानव, या साइबरपंक शैली पूर्णतः वर्जित हैं।</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-rose-400 font-bold shrink-0">✕</span>
                    <span><strong>अनादर व हास्यास्पद कार्टून नहीं:</strong> कोई भी विदूषक जैसी आंखें, जीभ निकालना, या विकृत शरीर अनुपात नहीं होने चाहिए।</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-rose-400 font-bold shrink-0">✕</span>
                    <span><strong>हिंसा, रक्त व कंकाल नहीं:</strong> भले ही कुरुक्षेत्र युद्धभूमि है, दृश्य में रक्तपात, कटे अंग या भयावह कंकाल कभी न दिखाएं।</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: PALETTE */}
          {activeSection === 'palette' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-hindi font-bold text-sm text-neutral-100">
                    वैदिक व प्राकृतिक वर्णमाला (Vedic Pigments)
                  </h3>
                  <p className="text-[11px] font-hindi text-neutral-400">
                    पारंपरिक भारतीय खनिज रंगों का आधुनिक न्यूट्रल रूपांतरण
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PALETTE_SWATCHES.map((swatch, idx) => (
                  <div 
                    key={idx}
                    className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center space-x-3"
                  >
                    <div 
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono font-bold text-[10px] shadow-md shrink-0 border border-white/10 ${swatch.textColor}`}
                      style={{ backgroundColor: swatch.hex }}
                    >
                      {swatch.hex}
                    </div>
                    <div className="space-y-0.5">
                      <div className="font-hindi font-semibold text-xs text-neutral-200">
                        {swatch.name}
                      </div>
                      <div className="font-hindi text-[10px] text-neutral-400 leading-snug">
                        {swatch.role}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PROMPTS */}
          {activeSection === 'prompts' && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <h3 className="font-hindi font-bold text-sm text-neutral-100">
                  उत्पादन हेतु AI प्रॉम्प्ट फॉर्मूला (Production Prompt Formulas)
                </h3>
                <p className="text-[11px] font-hindi text-neutral-400">
                  इन प्रॉम्प्ट्स को Imagen, Midjourney या अन्य जनरेटिव मॉडल में सीधे उपयोग कर सकते हैं:
                </p>
              </div>

              {/* Prompt 1 */}
              <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-hindi font-semibold text-xs text-amber-300">
                    १. श्रीकृष्ण और अर्जुन का संवाद (Chapter 2, Dialogue)
                  </span>
                  <button
                    onClick={() => copyToClipboard(
                      `A peaceful, minimalist storybook illustration of Shri Krishna and warrior Arjuna on an ancient wooden chariot. Krishna has serene dusky twilight-blue skin, gentle compassionate eyes, soft dark curls adorned with a single delicate peacock feather, dressed in warm saffron-gold Pitambari silk. He is seated calmly, gesturing with one open hand in quiet wisdom. Arjuna has warm golden-brown skin, seated receptively with hands folded in deep reverence, Gandiva bow resting peacefully at his side. Hand-drawn Gouache illustration style with delicate ink linework, warm Indian minimalist aesthetic. Color palette of Pitambari gold, Yamuna dusk blue, terracotta ochre, and parchment cream. Soft golden sunset light. Negative space at top for Sanskrit text overlay. --no photorealistic, 3d render, plastic, CGI, western comic style, neon glow, aggressive angry faces, blood, skulls, dark gothic fantasy.`,
                      'p1'
                    )}
                    className="text-[10px] font-hindi text-amber-400 hover:text-amber-200 flex items-center space-x-1 py-1 px-2 rounded-lg bg-neutral-900 border border-neutral-800"
                  >
                    {copiedPromptId === 'p1' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedPromptId === 'p1' ? 'कॉपी हुआ!' : 'प्रॉम्प्ट कॉपी करें'}</span>
                  </button>
                </div>
                <p className="text-[11px] font-mono text-neutral-400 bg-neutral-900/90 p-2.5 rounded-xl border border-neutral-800/60 leading-relaxed">
                  "A peaceful, minimalist storybook illustration of Shri Krishna and warrior Arjuna on an ancient wooden chariot. Krishna has serene dusky twilight-blue skin, gentle compassionate eyes, soft dark curls with a single peacock feather, warm saffron Pitambari. Arjuna has warm golden-brown skin, hands folded in reverence. Hand-drawn gouache doodle-influence with ink contours. Warm Indian minimalism..."
                </p>
              </div>

              {/* Prompt 2 */}
              <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-hindi font-semibold text-xs text-amber-300">
                    २. ध्यान व मन-नियंत्रण (Chapter 6, Meditation)
                  </span>
                  <button
                    onClick={() => copyToClipboard(
                      `Minimalist hand-drawn illustration of a solitary yogi meditating by a serene lotus pond under an ancient sacred banyan tree. Stylized warm doodle-influence with delicate fluid ink contours and soft watercolor wash. An unwavering oil lamp flame burning steadily in a windless place. Warm amber and deep forest green tones, peaceful twilight atmosphere, stars faintly visible in quiet sky. Cute yet deeply respectful, spiritual mindfulness, spacious clean composition. --no busy, psychedelic, neon lasers, digital artifact, 3d glossy, photorealism, loud colors, clutter.`,
                      'p2'
                    )}
                    className="text-[10px] font-hindi text-amber-400 hover:text-amber-200 flex items-center space-x-1 py-1 px-2 rounded-lg bg-neutral-900 border border-neutral-800"
                  >
                    {copiedPromptId === 'p2' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedPromptId === 'p2' ? 'कॉपी हुआ!' : 'प्रॉम्प्ट कॉपी करें'}</span>
                  </button>
                </div>
                <p className="text-[11px] font-mono text-neutral-400 bg-neutral-900/90 p-2.5 rounded-xl border border-neutral-800/60 leading-relaxed">
                  "Minimalist hand-drawn illustration of a solitary yogi meditating by a serene lotus pond under an ancient sacred banyan tree. Stylized warm doodle-influence with delicate fluid ink contours and soft watercolor wash. An unwavering oil lamp flame burning steadily in a windless place..."
                </p>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-neutral-800 bg-neutral-950/80 flex items-center justify-between text-xs font-hindi text-neutral-400">
          <span className="flex items-center space-x-1">
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>पूर्ण गाइड <code>/docs/ILLUSTRATION_STYLE_GUIDE.md</code> में भी उपलब्ध है</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium transition-colors"
          >
            बंद करें
          </button>
        </div>

      </div>
    </div>
  );
};
