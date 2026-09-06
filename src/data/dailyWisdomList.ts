export interface DailyThought {
  id: string;
  dayIndex: number;
  title: string;
  quoteSanskrit: string;
  source: string;
  sourceRef: { chapter: number; verse: number };
  hindiTranslation: string;
  englishTranslation: string;
  hinglishTranslation: string;
  reflection: string;
  sankalpa: string; // आज का संकल्प
  theme: string;
}

export const DAILY_THOUGHTS: DailyThought[] = [
  {
    id: 'dt_1',
    dayIndex: 1,
    title: 'कर्म ही पूजा है',
    quoteSanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।',
    source: 'भगवद्गीता २.४७',
    sourceRef: { chapter: 2, verse: 47 },
    hindiTranslation: 'तुम्हारा अधिकार केवल कर्म करने में है, उसके फल में कभी नहीं।',
    englishTranslation: 'You have a right to perform your prescribed duty, but you are not entitled to the fruits of action.',
    hinglishTranslation: 'Aapka adhikar sirf karm karne mein hai, result ki chinta mein nahi.',
    reflection: 'जब मन परिणाम के डर या आशा से मुक्त होकर केवल वर्तमान काम में लीन होता है, तब कार्य में चमत्कारिक गुणवत्ता और मन में असीम शांति आती है।',
    sankalpa: 'आज मैं जो भी कार्य करूँगा, बिना परिणाम की चिंता किए अपना शत-प्रतिशत दूँगा।',
    theme: 'कर्मयोग'
  },
  {
    id: 'dt_2',
    dayIndex: 2,
    title: 'समत्व ही सच्चा योग है',
    quoteSanskrit: 'समत्वं योग उच्यते।',
    source: 'भगवद्गीता २.४८',
    sourceRef: { chapter: 2, verse: 48 },
    hindiTranslation: 'सुख-दुःख, लाभ-हानि और जय-पराजय में मानसिक संतुलन बनाए रखना ही योग है।',
    englishTranslation: 'Equanimity of mind in success and failure is called Yoga.',
    hinglishTranslation: 'Success aur failure dono mein ek samaan shaant rehna hi sachha Yoga hai.',
    reflection: 'परिस्थितियाँ सदा हमारे अनुकूल नहीं हो सकतीं, परंतु हमारी आंतरिक प्रतिक्रिया सदा हमारे हाथ में है। समत्व का अर्थ भावहीन होना नहीं, बल्कि हर हाल में स्थिर रहना है।',
    sankalpa: 'आज किसी भी प्रतिकूल स्थिति में क्रोध या घबराहट की जगह गहरी सांस लेकर शांत रहूँगा।',
    theme: 'समत्व'
  },
  {
    id: 'dt_3',
    dayIndex: 3,
    title: 'स्वयं का उद्धार स्वयं करें',
    quoteSanskrit: 'उद्धरेदात्मनात्मानं नात्मानमवसादयेत्।',
    source: 'भगवद्गीता ६.५',
    sourceRef: { chapter: 6, verse: 5 },
    hindiTranslation: 'मनुष्य को अपने द्वारा अपना उद्धार करना चाहिए, स्वयं को कभी निराश न करें।',
    englishTranslation: 'Elevate yourself through the power of your mind, and do not degrade yourself.',
    hinglishTranslation: 'Apne aap ko khud uthaiye, kabhi khud ko kamzor ya niraash mat hone dijiye.',
    reflection: 'संसार में आपकी प्रगति और पतन की सबसे बड़ी जिम्मेदारी आपकी अपनी सोच की है। जब तक आप स्वयं पर विश्वास नहीं करेंगे, कोई दूसरा आपका उद्धार नहीं कर सकता।',
    sankalpa: 'आज मैं आत्म-निंदा (self-doubt) छोड़कर अपने सामर्थ्य पर पूर्ण विश्वास रखूँगा।',
    theme: 'आत्मविश्वास'
  },
  {
    id: 'dt_4',
    dayIndex: 4,
    title: 'क्रोध से बुद्धि का नाश',
    quoteSanskrit: 'क्रोधाद्भवति संमोहः संमोहात्स्मृतिविभ्रमः।',
    source: 'भगवद्गीता २.६३',
    sourceRef: { chapter: 2, verse: 63 },
    hindiTranslation: 'क्रोध से विवेक नष्ट होता है और विवेक नष्ट होने से मनुष्य का पतन होता है।',
    englishTranslation: 'From anger arises delusion, and from delusion bewilderment of memory and loss of intellect.',
    hinglishTranslation: 'Gusse se samajh khatam hoti hai, aur galat faisle se jeevan ka nuksaan hota hai.',
    reflection: 'क्रोध एक जलता हुआ कोयला है जिसे आप दूसरों पर फेंकने के लिए उठाते हैं, परंतु सबसे पहले आपका अपना हाथ जलता है। किसी भी बात पर बोलने से पहले 5 सेकंड का मौन रखें।',
    sankalpa: 'आज जब भी मन में रोष उठेगा, मैं तुरंत प्रतिक्रिया देने के बजाय मौन साधूँगा।',
    theme: 'मन-नियंत्रण'
  },
  {
    id: 'dt_5',
    dayIndex: 5,
    title: 'ईश्वर सर्वव्यापी हैं',
    quoteSanskrit: 'ईश्वरः सर्वभूतानां हृद्देशेऽर्जुन तिष्ठति।',
    source: 'भगवद्गीता १८.६१',
    sourceRef: { chapter: 18, verse: 61 },
    hindiTranslation: 'हे अर्जुन! ईश्वर सभी प्राणियों के हृदय में निवास करते हैं।',
    englishTranslation: 'The Supreme Divine dwells in the hearts of all living beings.',
    hinglishTranslation: 'Ishwar sabhi jeevon ke hriday mein sadaiv virajman hain.',
    reflection: 'जब हम यह जान लेते हैं कि परमात्मा प्रत्येक प्राणी के भीतर विराजमान हैं, तब घृणा, ईर्ष्या और भेद-भाव स्वतः समाप्त हो जाते हैं। हर व्यक्ति के प्रति दयालुता जागृत होती है।',
    sankalpa: 'आज मैं हर किसी से विनम्रता और सम्मान के साथ संवाद करूँगा।',
    theme: 'भक्ति'
  },
  {
    id: 'dt_6',
    dayIndex: 6,
    title: 'अशांति में सुख कहाँ?',
    quoteSanskrit: 'अशान्तस्य कुतः सुखम्।',
    source: 'भगवद्गीता २.६६',
    sourceRef: { chapter: 2, verse: 66 },
    hindiTranslation: 'जिसका मन शांत नहीं है, उसे सुख कहाँ मिल सकता है?',
    englishTranslation: 'For the unsteady and unpeaceful mind, where is happiness?',
    hinglishTranslation: 'Jiska mann shaant nahi hai, usko bhala sukh kahan mil sakta hai?',
    reflection: 'बाहरी सुख-सुविधाएं हमें केवल क्षणिक आराम दे सकती हैं, वास्तविक तृप्ति केवल मन की स्थिरता से प्राप्त होती है। जब तक भीतर शांति नहीं, तब तक बाहर का कोई महल भी शांति नहीं दे सकता।',
    sankalpa: 'आज दिन में दो बार 3 मिनट आँखें बंद कर अपनी सांसों पर ध्यान केंद्रित करूँगा।',
    theme: 'शांति'
  },
  {
    id: 'dt_7',
    dayIndex: 7,
    title: 'आत्मा अमर और अजर है',
    quoteSanskrit: 'नैनं छिन्दन्ति शस्त्राणि नैनं दहति पावकः।',
    source: 'भगवद्गीता २.२३',
    sourceRef: { chapter: 2, verse: 23 },
    hindiTranslation: 'आत्मा को न शस्त्र काट सकते हैं और न ही अग्नि जला सकती है।',
    englishTranslation: 'Weapons cannot cut the soul, nor can fire burn it; it is eternal and pure consciousness.',
    hinglishTranslation: 'Aatma ko shastra kaat nahi sakte, na aag jala sakti hai; aap amar chetna hain.',
    reflection: 'शारीरिक व्याधियां और सांसारिक हानि केवल शरीर और मन के स्तर पर होती हैं। आपका वास्तविक स्वरूप शाश्वत, शुद्ध और आनंदमय है। भय को त्यागकर निडर बनें।',
    sankalpa: 'आज मैं किसी भी भौतिक हानि या परिवर्तन से भयभीत नहीं होऊँगा।',
    theme: 'ज्ञान'
  },
  {
    id: 'dt_8',
    dayIndex: 8,
    title: 'योग ही कर्म में कुशलता है',
    quoteSanskrit: 'योगः कर्मसु कौशलम्।',
    source: 'भगवद्गीता २.५०',
    sourceRef: { chapter: 2, verse: 50 },
    hindiTranslation: 'कर्मों में कुशलता और निष्कामता ही योग है।',
    englishTranslation: 'Yoga is skill and excellence in all actions.',
    hinglishTranslation: 'Apne har kaam ko poori nishtha aur lagan se karna hi yoga hai.',
    reflection: 'जब आप अपने छोटे से छोटे काम को भी पूजा की तरह, पूर्ण एकाग्रता और उत्कृष्टता के साथ करते हैं, तो वही कर्म साधना बन जाता है।',
    sankalpa: 'आज मैं अपने दैनिक कार्यों को बिना जल्दबाजी के, संपूर्ण लगन और स्वच्छता से पूरा करूँगा।',
    theme: 'उत्कृष्टता'
  },
  {
    id: 'dt_9',
    dayIndex: 9,
    title: 'अभ्यास और वैराग्य से मन का वश',
    quoteSanskrit: 'अभ्यासेन तु कौन्तेय वैराग्येण च गृह्यते।',
    source: 'भगवद्गीता ६.३५',
    sourceRef: { chapter: 6, verse: 35 },
    hindiTranslation: 'हे कुन्तीपुत्र! चंचल मन को केवल निरंतर अभ्यास और अनासक्ति द्वारा वश में किया जा सकता है।',
    englishTranslation: 'The restless mind is undoubtedly hard to subdue, but it can be mastered through practice and detachment.',
    hinglishTranslation: 'Mann ko bas continuous practice aur faltu baaton se door rehkar hi control kiya ja sakta hai.',
    reflection: 'मन भटकता है, यह उसका स्वभाव है। जब भी मन भटके, उसे डांटने के बजाय धैर्य से पुनः अपने लक्ष्य पर लौटा लाएं। निरंतर अभ्यास से असंभव भी संभव हो जाता है।',
    sankalpa: 'आज यदि मन बार-बार सोशल मीडिया या व्यर्थ बातों में भटकेगा, तो मैं 5 गहरी सांसें लेकर पुनः अपने काम पर लौटूँगा।',
    theme: 'साधना'
  },
  {
    id: 'dt_10',
    dayIndex: 10,
    title: 'संसार में जैसा भाव, वैसी गति',
    quoteSanskrit: 'यो यच्छ्रद्धः स एव सः।',
    source: 'भगवद्गीता १७.३',
    sourceRef: { chapter: 17, verse: 3 },
    hindiTranslation: 'मनुष्य की जैसी श्रद्धा होती है, वह वैसा ही बन जाता है।',
    englishTranslation: 'A person is made by their belief. As they believe, so they become.',
    hinglishTranslation: 'Insaan ka jaisa vishwas aur mindset hota hai, wo waisa hi ban jaata hai.',
    reflection: 'आपके विचार ही आपके भविष्य की नींव रखते हैं। यदि आप स्वयं को हीन समझेंगे तो जीवन वैसा ही बन जाएगा। उच्च आदर्शों में निष्ठा रखें और श्रेष्ठ सोचें।',
    sankalpa: 'आज मैं केवल सकारात्मक और प्रेरणादायक विचारों को अपने मन में स्थान दूँगा।',
    theme: 'श्रद्धा'
  }
];

export function getTodayThought(): DailyThought {
  const now = new Date();
  // Generate daily deterministic index based on day of year
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  
  const index = Math.abs(dayOfYear) % DAILY_THOUGHTS.length;
  return DAILY_THOUGHTS[index];
}
