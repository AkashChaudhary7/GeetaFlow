import { Shloka } from '../types';

export interface TranslatedContent {
  meaning: string;
  takeaway: string;
  bhavarth?: string;
  labelMeaning: string;
  labelTakeaway: string;
  labelBhavarth: string;
  labelWordMeanings: string;
  readTimeEstimate: string;
}

// Famous core verses high-accuracy English and Hinglish dictionary
const VERSE_TRANSLATIONS: Record<string, {
  enMeaning: string;
  enTakeaway: string;
  hinglishMeaning: string;
  hinglishTakeaway: string;
}> = {
  'bg_2_47': {
    enMeaning: 'You have a right only to work, never to its fruits. Let not the fruits of action be your motive, nor let your attachment be to inaction.',
    enTakeaway: 'Focus 100% on your daily craft and process today. Release worry over the end outcome.',
    hinglishMeaning: 'Aapka adhikar sirf karm karne mein hai, falon par kabhi nahi. Isliye fal ki chinta chodkar pure man se apna kaam karein.',
    hinglishTakeaway: 'Process par focus karein, result ki chinta dimag se nikaal dein.'
  },
  'bg_2_14': {
    enMeaning: 'Contact of the senses with their objects gives rise to cold and heat, pleasure and pain. They are temporary and transient; learn to endure them patiently, O Bharata.',
    enTakeaway: 'Tough phases and emotional swings are fleeting seasons. Breathe through difficulties with steady patience.',
    hinglishMeaning: 'Indriyon ke sparsh se hone wale dukh-sukh aane jaane wale hain. Inhe shanti aur dhairya se sahana seekhein.',
    hinglishTakeaway: 'Mushkil waqt hamesha nahi rehta. Dhairya rakhein, yeh sthiti bhi badal jayegi.'
  },
  'bg_6_5': {
    enMeaning: 'Elevate yourself by your own mind, and do not degrade yourself. For the mind alone is the friend of the self, and the mind alone is the enemy of the self.',
    enTakeaway: 'Be your own strongest advocate today. Self-discipline transforms self-doubt into quiet mastery.',
    hinglishMeaning: 'Apne aap ko khud uthaiye, kabhi niraash mat hone dijiye. Kyunki aapka apna mann hi aapka sabse bada dost ya dushman hai.',
    hinglishTakeaway: 'Apne dimaag ko positive rakhein aur self-doubt ko door bhagayein.'
  },
  'bg_2_62': {
    enMeaning: 'Dwelling on sense objects generates attachment for them. From attachment springs desire, and from unfulfilled desire flares anger.',
    enTakeaway: 'Notice where your digital attention drifts today. Guard your focus against continuous craving.',
    hinglishMeaning: 'Jab mann lagataar vishayon mein ulajhta hai toh aasakti paida hoti hai, aur jab ichha poori nahi hoti toh krodh janm leta hai.',
    hinglishTakeaway: 'Social media aur bekar ki chintaon se apna dhyan hataakar shant rahein.'
  },
  'bg_2_63': {
    enMeaning: 'From anger arises delusion; from delusion comes loss of memory; from loss of memory, destruction of intellect; and from loss of intellect, a person is ruined.',
    enTakeaway: 'Pause for 5 seconds before speaking in anger. Protect your clarity and inner peace.',
    hinglishMeaning: 'Gusse se samajh nasht hoti hai, aur jab vivek chala jaata hai toh insaan ka vinash hota hai.',
    hinglishTakeaway: 'Gusse mein kabhi koi faisla na lein. 5 second ka maun rakhein.'
  },
  'bg_18_66': {
    enMeaning: 'Abandon all varieties of dharmas and surrender unto Me alone. I shall deliver you from all sinful reactions; do not grieve.',
    enTakeaway: 'Surrender excessive control and mental burdens to the Divine. Walk forward with fearless faith.',
    hinglishMeaning: 'Sabhi chintaon aur bojh ko chhodkar meri sharan mein aao. Main tumhe sabhi paapon aur kleshon se mukt kar dunga; shok mat karo.',
    hinglishTakeaway: 'Sabhi chintaon ko Ishwar ko saunp kar nishchint ho jaayein.'
  },
  'bg_4_7': {
    enMeaning: 'Whenever righteousness declines and unrighteousness prevails, I manifest Myself on earth to restore Dharma.',
    enTakeaway: 'Stand up for integrity and truth in your sphere of influence, no matter how small.',
    hinglishMeaning: 'Jab jab dharm ki haani hoti hai aur adharm badhta hai, tab tab main swayam ko prakat karta hoon.',
    hinglishTakeaway: 'Hamesha sach aur satya ka saath dein.'
  },
  'bg_9_22': {
    enMeaning: 'For those who worship Me with single-minded devotion, meditating on My transcendental form, I provide what they lack and preserve what they have.',
    enTakeaway: 'Devote your mind whole-heartedly to higher purpose; your genuine needs are silently looked after.',
    hinglishMeaning: 'Jo ananya bhav se mera dhyan karte hain, unki suraksha aur poshan ka daayitva main swayam leta hoon.',
    hinglishTakeaway: 'Bhakti aur vishwas ke saath apna shreshth yogdan dein.'
  }
};

/**
 * Returns translated UI strings and verse meaning according to user language preference
 */
export function getTranslatedShloka(
  shloka: Shloka,
  language: 'hi' | 'en' | 'hinglish' = 'hi'
): TranslatedContent {
  const custom = VERSE_TRANSLATIONS[shloka.id];

  // Calculate approximate meditation reading time based on syllable/word length
  const wordCount = (shloka.sanskrit.split(/\s+/).length) + (shloka.simpleHindi.split(/\s+/).length);
  const seconds = Math.max(30, Math.round((wordCount / 20) * 15) + 20);
  const readTimeEstimate = seconds < 60 
    ? (language === 'en' ? `~${seconds}s read` : language === 'hinglish' ? `~${seconds}s dhyan` : `ध्यान: ~${seconds} से.`)
    : (language === 'en' ? `~1 min read` : language === 'hinglish' ? `~1 min dhyan` : `ध्यान: ~१ मिनट`);

  if (language === 'en') {
    return {
      meaning: custom?.enMeaning || (shloka.contextNotes ? `${shloka.contextNotes} - ` : '') + (shloka.transliteration || shloka.simpleHindi),
      takeaway: custom?.enTakeaway || `Contemplate Chapter ${shloka.chapter}, Verse ${shloka.verse}: Practice equanimity and purposeful action today.`,
      bhavarth: shloka.bhavarth,
      labelMeaning: 'Simple Meaning',
      labelTakeaway: 'Daily Wisdom',
      labelBhavarth: 'Philosophical Reflection',
      labelWordMeanings: 'Word Breakdown',
      readTimeEstimate
    };
  }

  if (language === 'hinglish') {
    return {
      meaning: custom?.hinglishMeaning || shloka.simpleHindi,
      takeaway: custom?.hinglishTakeaway || shloka.aajKiSeekh,
      bhavarth: shloka.bhavarth,
      labelMeaning: 'Saral Arth',
      labelTakeaway: 'Aaj Ki Seekh',
      labelBhavarth: 'Bhavarth Aur Sandesh',
      labelWordMeanings: 'Shabdarth',
      readTimeEstimate
    };
  }

  // Default: Hindi
  return {
    meaning: shloka.simpleHindi,
    takeaway: shloka.aajKiSeekh,
    bhavarth: shloka.bhavarth,
    labelMeaning: 'सरल अर्थ',
    labelTakeaway: 'आज की सीख • Daily Wisdom',
    labelBhavarth: 'भावार्थ एवं विश्लेषण',
    labelWordMeanings: 'पदच्छेद / शब्दार्थ',
    readTimeEstimate
  };
}
