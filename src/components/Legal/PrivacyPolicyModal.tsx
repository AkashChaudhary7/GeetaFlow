import React, { useState } from 'react';
import { 
  ShieldCheck, 
  X, 
  Lock, 
  Database, 
  Cpu, 
  Trash2, 
  Mail, 
  HeartHandshake, 
  Scale, 
  CheckCircle2, 
  ArrowLeft,
  BookOpen,
  Smartphone,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { AppLogo } from '../Common/AppLogo';
import { triggerHaptic } from '../../utils/haptics';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'privacy' | 'terms';
  isLight?: boolean;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'privacy',
  isLight = false
}) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>(defaultTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col w-full h-full bg-neutral-950 text-neutral-100 overflow-hidden animate-fadeIn">
      {/* Top Header */}
      <div className="w-full px-4 py-3 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/90 backdrop-blur-md shrink-0">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="p-2 rounded-full hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors flex items-center gap-1.5"
            aria-label="वापस जाएं"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-xs font-hindi hidden sm:inline">वापस</span>
          </button>
          <div className="flex items-center space-x-2">
            <AppLogo size="xs" />
            <h2 className="text-base sm:text-lg font-bold font-hindi text-amber-200">
              {activeTab === 'privacy' ? 'गोपनीयता नीति • Privacy Policy' : 'सेवा की शर्तें • Terms of Service'}
            </h2>
          </div>
        </div>
        <button 
          onClick={() => {
            triggerHaptic('light');
            onClose();
          }} 
          className="p-2 rounded-full text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs for Privacy Policy & Terms of Service */}
      <div className="px-4 py-2.5 bg-neutral-900/60 border-b border-neutral-800/80 flex items-center justify-center space-x-2 shrink-0">
        <button
          onClick={() => {
            triggerHaptic('light');
            setActiveTab('privacy');
          }}
          className={`px-4 py-1.5 rounded-full text-xs font-hindi font-medium transition-all flex items-center space-x-1.5 ${
            activeTab === 'privacy'
              ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
              : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>गोपनीयता नीति (Privacy)</span>
        </button>
        <button
          onClick={() => {
            triggerHaptic('light');
            setActiveTab('terms');
          }}
          className={`px-4 py-1.5 rounded-full text-xs font-hindi font-medium transition-all flex items-center space-x-1.5 ${
            activeTab === 'terms'
              ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
              : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>सेवा की शर्तें (Terms)</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="p-4 sm:p-6 flex-1 overflow-y-auto space-y-6 max-w-2xl mx-auto w-full no-scrollbar text-neutral-200 font-sans">
        
        {/* Brand Trust Banner */}
        <div className="p-4 rounded-3xl bg-gradient-to-br from-amber-500/10 via-neutral-900 to-neutral-900 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center space-x-3">
            <AppLogo size="lg" />
            <div>
              <h3 className="font-display font-black text-amber-300 text-base">GEETAFLOW</h3>
              <p className="text-xs text-neutral-300 font-hindi mt-0.5">
                श्रीमद्भगवद्गीता ज्ञान व पवित्र स्वाध्याय ऐप
              </p>
              <p className="text-[10px] text-amber-400/80 mt-1">
                Google Play Store Compliant • Last Updated: March 2026 • v1.0.0
              </p>
            </div>
          </div>
          <a
            href="https://geetaflow.ictlabgsssaidana.workers.dev/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="self-start sm:self-center px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 hover:text-amber-100 text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-xs"
          >
            <span>Live Privacy Policy</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Official URL Verification Card */}
        <div className="p-3 rounded-2xl bg-neutral-900/90 border border-neutral-800 text-xs flex items-center justify-between gap-2">
          <div className="space-y-0.5">
            <span className="text-[11px] text-neutral-400 font-hindi block">आधिकारिक लाइव प्राइवेसी लिंक (Official URL):</span>
            <a 
              href="https://geetaflow.ictlabgsssaidana.workers.dev/privacy" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-amber-400 hover:text-amber-300 underline font-mono text-[11px] break-all flex items-center gap-1"
            >
              https://geetaflow.ictlabgsssaidana.workers.dev/privacy
            </a>
          </div>
        </div>

        {activeTab === 'privacy' ? (
          <div className="space-y-6 text-xs leading-relaxed">
            
            {/* 1. Core Privacy Philosophy */}
            <section className="space-y-2 p-4 rounded-2xl bg-neutral-900/70 border border-neutral-800">
              <div className="flex items-center space-x-2 text-amber-400 font-bold font-hindi text-sm">
                <Lock className="w-4 h-4" />
                <span>1. हमारा संकल्प: 100% ऑन-डिवाइस गोपनीयता (Our Commitment)</span>
              </div>
              <p className="text-neutral-300 font-hindi">
                GeetaFlow को आपके आध्यात्मिक स्वाध्याय के लिए एक अत्यंत सुरक्षित, शांत और निजी वातावरण प्रदान करने के उद्देश्य से बनाया गया है।
              </p>
              <ul className="space-y-1.5 text-neutral-300 list-disc list-inside pt-1 font-hindi">
                <li><b>शून्य ट्रैकिंग (Zero Tracking):</b> हम कोई व्यक्तिगत पहचान योग्य जानकारी (PII), फ़ोन नंबर, ईमेल, या संपर्क सूची एकत्र नहीं करते हैं।</li>
                <li><b>कोई विज्ञापन नहीं (Zero Ads):</b> हम किसी तीसरे पक्ष के विज्ञापन नेटवर्क को आपका डेटा साझा या विक्रय नहीं करते।</li>
                <li><b>अकाउंट की बाध्यता नहीं:</b> ऐप का उपयोग करने हेतु किसी पंजीकरण या लॉगिन की आवश्यकता नहीं है।</li>
              </ul>
            </section>

            {/* 2. Data Stored Locally on Device */}
            <section className="space-y-2 p-4 rounded-2xl bg-neutral-900/70 border border-neutral-800">
              <div className="flex items-center space-x-2 text-amber-400 font-bold font-hindi text-sm">
                <Database className="w-4 h-4" />
                <span>2. आपके फ़ोन पर सुरक्षित स्थानीय डेटा (Data Stored Locally)</span>
              </div>
              <p className="text-neutral-300 font-hindi">
                ऐप की निर्बाध कार्यप्रणाली और ऑफ़लाइन सुविधा हेतु निम्न प्राथमिक डेटा आपके डिवाइस के लोकल स्टोरेज (Local Storage / Cache) में ही सुरक्षित रहता है:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-hindi">
                <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800">
                  <span className="font-bold text-amber-300 block">पठन इतिहास व बुकमार्क</span>
                  <span className="text-[11px] text-neutral-400">आपके द्वारा पढ़े गए श्लोक, पसंदीदा छंद व अर्जित ज्ञान पदक।</span>
                </div>
                <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800">
                  <span className="font-bold text-amber-300 block">उपयोगकर्ता प्राथमिकताएं</span>
                  <span className="text-[11px] text-neutral-400">फ़ॉन्ट आकार, डार्क/लाइट थीम, और ध्यान वातावरण ध्वनि सेटिंग्स।</span>
                </div>
              </div>
            </section>

            {/* 3. Device Permissions */}
            <section className="space-y-2 p-4 rounded-2xl bg-neutral-900/70 border border-neutral-800">
              <div className="flex items-center space-x-2 text-amber-400 font-bold font-hindi text-sm">
                <Smartphone className="w-4 h-4" />
                <span>3. आवश्यक डिवाइस अनुमतियाँ (Device Permissions & Usage)</span>
              </div>
              <ul className="space-y-2 font-hindi text-neutral-300">
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <b>ऑडियो व मीडिया प्लेबैक (Audio Playback):</b> संस्कृत श्लोक उच्चारण एवं शांत तानपुरा/मंदिर घंटियों की वातावरण ध्वनियों के लिए।
                  </div>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <b>फ़ाइल व वीडियो निर्यात (Storage / File Export):</b> आपके द्वारा 30-सेकंड ज्ञान रील अथवा श्लोक कार्ड को स्थानीय रूप से डाउनलोड करने के लिए।
                  </div>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <b>हैप्टिक फ़ीडबैक (Haptic Vibration):</b> स्वाइप और श्लोक लाइक/बुकमार्क करने पर स्पर्श अनुभूति हेतु।
                  </div>
                </li>
              </ul>
            </section>

            {/* 4. AI Ask Gita Query Processing */}
            <section className="space-y-2 p-4 rounded-2xl bg-neutral-900/70 border border-neutral-800">
              <div className="flex items-center space-x-2 text-amber-400 font-bold font-hindi text-sm">
                <Sparkles className="w-4 h-4" />
                <span>4. 'Ask Gita' AI परामर्श व प्रश्न (AI Query Processing)</span>
              </div>
              <p className="text-neutral-300 font-hindi">
                जब आप 'Ask Gita' में कोई जीवन प्रश्न अथवा शंका पूछते हैं, तो प्रश्न केवल उस समय उपयुक्त श्लोक और समाधान खोजने हेतु सर्वर-साइड सुरक्षित रूप से प्रोसेस किया जाता है। आपके प्रश्न को किसी विज्ञापन प्रोफ़ाइल निर्माण के लिए उपयोग नहीं किया जाता।
              </p>
            </section>

            {/* 5. Children & Family Compliance */}
            <section className="space-y-2 p-4 rounded-2xl bg-neutral-900/70 border border-neutral-800">
              <div className="flex items-center space-x-2 text-amber-400 font-bold font-hindi text-sm">
                <HeartHandshake className="w-4 h-4" />
                <span>5. बाल एवं पारिवारिक सुरक्षा (Children & Family Safety)</span>
              </div>
              <p className="text-neutral-300 font-hindi">
                GeetaFlow सम्पूर्ण परिवार, विद्यार्थियों और सभी आयु वर्ग के साधकों के लिए पूर्णतः सुरक्षित (Family-Safe) है। इसमें कोई अनुचित सामग्री, वयस्क तत्व अथवा हिंसात्मक संदर्भ नहीं है। यह COPPA एवं Google Play Families Policy के सभी मानकों का पूर्ण पालन करता है।
              </p>
            </section>

            {/* 6. Data Deletion Right */}
            <section className="space-y-2 p-4 rounded-2xl bg-neutral-900/70 border border-neutral-800">
              <div className="flex items-center space-x-2 text-amber-400 font-bold font-hindi text-sm">
                <Trash2 className="w-4 h-4" />
                <span>6. डेटा हटाने का आपका अधिकार (Right to Data Deletion)</span>
              </div>
              <p className="text-neutral-300 font-hindi">
                आप किसी भी समय ऐप की 'सेटिंग्स' में जाकर 'पठन इतिहास रीसेट करें' बटन दबाकर अपने डिवाइस में संचित 100% डेटा को एक क्लिक में स्थायी रूप से हटा सकते हैं।
              </p>
            </section>

            {/* 7. Contact Support */}
            <section className="space-y-2 p-4 rounded-2xl bg-neutral-900/70 border border-neutral-800">
              <div className="flex items-center space-x-2 text-amber-400 font-bold font-hindi text-sm">
                <Mail className="w-4 h-4" />
                <span>7. संपर्क व सहायता (Developer & Support Contact)</span>
              </div>
              <p className="text-neutral-300 font-hindi">
                यदि आपके पास इस गोपनीयता नीति या ऐप के संबंध में कोई प्रश्न अथवा सुझाव है, तो आप सीधे संपर्क कर सकते हैं:
              </p>
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs space-y-1.5">
                <div className="text-amber-300 font-medium">ईमेल: <a href="mailto:ictlabgsssaidana@gmail.com" className="underline">ictlabgsssaidana@gmail.com</a> / <a href="mailto:mobographie@gmail.com" className="underline">mobographie@gmail.com</a></div>
                <div className="text-neutral-400">डेवलपर: GeetaFlow Team • Bharat</div>
                <div className="pt-1 text-[11px] text-amber-400/90 flex items-center gap-1">
                  <span>लाइव गोपनीयता नीति वेब पेज:</span>
                  <a href="https://geetaflow.ictlabgsssaidana.workers.dev/privacy" target="_blank" rel="noopener noreferrer" className="underline font-mono text-amber-300">
                    geetaflow.ictlabgsssaidana.workers.dev/privacy
                  </a>
                </div>
              </div>
            </section>

          </div>
        ) : (
          <div className="space-y-6 text-xs leading-relaxed">
            
            {/* Terms of Service Section */}
            <section className="space-y-2 p-4 rounded-2xl bg-neutral-900/70 border border-neutral-800">
              <div className="flex items-center space-x-2 text-amber-400 font-bold font-hindi text-sm">
                <Scale className="w-4 h-4" />
                <span>1. सेवा की शर्तें (Terms of Service)</span>
              </div>
              <p className="text-neutral-300 font-hindi">
                GeetaFlow का उपयोग करने पर आप इन नियमों व शर्तों से सहमत होते हैं:
              </p>
              <ul className="space-y-1.5 text-neutral-300 list-disc list-inside pt-1 font-hindi">
                <li><b>आध्यात्मिक व शैक्षणिक उद्देश्य:</b> GeetaFlow का उद्देश्य श्रीमद्भगवद्गीता के ज्ञान को सरल, सुलभ और जन-जन तक पहुँचाना है।</li>
                <li><b>व्यक्तिगत उपयोग:</b> ऐप की सामग्री का उपयोग व्यक्तिगत शांति, स्वाध्याय और सद्भाव को बढ़ावा देने हेतु किया जाना चाहिए।</li>
                <li><b>संस्कृति व मर्यादा:</b> श्लोकों व विचारों को साझा करते समय सनातन ज्ञान की शुचिता और मर्यादा का आदर करें।</li>
              </ul>
            </section>

            <section className="space-y-2 p-4 rounded-2xl bg-neutral-900/70 border border-neutral-800">
              <div className="flex items-center space-x-2 text-amber-400 font-bold font-hindi text-sm">
                <BookOpen className="w-4 h-4" />
                <span>2. अस्वीकरण (Disclaimer & Faith Notice)</span>
              </div>
              <p className="text-neutral-300 font-hindi">
                श्रीमद्भगवद्गीता के श्लोक, हिंदी अनुवाद और आज की सीख प्राचीन प्रामाणिक ग्रंथों और टीकाओं पर आधारित हैं। 'Ask Gita' AI परामर्श एक आध्यात्मिक मार्गदर्शक सहायक मात्र है, जो जीवन में आत्म-चिंतन और धैर्य का संदेश देता है।
              </p>
            </section>

            <section className="space-y-2 p-4 rounded-2xl bg-neutral-900/70 border border-neutral-800">
              <div className="flex items-center space-x-2 text-amber-400 font-bold font-hindi text-sm">
                <Sparkles className="w-4 h-4" />
                <span>3. बौद्धिक संपदा (Intellectual Property)</span>
              </div>
              <p className="text-neutral-300 font-hindi">
                पवित्र भगवद्गीता के मूल वैदिक श्लोक सम्पूर्ण मानवता की सांस्कृतिक धरोहर हैं। GeetaFlow का विशिष्ट यूजर इंटरफ़ेस, वीडियो रील जनरेटर, डूडल कला एवं ऑडियो विज़ुअलाइज़ेशन GeetaFlow की बौद्धिक रचना हैं।
              </p>
            </section>

          </div>
        )}

        {/* Bottom Accept / Dismiss */}
        <div className="pt-4 pb-2">
          <button
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 text-neutral-950 font-bold text-xs font-hindi shadow-md hover:brightness-110 active:scale-98 transition-all"
          >
            मैंने पढ़ लिया और समझ लिया (I Understand)
          </button>
        </div>

      </div>
    </div>
  );
};
