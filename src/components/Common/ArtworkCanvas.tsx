import React from 'react';
import { IllustrationType } from '../../types';

interface ArtworkProps {
  type?: IllustrationType;
  shlokaId?: string;
  chapter?: number;
  verse?: number;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'full';
  isLight?: boolean;
}

export const ArtworkCanvas: React.FC<ArtworkProps> = ({ 
  type, 
  shlokaId, 
  chapter, 
  verse, 
  className = '', 
  size = 'md',
  isLight = false,
}) => {
  const getContainerSize = () => {
    switch (size) {
      case 'xs': return 'w-12 h-12';
      case 'sm': return 'w-18 h-18 sm:w-20 sm:h-20';
      case 'md': return 'w-28 h-28';
      case 'lg': return 'w-44 h-44';
      case 'full': return 'w-full h-full';
      default: return 'w-24 h-24';
    }
  };

  // Determine the exact unique doodle key for this card/shloka
  const getDoodleKey = (): string => {
    if (shlokaId) {
      const cleanId = shlokaId.toLowerCase();
      // 1. Direct shloka map
      if (cleanId === 'bg_2_47') return 'karma_seeds';
      if (cleanId === 'bg_2_14') return 'titiksha_seasons';
      if (cleanId === 'bg_2_20') return 'eternal_atman';
      if (cleanId === 'bg_2_62') return 'mind_waves';
      if (cleanId === 'bg_2_63') return 'calm_insight';
      if (cleanId === 'bg_2_70') return 'calm_ocean';
      if (cleanId === 'bg_3_19') return 'selfless_offering';
      if (cleanId === 'bg_3_21') return 'guiding_light';
      if (cleanId === 'bg_3_35') return 'dharma_compass';
      if (cleanId === 'bg_4_7') return 'sudarshana_chakra';
      if (cleanId === 'bg_4_18') return 'still_dewdrop';
      if (cleanId === 'bg_4_38') return 'sacred_grantha';
      if (cleanId === 'bg_5_10') return 'pure_lotus_leaf';
      if (cleanId === 'bg_6_5') return 'ascending_soul';
      if (cleanId === 'bg_6_6') return 'two_birds';
      if (cleanId === 'bg_6_26') return 'tamed_mind';
      if (cleanId === 'bg_6_35') return 'steady_flame';
      if (cleanId === 'bg_7_7') return 'pearls_thread';
      if (cleanId === 'bg_9_22') return 'divine_shelter';
      if (cleanId === 'bg_9_26') return 'loving_offering';
      if (cleanId === 'bg_10_20') return 'heart_shrine';
      if (cleanId === 'bg_11_32') return 'kala_chakra';
      if (cleanId === 'bg_12_13') return 'universal_love';
      if (cleanId === 'bg_12_15') return 'serene_lake';
      if (cleanId === 'bg_14_22') return 'gunas_transcendence';
      if (cleanId === 'bg_15_1') return 'cosmic_tree';
      if (cleanId === 'bg_15_15') return 'sacred_om';
      if (cleanId === 'bg_16_21') return 'three_gates';
      if (cleanId === 'bg_18_54') return 'prasannatma';
      if (cleanId === 'bg_18_66') return 'charan_paduka';
      if (cleanId === 'bg_18_78') return 'chariot_krishna_arjuna';
      if (cleanId === 'resanskrit_balidan') return 'sacred_trishul';
      if (cleanId === 'resanskrit_shariram') return 'sacred_kalash';
      if (cleanId === 'resanskrit_ahimsa') return 'peepal_leaf';
      if (cleanId === 'resanskrit_satya') return 'sun_of_truth';
      if (cleanId === 'resanskrit_swadharma') return 'gandiva_bow';
      if (cleanId === 'resanskrit_matribhumi') return 'sacred_river';
      if (cleanId === 'resanskrit_guru') return 'guru_lamp';
    }

    // 2. Chapter and verse deterministic selection for any of the 700 verses
    if (chapter !== undefined && verse !== undefined) {
      const allDoodlePool = [
        'chariot_krishna_arjuna', 'karma_seeds', 'titiksha_seasons', 'eternal_atman',
        'mind_waves', 'calm_insight', 'calm_ocean', 'selfless_offering',
        'guiding_light', 'dharma_compass', 'sudarshana_chakra', 'still_dewdrop',
        'sacred_grantha', 'pure_lotus_leaf', 'ascending_soul', 'two_birds',
        'tamed_mind', 'steady_flame', 'pearls_thread', 'divine_shelter',
        'loving_offering', 'heart_shrine', 'kala_chakra', 'universal_love',
        'serene_lake', 'gunas_transcendence', 'cosmic_tree', 'sacred_om',
        'three_gates', 'prasannatma', 'charan_paduka', 'sacred_trishul',
        'sacred_kalash', 'peepal_leaf', 'sun_of_truth', 'gandiva_bow',
        'sacred_river', 'guru_lamp'
      ];
      const index = (chapter * 37 + verse * 13) % allDoodlePool.length;
      return allDoodlePool[index];
    }

    // 3. Fallback to illustration type mapping
    if (type) {
      if (type === 'chariot_krishna_arjuna') return 'chariot_krishna_arjuna';
      if (type === 'karma_wheel') return 'karma_seeds';
      if (type === 'meditating_yogi') return 'prasannatma';
      if (type === 'divine_flute') return 'divine_flute';
      if (type === 'lotus_flower') return 'pure_lotus_leaf';
      if (type === 'flame_of_knowledge') return 'steady_flame';
      if (type === 'bow_and_arrow') return 'gandiva_bow';
      if (type === 'peaceful_sunrise') return 'sun_of_truth';
      if (type === 'sacred_tree') return 'cosmic_tree';
      if (type === 'cosmic_ocean') return 'calm_ocean';
      if (type === 'battlefield_dharma') return 'chariot_krishna_arjuna';
      if (type === 'inner_peace') return 'sacred_om';
    }

    return 'chariot_krishna_arjuna';
  };

  const doodleKey = getDoodleKey();

  // Render the specific SVG vector doodle
  const renderDoodle = () => {
    switch (doodleKey) {
      // 1. Chariot of Shri Krishna and Arjuna (BG 18.78)
      case 'chariot_krishna_arjuna':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="chariotGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
            </defs>
            <circle cx="100" cy="100" r="88" fill="#f59e0b" fillOpacity="0.06" />
            <circle cx="100" cy="100" r="76" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4 4" fill="none" opacity="0.4" />
            {/* Chariot Wheel */}
            <circle cx="140" cy="142" r="26" stroke="url(#chariotGold)" strokeWidth="3" fill="#1c1917" />
            <circle cx="140" cy="142" r="5" fill="#f59e0b" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((ang, i) => (
              <line 
                key={i} 
                x1="140" y1="142" 
                x2={140 + 22 * Math.cos((ang * Math.PI) / 180)} 
                y2={142 + 22 * Math.sin((ang * Math.PI) / 180)} 
                stroke="#f59e0b" strokeWidth="1.5" opacity="0.8" 
              />
            ))}
            {/* Chariot Body */}
            <path d="M 85 146 L 158 146 L 148 112 L 80 112 Z" fill="#292524" stroke="#d97706" strokeWidth="2" />
            {/* Krishna Silhouette with Peacock Crest */}
            <path d="M 125 90 Q 130 74 136 90 L 140 112 L 120 112 Z" fill="#0284c7" />
            <circle cx="131" cy="72" r="9" fill="#38bdf8" />
            <path d="M 131 63 Q 134 50 142 53 Q 135 60 131 63 Z" fill="#10b981" />
            {/* Arjuna with folded hands / bow */}
            <path d="M 94 95 Q 100 82 106 95 L 108 112 L 90 112 Z" fill="#fbbf24" />
            <circle cx="100" cy="78" r="8" fill="#d97706" />
            {/* Chariot Banner with Hanuman crest */}
            <line x1="150" y1="112" x2="150" y2="40" stroke="#f59e0b" strokeWidth="2" />
            <path d="M 150 42 Q 172 52 150 64 Z" fill="#ea580c" />
          </svg>
        );

      // 2. Karma Seeds (BG 2.47 - कर्मण्येवाधिकारस्ते)
      case 'karma_seeds':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-sm">
            <circle cx="100" cy="100" r="85" fill="#f59e0b" fillOpacity="0.05" />
            <circle cx="100" cy="100" r="70" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" fill="none" opacity="0.4" />
            {/* Two Open Offering Hands */}
            <path d="M 45 130 C 55 105, 80 115, 95 125 C 90 145, 60 155, 45 130 Z" fill="#78350f" opacity="0.8" />
            <path d="M 155 130 C 145 105, 120 115, 105 125 C 110 145, 140 155, 155 130 Z" fill="#78350f" opacity="0.8" />
            {/* Golden Sprout Emerging from Soil */}
            <path d="M 100 135 L 100 85" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
            <path d="M 100 100 Q 82 85 85 70 Q 100 78 100 95 Z" fill="#34d399" />
            <path d="M 100 92 Q 118 77 115 62 Q 100 70 100 87 Z" fill="#10b981" />
            {/* Glowing Golden Seeds Releasing to Sky */}
            <circle cx="100" cy="50" r="5.5" fill="#fbbf24" className="animate-pulse" />
            <circle cx="78" cy="58" r="4" fill="#f59e0b" />
            <circle cx="122" cy="58" r="4" fill="#f59e0b" />
            <circle cx="64" cy="72" r="3" fill="#fef08a" />
            <circle cx="136" cy="72" r="3" fill="#fef08a" />
            {/* Radiance Rays */}
            <path d="M 100 35 L 100 24 M 70 42 L 60 35 M 130 42 L 140 35" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
          </svg>
        );

      // 3. Titiksha Seasons / Dual Sun & Moon Balance (BG 2.14)
      case 'titiksha_seasons':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="85" fill="#f59e0b" fillOpacity="0.04" />
            <circle cx="100" cy="100" r="75" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" fill="none" opacity="0.3" />
            {/* Central Balance Scale */}
            <line x1="100" y1="45" x2="100" y2="155" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="50" y1="85" x2="150" y2="85" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="100" cy="85" r="4.5" fill="#fbbf24" />
            {/* Left: Golden Solar Warmth */}
            <circle cx="60" cy="118" r="18" fill="#f59e0b" opacity="0.9" />
            <circle cx="60" cy="118" r="12" fill="#fef08a" />
            {[0, 60, 120, 180, 240, 300].map((d, i) => (
              <line key={i} x1={60 + 20 * Math.cos(d * Math.PI / 180)} y1={118 + 20 * Math.sin(d * Math.PI / 180)} x2={60 + 26 * Math.cos(d * Math.PI / 180)} y2={118 + 26 * Math.sin(d * Math.PI / 180)} stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
            ))}
            {/* Right: Crystalline Moon of Endurance */}
            <path d="M 135 102 A 18 18 0 0 0 152 136 A 15 15 0 0 1 135 102 Z" fill="#38bdf8" />
            <circle cx="140" cy="118" r="2" fill="#ffffff" />
            <circle cx="148" cy="112" r="1.5" fill="#ffffff" />
            {/* Base Pedestal */}
            <path d="M 80 155 L 120 155 L 112 165 L 88 165 Z" fill="#78350f" />
          </svg>
        );

      // 4. Eternal Soul Spark (BG 2.20 - न जायते म्रियते वा)
      case 'eternal_atman':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <defs>
              <radialGradient id="atmanGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="30%" stopColor="#fef08a" />
                <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="100" cy="100" r="88" fill="url(#atmanGlow)" />
            {/* Sacred 8-pointed star of eternity */}
            <polygon points="100,30 118,82 170,100 118,118 100,170 82,118 30,100 82,82" fill="#f59e0b" opacity="0.35" />
            <polygon points="100,45 114,86 155,100 114,114 100,155 86,114 45,100 86,86" fill="#fbbf24" opacity="0.6" />
            {/* Central pure indestructible Soul Spark */}
            <circle cx="100" cy="100" r="16" fill="#fffbeb" />
            <circle cx="100" cy="100" r="10" fill="#ffffff" />
            <circle cx="100" cy="100" r="5" fill="#fef08a" />
            {/* Indestructible Shield Ring */}
            <circle cx="100" cy="100" r="62" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 4" fill="none" opacity="0.75" />
            <circle cx="100" cy="100" r="74" stroke="#fbbf24" strokeWidth="1" fill="none" opacity="0.4" />
          </svg>
        );

      // 5. Mind Waves to Stillness (BG 2.62 & 6.26)
      case 'mind_waves':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="85" fill="#38bdf8" fillOpacity="0.04" />
            {/* Concentric expanding ripples of awareness */}
            <circle cx="100" cy="100" r="75" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" fill="none" opacity="0.3" />
            <circle cx="100" cy="100" r="55" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 2" fill="none" opacity="0.5" />
            <circle cx="100" cy="100" r="35" stroke="#f59e0b" strokeWidth="2" fill="none" opacity="0.7" />
            {/* Central Third Eye / Diamond of Focus */}
            <polygon points="100,80 116,100 100,120 84,100" fill="#f59e0b" />
            <circle cx="100" cy="100" r="5" fill="#ffffff" />
            {/* Calmed horizontal ripples */}
            <path d="M 35 145 Q 65 140 100 145 T 165 145" stroke="#38bdf8" strokeWidth="2" fill="none" opacity="0.6" />
            <path d="M 50 160 Q 75 156 100 160 T 150 160" stroke="#38bdf8" strokeWidth="1.5" fill="none" opacity="0.4" />
          </svg>
        );

      // 6. Calm Insight Eye (BG 2.63 - क्रोधाद्भवति संमोहः)
      case 'calm_insight':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="85" fill="#f59e0b" fillOpacity="0.05" />
            {/* Dissipating storm clouds at top */}
            <path d="M 50 65 Q 65 50 85 58 Q 105 45 125 55 Q 145 48 155 65 Z" fill="#475569" opacity="0.4" />
            {/* Golden Eye of Discernment (Buddhi) */}
            <path d="M 40 110 Q 100 55 160 110 Q 100 165 40 110 Z" fill="#1c1917" stroke="#f59e0b" strokeWidth="2.5" />
            <circle cx="100" cy="110" r="26" fill="#d97706" />
            <circle cx="100" cy="110" r="16" fill="#1e1b4b" />
            <circle cx="100" cy="110" r="8" fill="#f59e0b" />
            <circle cx="103" cy="107" r="3" fill="#ffffff" />
            {/* Lotus Petals framing the eye of wisdom */}
            <path d="M 100 55 C 85 30, 115 30, 100 55 Z" fill="#fbbf24" opacity="0.8" />
          </svg>
        );

      // 7. Calm Deep Ocean (BG 2.70 - आपूर्यमाणमचलप्रतिष्ठं)
      case 'calm_ocean':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="85" fill="#0284c7" fillOpacity="0.05" />
            {/* Ocean Depths */}
            <circle cx="100" cy="100" r="78" stroke="#0284c7" strokeWidth="2" fill="none" opacity="0.4" />
            {/* Rushing Rivers entering smoothly without perturbing */}
            <path d="M 30 70 Q 70 85 100 95" stroke="#38bdf8" strokeWidth="2.5" fill="none" strokeDasharray="3 3" opacity="0.7" />
            <path d="M 170 70 Q 130 85 100 95" stroke="#38bdf8" strokeWidth="2.5" fill="none" strokeDasharray="3 3" opacity="0.7" />
            {/* Deep Stilled Ocean Horizon */}
            <line x1="32" y1="110" x2="168" y2="110" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="45" y1="125" x2="155" y2="125" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" />
            <line x1="65" y1="140" x2="135" y2="140" stroke="#0284c7" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="85" y1="155" x2="115" y2="155" stroke="#0284c7" strokeWidth="1" strokeLinecap="round" />
            {/* Radiant full moon reflecting calm */}
            <circle cx="100" cy="62" r="15" fill="#fef08a" />
            <circle cx="100" cy="62" r="22" stroke="#fef08a" strokeWidth="1" strokeDasharray="2 2" fill="none" opacity="0.5" />
          </svg>
        );

      // 8. Selfless Offering / Holy Arghya (BG 3.19)
      case 'selfless_offering':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="85" fill="#f59e0b" fillOpacity="0.05" />
            {/* Copper Kalash vessel tilted pouring water */}
            <path d="M 65 75 Q 85 60 100 70 L 90 95 Q 70 105 55 90 Z" fill="#b45309" stroke="#f59e0b" strokeWidth="2" />
            {/* Sacred Stream of Arghya Water */}
            <path d="M 98 72 Q 115 85 120 120" stroke="#38bdf8" strokeWidth="3" fill="none" strokeLinecap="round" />
            <circle cx="122" cy="130" r="3.5" fill="#38bdf8" />
            <circle cx="118" cy="142" r="2.5" fill="#38bdf8" />
            {/* Lotus Blossom Receiving the Water */}
            <path d="M 120 150 C 95 140, 95 125, 110 115 C 120 130, 125 140, 120 150 Z" fill="#fb7185" opacity="0.8" />
            <path d="M 120 150 C 145 140, 145 125, 130 115 C 120 130, 115 140, 120 150 Z" fill="#fb7185" opacity="0.8" />
            <circle cx="120" cy="145" r="4" fill="#fbbf24" />
          </svg>
        );

      // 9. Guiding Torch & Light (BG 3.21 - यद्यदाचरति श्रेष्ठः)
      case 'guiding_light':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="85" fill="#f59e0b" fillOpacity="0.05" />
            {/* Sacred Lighthouse / Beacon Pillar */}
            <path d="M 90 155 L 110 155 L 106 80 L 94 80 Z" fill="#78350f" stroke="#d97706" strokeWidth="2" />
            {/* Lantern Top */}
            <polygon points="90,80 110,80 115,65 85,65" fill="#b45309" />
            {/* Radiant Flame emitting 360 beams */}
            <circle cx="100" cy="55" r="14" fill="#fbbf24" />
            <circle cx="100" cy="55" r="8" fill="#ffffff" />
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((d, i) => (
              <line key={i} x1={100 + 18 * Math.cos(d * Math.PI / 180)} y1={55 + 18 * Math.sin(d * Math.PI / 180)} x2={100 + 32 * Math.cos(d * Math.PI / 180)} y2={55 + 32 * Math.sin(d * Math.PI / 180)} stroke="#f59e0b" strokeWidth={i % 3 === 0 ? "2" : "1"} opacity="0.7" />
            ))}
            {/* Stepping Stones / Path */}
            <ellipse cx="100" cy="170" rx="35" ry="6" fill="#292524" opacity="0.6" />
          </svg>
        );

      // 10. Dharma Compass (BG 3.35 - श्रेयान्स्वधर्मो विगुणः)
      case 'dharma_compass':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="85" fill="#f59e0b" fillOpacity="0.05" />
            <circle cx="100" cy="100" r="76" stroke="#f59e0b" strokeWidth="2.5" fill="none" />
            <circle cx="100" cy="100" r="66" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4 4" fill="none" opacity="0.6" />
            {/* Compass Points */}
            <polygon points="100,32 108,95 100,100 92,95" fill="#ea580c" />
            <polygon points="100,168 108,105 100,100 92,105" fill="#78350f" />
            <polygon points="168,100 105,108 100,100 105,92" fill="#d97706" />
            <polygon points="32,100 95,108 100,100 95,92" fill="#d97706" />
            {/* Golden Core */}
            <circle cx="100" cy="100" r="9" fill="#fbbf24" stroke="#78350f" strokeWidth="2" />
            <circle cx="100" cy="100" r="3.5" fill="#ffffff" />
          </svg>
        );

      // 11. Sudarshana Chakra (BG 4.7 - यदा यदा हि धर्मस्य)
      case 'sudarshana_chakra':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <defs>
              <linearGradient id="chakraGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#ea580c" />
              </linearGradient>
            </defs>
            <circle cx="100" cy="100" r="88" fill="url(#chakraGrad)" fillOpacity="0.08" />
            {/* 12 Flaming Serrated Blades */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((d, i) => {
              const rad = (d * Math.PI) / 180;
              const x = 100 + 74 * Math.cos(rad);
              const y = 100 + 74 * Math.sin(rad);
              return (
                <path 
                  key={i} 
                  d={`M ${x} ${y} L ${x + 10 * Math.cos(rad + 0.4)} ${y + 10 * Math.sin(rad + 0.4)} L ${x - 5 * Math.sin(rad)} ${y + 5 * Math.cos(rad)} Z`} 
                  fill="#f59e0b" 
                />
              );
            })}
            <circle cx="100" cy="100" r="68" stroke="url(#chakraGrad)" strokeWidth="3" fill="none" />
            <circle cx="100" cy="100" r="54" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3" fill="none" opacity="0.6" />
            <circle cx="100" cy="100" r="26" fill="#1c1917" stroke="url(#chakraGrad)" strokeWidth="2.5" />
            <circle cx="100" cy="100" r="10" fill="#fbbf24" />
            <circle cx="100" cy="100" r="4" fill="#ffffff" />
          </svg>
        );

      // 12. Still Dewdrop (BG 4.18 - कर्मण्यकर्म यः पश्येद्)
      case 'still_dewdrop':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="85" fill="#10b981" fillOpacity="0.04" />
            {/* Stylized Curved Leaf */}
            <path d="M 40 145 C 50 80, 120 60, 165 75 C 140 130, 80 160, 40 145 Z" fill="#047857" stroke="#10b981" strokeWidth="2" />
            <path d="M 40 145 Q 100 115 165 75" stroke="#34d399" strokeWidth="2" fill="none" />
            {/* Pristine Spherical Dewdrop Sitting Motionless */}
            <circle cx="115" cy="105" r="18" fill="#38bdf8" opacity="0.8" />
            <circle cx="115" cy="105" r="14" fill="#e0f2fe" />
            <circle cx="111" cy="99" r="4.5" fill="#ffffff" />
            {/* Concentric subtle aura of absolute stillness */}
            <circle cx="115" cy="105" r="30" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2 3" fill="none" opacity="0.4" />
          </svg>
        );

      // 13. Sacred Grantha / Ancient Palm Manuscript (BG 4.38 - न हि ज्ञानेन सदृशं)
      case 'sacred_grantha':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="85" fill="#f59e0b" fillOpacity="0.05" />
            {/* Ancient Palm Leaf Manuscript Bound by Sacred Cord */}
            <rect x="35" y="80" width="130" height="42" rx="4" fill="#78350f" stroke="#d97706" strokeWidth="2" />
            <rect x="42" y="86" width="116" height="30" rx="2" fill="#fef3c7" />
            {/* Sanskrit text lines */}
            <line x1="50" y1="95" x2="148" y2="95" stroke="#92400e" strokeWidth="2" strokeLinecap="round" />
            <line x1="50" y1="104" x2="135" y2="104" stroke="#92400e" strokeWidth="2" strokeLinecap="round" />
            {/* Central Binding Thread & Pearl */}
            <line x1="100" y1="70" x2="100" y2="132" stroke="#ea580c" strokeWidth="2.5" />
            <circle cx="100" cy="100" r="5" fill="#fbbf24" stroke="#78350f" strokeWidth="1.5" />
            {/* Sacred Peacock Quill */}
            <path d="M 120 70 Q 150 40 165 35 Q 155 55 140 75 Z" fill="#0284c7" />
            <circle cx="150" cy="48" r="4" fill="#10b981" />
          </svg>
        );

      // 14. Pure Lotus Leaf in Water (BG 5.10 - पद्मपत्रमिवाम्भसा)
      case 'pure_lotus_leaf':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="85" fill="#10b981" fillOpacity="0.05" />
            {/* Round floating Lotus Leaf with V-notch */}
            <path d="M 100 100 L 100 35 A 65 65 0 1 1 75 42 Z" fill="#059669" stroke="#34d399" strokeWidth="2.5" />
            {/* Veins of the leaf */}
            {[30, 75, 120, 165, 210, 255, 300].map((deg, i) => (
              <line key={i} x1="100" y1="100" x2={100 + 58 * Math.cos(deg * Math.PI / 180)} y2={100 + 58 * Math.sin(deg * Math.PI / 180)} stroke="#10b981" strokeWidth="1.5" opacity="0.6" />
            ))}
            {/* Floating Mercury-like Water Pearl on Leaf */}
            <circle cx="115" cy="85" r="12" fill="#38bdf8" opacity="0.9" />
            <circle cx="115" cy="85" r="9" fill="#e0f2fe" />
            <circle cx="112" cy="81" r="3.5" fill="#ffffff" />
            {/* Water Ripple Rings */}
            <ellipse cx="100" cy="155" rx="55" ry="8" stroke="#38bdf8" strokeWidth="1.5" fill="none" opacity="0.4" />
          </svg>
        );

      // 15. Ascending Soul / Soaring Swan (BG 6.5 - उद्धरेदात्मनात्मानं)
      case 'ascending_soul':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="85" fill="#f59e0b" fillOpacity="0.05" />
            {/* Dawn Sun behind mountain */}
            <circle cx="100" cy="120" r="45" fill="#f59e0b" opacity="0.7" />
            <polygon points="30,165 85,120 140,165" fill="#292524" />
            <polygon points="90,165 145,130 185,165" fill="#1c1917" />
            {/* Majestic Soaring Swan (Hamsa) with wings aloft */}
            <path d="M 100 65 Q 115 50 140 45 Q 120 70 105 75 L 100 85 L 95 75 Q 80 70 60 45 Q 85 50 100 65 Z" fill="#ffffff" stroke="#f59e0b" strokeWidth="1.5" />
            <circle cx="100" cy="55" r="5" fill="#fbbf24" />
            {/* Rising Aura Rays */}
            <line x1="100" y1="40" x2="100" y2="25" stroke="#fef08a" strokeWidth="2" strokeLinecap="round" />
            <line x1="75" y1="45" x2="65" y2="35" stroke="#fef08a" strokeWidth="2" strokeLinecap="round" />
            <line x1="125" y1="45" x2="135" y2="35" stroke="#fef08a" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );

      // 16. Two Divine Birds on Tree (BG 6.6 - बन्धुरात्मात्मनस्तस्य)
      case 'two_birds':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="85" fill="#10b981" fillOpacity="0.05" />
            {/* Tree Branch */}
            <path d="M 30 115 Q 90 125 170 95" stroke="#78350f" strokeWidth="4" fill="none" strokeLinecap="round" />
            {/* Bird 1: Witness Soul (Calm, Golden, Watching) */}
            <ellipse cx="80" cy="98" rx="14" ry="10" fill="#fbbf24" />
            <circle cx="72" cy="90" r="7" fill="#f59e0b" />
            <circle cx="70" cy="89" r="1.5" fill="#ffffff" />
            <polygon points="65,90 58,92 65,94" fill="#b45309" />
            {/* Bird 2: Active Soul (Eating sweet berry) */}
            <ellipse cx="125" cy="85" rx="14" ry="10" fill="#38bdf8" />
            <circle cx="135" cy="78" r="7" fill="#0284c7" />
            <circle cx="137" cy="77" r="1.5" fill="#ffffff" />
            <polygon points="142,78 149,80 142,82" fill="#ea580c" />
            <circle cx="152" cy="85" r="3.5" fill="#ef4444" />
            {/* Sacred Peepal Leaves */}
            <path d="M 60 115 Q 50 135 65 140 Q 75 130 60 115 Z" fill="#10b981" />
            <path d="M 140 100 Q 150 120 135 125 Q 125 115 140 100 Z" fill="#10b981" />
          </svg>
        );

      // 17. Tamed Steed / Self-Mastery (BG 6.26)
      case 'tamed_mind':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="85" fill="#f59e0b" fillOpacity="0.05" />
            {/* Majestic White Stallion Head */}
            <path d="M 75 150 Q 80 100 110 80 Q 130 75 135 90 Q 140 105 125 115 L 115 150 Z" fill="#ffffff" stroke="#d97706" strokeWidth="2" />
            {/* Stallion Mane */}
            <path d="M 85 95 Q 70 105 80 120 M 90 85 Q 75 92 85 105" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
            {/* Gentle Golden Reins guiding it back to center */}
            <path d="M 125 105 Q 145 120 165 115" stroke="#ea580c" strokeWidth="2.5" fill="none" />
            <circle cx="125" cy="105" r="4" fill="#fbbf24" />
            <circle cx="118" cy="92" r="2.5" fill="#1c1917" />
          </svg>
        );

      // 18. Steady Flame in Windless Place (BG 6.35 - यथा दीपो निवातस्थो)
      case 'steady_flame':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <defs>
              <linearGradient id="deepakFlame" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#d97706" />
                <stop offset="45%" stopColor="#f59e0b" />
                <stop offset="85%" stopColor="#fef08a" />
                <stop offset="100%" stopColor="#ffffff" />
              </linearGradient>
            </defs>
            <circle cx="100" cy="100" r="80" fill="#f59e0b" fillOpacity="0.07" />
            {/* Earthen Lamp (Mitti ka Diya) */}
            <path d="M 50 142 Q 100 172 150 142 Q 100 148 50 142 Z" fill="#78350f" stroke="#d97706" strokeWidth="2.5" />
            {/* Perfectly Steady Flame */}
            <path d="M 100 142 C 72 120, 75 75, 100 35 C 125 75, 128 120, 100 142 Z" fill="url(#deepakFlame)" />
            <path d="M 100 140 C 86 122, 88 88, 100 62 C 112 88, 114 122, 100 140 Z" fill="#fffbeb" />
            {/* Radiance Halo */}
            <circle cx="100" cy="85" r="45" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4 4" fill="none" opacity="0.4" />
          </svg>
        );

      // 19. Pearls on a Golden Thread (BG 7.7 - सूत्रे मणिगणा इव)
      case 'pearls_thread':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="85" fill="#f59e0b" fillOpacity="0.05" />
            {/* Single Golden Celestial Thread */}
            <path d="M 30 130 Q 100 45 170 130" stroke="#f59e0b" strokeWidth="2.5" fill="none" />
            {/* Radiant Pearls Strung along the thread */}
            {[
              { x: 45, y: 114 }, { x: 68, y: 88 }, { x: 100, y: 72 }, { x: 132, y: 88 }, { x: 155, y: 114 }
            ].map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r={i === 2 ? 14 : 10} fill="#ffffff" stroke="#f59e0b" strokeWidth="1.5" />
                <circle cx={p.x} cy={p.y} r={i === 2 ? 10 : 7} fill="#fef3c7" />
                <circle cx={p.x - 3} cy={p.y - 3} r={i === 2 ? 3.5 : 2.5} fill="#ffffff" />
              </g>
            ))}
          </svg>
        );

      // 20. Divine Protection / Abhaya Mudra (BG 9.22 - योगक्षेमं वहाम्यहम्)
      case 'divine_shelter':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="85" fill="#38bdf8" fillOpacity="0.06" />
            {/* Protective Divine Umbrella Canopy */}
            <path d="M 40 85 Q 100 35 160 85 Z" fill="#d97706" stroke="#f59e0b" strokeWidth="2" />
            <line x1="100" y1="35" x2="100" y2="155" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
            {/* Abhaya Mudra (Blessing Hand of Fearlessness) */}
            <path d="M 85 145 L 85 110 Q 85 100 95 100 L 105 100 Q 115 100 115 110 L 115 145 Z" fill="#fbbf24" stroke="#b45309" strokeWidth="1.5" />
            <circle cx="100" cy="120" r="6" fill="#ea580c" />
            <circle cx="100" cy="120" r="2.5" fill="#fef08a" />
          </svg>
        );

      // 21. Loving Offering / Patram Pushpam (BG 9.26 - पत्रं पुष्पं फलं तोयं)
      case 'loving_offering':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="85" fill="#f59e0b" fillOpacity="0.05" />
            {/* Puja Thali */}
            <ellipse cx="100" cy="140" rx="60" ry="18" fill="#78350f" stroke="#f59e0b" strokeWidth="2.5" />
            <ellipse cx="100" cy="138" rx="52" ry="14" fill="#b45309" />
            {/* 1. Patram (Green Bilva/Tulsi Leaf) */}
            <path d="M 65 130 C 50 115, 65 95, 75 105 C 80 120, 75 130, 65 130 Z" fill="#10b981" />
            {/* 2. Pushpam (Red Fragrant Lotus) */}
            <circle cx="95" cy="115" r="12" fill="#f43f5e" />
            <circle cx="95" cy="115" r="5" fill="#fbbf24" />
            {/* 3. Phalam (Golden Fruit) */}
            <circle cx="125" cy="120" r="10" fill="#ea580c" />
            <circle cx="122" cy="116" r="2.5" fill="#fef08a" />
            {/* 4. Toyam (Holy Water Cup with Dewdrops) */}
            <path d="M 135 125 L 145 125 L 142 140 L 138 140 Z" fill="#38bdf8" />
          </svg>
        );

      // 22. Inner Heart Shrine / Antaryami (BG 10.20 - अहमात्मा गुडाकेश)
      case 'heart_shrine':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="85" fill="#f43f5e" fillOpacity="0.05" />
            {/* 8-Petal Heart Lotus */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((d, i) => (
              <path key={i} d={`M 100 100 Q ${100 + 40 * Math.cos((d - 20) * Math.PI / 180)} ${100 + 40 * Math.sin((d - 20) * Math.PI / 180)} ${100 + 55 * Math.cos(d * Math.PI / 180)} ${100 + 55 * Math.sin(d * Math.PI / 180)} Q ${100 + 40 * Math.cos((d + 20) * Math.PI / 180)} ${100 + 40 * Math.sin((d + 20) * Math.PI / 180)} 100 100 Z`} fill="#fb7185" opacity="0.75" />
            ))}
            {/* Inner Golden Temple Sanctuary */}
            <circle cx="100" cy="100" r="26" fill="#1c1917" stroke="#f59e0b" strokeWidth="2" />
            {/* Burning Flame of Divine Consciousness */}
            <path d="M 100 114 C 90 105, 92 88, 100 78 C 108 88, 110 105, 100 114 Z" fill="#fbbf24" />
            <circle cx="100" cy="98" r="4" fill="#ffffff" />
          </svg>
        );

      // 23. Wheel of Cosmic Time / Kala Chakra (BG 11.32 - कालोऽस्मि)
      case 'kala_chakra':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="85" fill="#312e81" fillOpacity="0.1" />
            {/* Outer Constellation Ring */}
            <circle cx="100" cy="100" r="78" stroke="#818cf8" strokeWidth="2" strokeDasharray="5 3" fill="none" />
            <circle cx="100" cy="100" r="62" stroke="#f59e0b" strokeWidth="1.5" fill="none" />
            {/* Cosmic Spiral Galaxy Arms */}
            <path d="M 100 100 Q 130 70 160 90 M 100 100 Q 70 130 40 110 M 100 100 Q 70 70 90 40 M 100 100 Q 130 130 110 160" stroke="#c084fc" strokeWidth="2" fill="none" opacity="0.8" />
            {/* Central Infinity Node */}
            <circle cx="100" cy="100" r="14" fill="#1e1b4b" stroke="#f59e0b" strokeWidth="2" />
            <circle cx="100" cy="100" r="5" fill="#fef08a" />
          </svg>
        );

      // 24. Universal Compassion (BG 12.13 - अद्वेष्टा सर्वभूतानां)
      case 'universal_love':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="85" fill="#10b981" fillOpacity="0.05" />
            {/* Gentle Hand Resting in Peace */}
            <path d="M 50 140 C 65 115, 95 120, 115 130 L 110 145 L 50 155 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
            {/* Peaceful Forest Deer Silhouette */}
            <ellipse cx="130" cy="120" rx="18" ry="12" fill="#78350f" />
            <circle cx="144" cy="105" r="8" fill="#b45309" />
            <path d="M 146 100 L 152 92 M 148 100 L 155 96" stroke="#b45309" strokeWidth="1.5" />
            {/* Little Forest Bird touching the hand */}
            <circle cx="95" cy="112" r="6" fill="#38bdf8" />
            <polygon points="90,112 85,114 90,116" fill="#f59e0b" />
            {/* Blooming Jasmine Vine */}
            <path d="M 40 80 Q 80 70 120 65" stroke="#10b981" strokeWidth="2" fill="none" />
            <circle cx="80" cy="72" r="4" fill="#ffffff" />
            <circle cx="105" cy="68" r="4" fill="#ffffff" />
          </svg>
        );

      // 25. Serene Alpine Lake (BG 12.15 - यस्मान्नोद्विजते लोको)
      case 'serene_lake':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="85" fill="#0284c7" fillOpacity="0.06" />
            {/* Mountain Range */}
            <polygon points="25,120 75,65 125,120" fill="#334155" />
            <polygon points="75,65 85,82 65,82" fill="#ffffff" />
            <polygon points="85,120 135,75 175,120" fill="#1e293b" />
            <polygon points="135,75 142,88 128,88" fill="#ffffff" />
            {/* Perfectly Still Mirror Lake Reflecting Stars */}
            <rect x="25" y="120" width="150" height="50" rx="4" fill="#0369a1" opacity="0.8" />
            <line x1="30" y1="120" x2="170" y2="120" stroke="#38bdf8" strokeWidth="2" />
            <circle cx="100" cy="45" r="2.5" fill="#ffffff" />
            <circle cx="65" cy="50" r="2" fill="#ffffff" />
            <circle cx="145" cy="48" r="2" fill="#ffffff" />
          </svg>
        );

      // 26. Transcendence of Three Gunas (BG 14.22)
      case 'gunas_transcendence':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="85" fill="#f59e0b" fillOpacity="0.05" />
            {/* Triquetra Knot / 3 Gunas (Sattva-White, Rajas-Red, Tamas-Dark) */}
            <circle cx="100" cy="72" r="32" stroke="#ffffff" strokeWidth="3" fill="none" opacity="0.9" />
            <circle cx="76" cy="120" r="32" stroke="#ef4444" strokeWidth="3" fill="none" opacity="0.9" />
            <circle cx="124" cy="120" r="32" stroke="#64748b" strokeWidth="3" fill="none" opacity="0.9" />
            {/* Transcendent Golden Core Center */}
            <circle cx="100" cy="104" r="10" fill="#fbbf24" />
            <circle cx="100" cy="104" r="4" fill="#ffffff" />
          </svg>
        );

      // 27. Cosmic Tree / Ashvattha (BG 15.1 - ऊर्ध्वमूलमधःशाखम्)
      case 'cosmic_tree':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="85" fill="#10b981" fillOpacity="0.05" />
            {/* Roots reaching Upwards into the Heavens */}
            <path d="M 100 80 L 100 45 M 100 70 Q 75 55 60 40 M 100 70 Q 125 55 140 40" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
            <circle cx="100" cy="38" r="5" fill="#fbbf24" />
            {/* Trunk and Canopy Spreading Downwards into the World */}
            <path d="M 100 80 L 100 135" stroke="#78350f" strokeWidth="5" strokeLinecap="round" />
            <path d="M 100 110 Q 60 120 45 145 M 100 110 Q 140 120 155 145" stroke="#78350f" strokeWidth="3.5" strokeLinecap="round" />
            {/* Lush sacred green leaves */}
            {[
              { x: 45, y: 145 }, { x: 70, y: 155 }, { x: 100, y: 160 }, { x: 130, y: 155 }, { x: 155, y: 145 }
            ].map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r="10" fill="#10b981" opacity="0.85" />
            ))}
          </svg>
        );

      // 28. Sacred Om (BG 15.15 - सर्वस्य चाहं हृदि सन्निविष्टो)
      case 'sacred_om':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <defs>
              <linearGradient id="omGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#ea580c" />
              </linearGradient>
            </defs>
            <circle cx="100" cy="100" r="85" fill="url(#omGrad)" fillOpacity="0.08" />
            <circle cx="100" cy="100" r="75" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 4" fill="none" opacity="0.6" />
            {/* Authentic Sanskrit OM (ॐ) Linework */}
            <path d="M 75 80 C 65 65, 85 50, 100 65 C 110 52, 130 65, 120 85 C 110 100, 85 110, 80 135 C 75 155, 110 155, 115 135" stroke="url(#omGrad)" strokeWidth="6" strokeLinecap="round" fill="none" />
            <path d="M 105 105 Q 125 105 140 85" stroke="url(#omGrad)" strokeWidth="5" strokeLinecap="round" fill="none" />
            {/* Chandra-Bindu */}
            <path d="M 125 55 Q 140 65 155 55" stroke="url(#omGrad)" strokeWidth="4" strokeLinecap="round" fill="none" />
            <circle cx="140" cy="45" r="4.5" fill="#fbbf24" />
          </svg>
        );

      // 29. Three Gateways of Ruin Overcome (BG 16.21 - त्रिविधं नरकस्येदं द्वारं)
      case 'three_gates':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="85" fill="#f59e0b" fillOpacity="0.05" />
            {/* Grand Archway */}
            <path d="M 60 155 L 60 90 Q 100 50 140 90 L 140 155" stroke="#d97706" strokeWidth="4" fill="none" />
            <line x1="50" y1="155" x2="150" y2="155" stroke="#d97706" strokeWidth="4" strokeLinecap="round" />
            {/* 3 Golden Keys of Self-Mastery (Conquering Lust, Wrath, Greed) */}
            <line x1="80" y1="95" x2="80" y2="135" stroke="#fbbf24" strokeWidth="2.5" />
            <circle cx="80" cy="95" r="5" fill="#f59e0b" />
            <line x1="100" y1="85" x2="100" y2="135" stroke="#fbbf24" strokeWidth="3" />
            <circle cx="100" cy="85" r="6" fill="#f59e0b" />
            <line x1="120" y1="95" x2="120" y2="135" stroke="#fbbf24" strokeWidth="2.5" />
            <circle cx="120" cy="95" r="5" fill="#f59e0b" />
            {/* Radiant Sun Emerging Beyond the Archway */}
            <circle cx="100" cy="120" r="16" fill="#fffbeb" />
            <circle cx="100" cy="120" r="10" fill="#fbbf24" />
          </svg>
        );

      // 30. Joyful Enlightened Soul / Prasannatma (BG 18.54 - ब्रह्मभूतः प्रसन्नात्मा)
      case 'prasannatma':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="85" fill="#f59e0b" fillOpacity="0.06" />
            {/* Radiant Expanding Golden Aura Circles */}
            <circle cx="100" cy="80" r="48" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4 4" fill="none" opacity="0.4" />
            <circle cx="100" cy="80" r="34" stroke="#fbbf24" strokeWidth="1.5" fill="none" opacity="0.6" />
            {/* Yogi Head in Radiant Equanimity */}
            <circle cx="100" cy="70" r="12" fill="#d97706" />
            <circle cx="100" cy="69" r="2.5" fill="#ffffff" />
            {/* Seated Body in Padmasana */}
            <path d="M 85 92 Q 100 86 115 92 L 128 135 L 72 135 Z" fill="#b45309" />
            <path d="M 52 138 C 65 125, 135 125, 148 138 C 130 152, 70 152, 52 138 Z" fill="#78350f" />
            {/* Hands in Dhyana Mudra with Glowing Jewel */}
            <circle cx="100" cy="126" r="6" fill="#fbbf24" />
          </svg>
        );

      // 31. Charan Paduka / Lotus Feet of Shri Krishna (BG 18.66 - सर्वधर्मान्परित्यज्य)
      case 'charan_paduka':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="85" fill="#f59e0b" fillOpacity="0.05" />
            {/* Pair of Sacred Golden Paduka (Wooden Sandals / Feet) */}
            <ellipse cx="82" cy="115" rx="15" ry="32" fill="#78350f" stroke="#f59e0b" strokeWidth="2" />
            <circle cx="82" cy="94" r="5" fill="#fbbf24" />
            <ellipse cx="118" cy="115" rx="15" ry="32" fill="#78350f" stroke="#f59e0b" strokeWidth="2" />
            <circle cx="118" cy="94" r="5" fill="#fbbf24" />
            {/* Tulsi Leaves & Flowers Surrounding the Feet */}
            <path d="M 70 148 Q 82 138 94 148 Z" fill="#10b981" />
            <path d="M 106 148 Q 118 138 130 148 Z" fill="#10b981" />
            <circle cx="100" cy="70" r="8" fill="#f43f5e" />
            <circle cx="100" cy="70" r="3" fill="#fbbf24" />
          </svg>
        );

      // 32. Divine Flute / Bansuri
      case 'divine_flute':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="85" fill="#38bdf8" fillOpacity="0.05" />
            {/* Peacock Feather */}
            <path d="M 95 85 C 70 40, 140 30, 125 75 Z" fill="#059669" opacity="0.75" />
            <path d="M 100 75 C 85 48, 130 42, 120 70 Z" fill="#0284c7" opacity="0.85" />
            <circle cx="108" cy="58" r="6" fill="#f59e0b" />
            <circle cx="108" cy="58" r="3" fill="#1e1b4b" />
            {/* Golden Flute */}
            <rect x="40" y="112" width="125" height="12" rx="6" transform="rotate(-18 100 115)" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5" />
            {[70, 85, 100, 115, 130, 145].map((x, i) => (
              <circle key={i} cx={x} cy="118" r="2" transform="rotate(-18 100 115)" fill="#78350f" />
            ))}
          </svg>
        );

      // 33. Sacred Trishul & Yajna Fire
      case 'sacred_trishul':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="85" fill="#ea580c" fillOpacity="0.06" />
            {/* Central Spear */}
            <line x1="100" y1="40" x2="100" y2="160" stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round" />
            <polygon points="100,35 94,52 106,52" fill="#d97706" />
            {/* Prongs */}
            <path d="M 70 65 Q 85 85 100 85 Q 115 85 130 65" stroke="#f59e0b" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <polygon points="70,60 64,74 76,74" fill="#d97706" />
            <polygon points="130,60 124,74 136,74" fill="#d97706" />
            {/* Saffron Banner Ribbon */}
            <path d="M 100 95 Q 125 105 115 125" stroke="#ea580c" strokeWidth="3" fill="none" strokeLinecap="round" />
          </svg>
        );

      // 34. Sacred Kalash
      case 'sacred_kalash':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="85" fill="#f59e0b" fillOpacity="0.05" />
            {/* Coconut on top */}
            <ellipse cx="100" cy="65" rx="16" ry="18" fill="#78350f" />
            {/* Mango Leaves spreading outward */}
            <path d="M 100 80 Q 70 65 60 85 Q 80 85 100 80 Z" fill="#10b981" />
            <path d="M 100 80 Q 130 65 140 85 Q 120 85 100 80 Z" fill="#10b981" />
            {/* Ornate Copper Kalash Pot */}
            <path d="M 75 90 L 125 90 L 135 145 Q 100 160 65 145 Z" fill="#b45309" stroke="#f59e0b" strokeWidth="2.5" />
            {/* Sacred Swastika emblem on Kalash */}
            <circle cx="100" cy="120" r="12" fill="#78350f" />
            <path d="M 94 120 L 106 120 M 100 114 L 100 126" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );

      // 35. Sacred Peepal Leaf
      case 'peepal_leaf':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="85" fill="#10b981" fillOpacity="0.05" />
            {/* Heart-shaped Peepal Leaf with distinctive elongated tip */}
            <path d="M 100 40 Q 100 65 100 155 M 100 40 C 135 70, 160 110, 125 145 C 105 160, 95 160, 75 145 C 40 110, 65 70, 100 40 Z" fill="#059669" stroke="#34d399" strokeWidth="2" />
            <circle cx="100" cy="115" r="8" fill="#38bdf8" />
            <circle cx="98" cy="113" r="2.5" fill="#ffffff" />
          </svg>
        );

      // 36. Sun of Truth (Satyamev Jayate)
      case 'sun_of_truth':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="85" fill="#f59e0b" fillOpacity="0.06" />
            <circle cx="100" cy="100" r="42" fill="#f59e0b" />
            <circle cx="100" cy="100" r="32" fill="#fbbf24" />
            <circle cx="100" cy="100" r="16" fill="#fffbeb" />
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
              <line key={i} x1={100 + 46 * Math.cos(deg * Math.PI / 180)} y1={100 + 46 * Math.sin(deg * Math.PI / 180)} x2={100 + 64 * Math.cos(deg * Math.PI / 180)} y2={100 + 64 * Math.sin(deg * Math.PI / 180)} stroke="#f59e0b" strokeWidth={i % 2 === 0 ? "3" : "1.5"} strokeLinecap="round" />
            ))}
          </svg>
        );

      // 37. Gandiva Bow of Arjuna
      case 'gandiva_bow':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="80" fill="#f59e0b" fillOpacity="0.05" />
            {/* Target concentric rings */}
            <circle cx="155" cy="55" r="24" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" fill="none" opacity="0.4" />
            <circle cx="155" cy="55" r="12" stroke="#f59e0b" strokeWidth="1.5" fill="none" opacity="0.6" />
            <circle cx="155" cy="55" r="4" fill="#ef4444" />
            {/* Gandiva Bow */}
            <path d="M 50 155 Q 35 100 95 45" stroke="#f59e0b" strokeWidth="4" fill="none" strokeLinecap="round" />
            <line x1="50" y1="155" x2="95" y2="45" stroke="#fef08a" strokeWidth="1.5" />
            {/* Arrow on String */}
            <line x1="60" y1="110" x2="150" y2="60" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
            <polygon points="150,60 138,55 142,67" fill="#f59e0b" />
          </svg>
        );

      // 38. Sacred River Ganga & Himalaya
      case 'sacred_river':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="85" fill="#38bdf8" fillOpacity="0.05" />
            <polygon points="25,130 80,60 135,130" fill="#334155" />
            <polygon points="80,60 90,80 70,80" fill="#ffffff" />
            <polygon points="90,130 145,75 185,130" fill="#1e293b" />
            <polygon points="145,75 152,90 138,90" fill="#ffffff" />
            {/* Holy River Ganga flowing down */}
            <path d="M 80 85 Q 85 110 75 130 T 95 170" stroke="#38bdf8" strokeWidth="4" fill="none" strokeLinecap="round" />
          </svg>
        );

      // 39. Guru Lamp of Wisdom
      case 'guru_lamp':
      default:
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="85" fill="#f59e0b" fillOpacity="0.05" />
            {/* Ancient Oil Lamp on carved wooden stand */}
            <path d="M 85 155 L 115 155 L 105 115 L 95 115 Z" fill="#78350f" />
            <ellipse cx="100" cy="115" rx="35" ry="10" fill="#b45309" stroke="#f59e0b" strokeWidth="2" />
            {/* Glowing Golden Flame */}
            <path d="M 100 115 C 80 95, 85 65, 100 35 C 115 65, 120 95, 100 115 Z" fill="#fbbf24" />
            <circle cx="100" cy="80" r="6" fill="#ffffff" />
          </svg>
        );
    }
  };

  return (
    <div className={`relative flex items-center justify-center select-none ${getContainerSize()} ${className}`}>
      {renderDoodle()}
    </div>
  );
};
