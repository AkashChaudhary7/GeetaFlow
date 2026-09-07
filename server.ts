import express from 'express';
import path from 'path';
import fs from 'fs';
import { execFile } from 'child_process';
import crypto from 'crypto';
import os from 'os';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.raw({
  type: ['video/*', 'application/octet-stream'],
  limit: '100mb',
}));

// Lazy-initialized Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY || '',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Structured Gita concepts & verse database for grounding
const GITA_KNOWLEDGE_BASE = [
  {
    chapter: 2,
    verse: 47,
    sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥",
    simpleHindi: "तुम्हारा अधिकार केवल कर्म करने में है, उसके फलों में कभी नहीं। इसलिए कर्मफल की इच्छा से कर्म मत करो और न ही कर्म न करने में आसक्ति हो।",
    bhavarth: "परिणाम की चिंता छोड़ पूरी ऊर्जा प्रक्रिया (effort) में लगाने से तनाव समाप्त होता है और कार्य क्षमता बढ़ती है।",
    aajKiSeekh: "अपने आज के कार्य पर 100% ध्यान दें। 'क्या होगा' का भय त्यागकर अपनी प्रक्रिया को उत्कृष्ट बनाएं।",
    topics: ["कर्म", "सफलता", "चिंता", "नौकरी", "भविष्य", "कर्तव्य", "तनाव"]
  },
  {
    chapter: 2,
    verse: 14,
    sanskrit: "मात्रास्पर्शास्तु कौन्तेय शीतोष्णसुखदुःखदाः। आगमापायिनोऽनित्यास्तांस्तितिक्षस्व भारत॥",
    simpleHindi: "इन्द्रियों और विषयों के संयोग से होने वाले सुख-दुःख, सर्दी-गर्मी आदि अनित्य (आने-जाने वाले) हैं, इन्हें धैर्यपूर्वक सहन करो।",
    bhavarth: "सुख और दुःख मौसम की तरह बदलते रहते हैं। कठिन समय में धैर्य ही सबसे बड़ा संबल है।",
    aajKiSeekh: "कठिन समय हमेशा के लिए नहीं रहता। धैर्य रखें, यह परिस्थिति भी अवश्य बदलेगी।",
    topics: ["धैर्य", "उदासी", "असफलता", "तनाव", "शांति", "दुःख"]
  },
  {
    chapter: 2,
    verse: 62,
    sanskrit: "ध्यायतो विषयान्पुंसः सङ्गस्तेषूपजायते। सङ्गात्सञ्जायते कामः कामात्क्रोधोऽभिजायते॥",
    simpleHindi: "विषयों का निरंतर चिंतन करने से आसक्ति, आसक्ति से कामना और कामना में बाधा से क्रोध उत्पन्न होता है।",
    bhavarth: "अति-अपेक्षाएं और अनियंत्रित इच्छाएं ही गुस्से का मूल कारण हैं।",
    aajKiSeekh: "गुस्से को रोकने के लिए अपनी अपेक्षाओं को पहचानें और विचारों को शांत रखें।",
    topics: ["क्रोध", "गुस्सा", "मन", "अपेक्षा", "रिश्ते"]
  },
  {
    chapter: 2,
    verse: 63,
    sanskrit: "क्रोधाद्भवति संमोहः संमोहात्स्मृतिविभ्रमः। स्मृतिभ्रंशाद् बुद्धिनाशो बुद्धिनाशात्प्रणश्यति॥",
    simpleHindi: "क्रोध से अविवेक (भ्रम) होता है, भ्रम से स्मृति का नाश होता है और बुद्धि के नाश से मनुष्य का पतन हो जाता है।",
    bhavarth: "गुस्से में सही निर्णय लेने की क्षमता नष्ट हो जाती है।",
    aajKiSeekh: "क्रोध के समय कोई भी बड़ा निर्णय न लें। शांत होने पर ही प्रतिक्रिया दें।",
    topics: ["क्रोध", "निर्णय", "बुद्धि", "रिश्ते"]
  },
  {
    chapter: 6,
    verse: 5,
    sanskrit: "उद्धरेदात्मनात्मानं नात्मानमवसादयेत्। आत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः॥",
    simpleHindi: "मनुष्य को चाहिए कि वह अपने मन के द्वारा अपना उद्धार करे, स्वयं को न गिराए; क्योंकि मन ही मित्र है और मन ही शत्रु है।",
    bhavarth: "अनुशासित मन सबसे बड़ा साथी है और अनियंत्रित मन सबसे बड़ा बाधक।",
    aajKiSeekh: "आत्म-संदेह से बचें। सकारात्मक सोच और निरंतर अभ्यास से अपने मन को सशक्त बनाएं।",
    topics: ["मन", "आत्मविश्वास", "आलस्य", "अनुशासन", "सफलता", "एकाग्रता"]
  },
  {
    chapter: 6,
    verse: 26,
    sanskrit: "यतो यतो निश्चरति मनश्चञ्चलमस्थिरम्। ततस्ततो नियम्यैतदात्मन्येव वशं नयेत्॥",
    simpleHindi: "यह चंचल मन जिस-जिस विषय की ओर भागे, वहाँ-वहाँ से इसे रोककर पुनः आत्मा में स्थिर करें।",
    bhavarth: "मन का भटकना स्वाभाविक है, उसे बार-बार धैर्यपूर्वक लक्ष्य पर लौटाना ही साधना है।",
    aajKiSeekh: "जब भी ध्यान भटके, बिना झल्लाहट के तुरंत वर्तमान कार्य पर लौट आएं।",
    topics: ["एकाग्रता", "मन", "ध्यान", "पढ़ाई", "काम"]
  },
  {
    chapter: 9,
    verse: 22,
    sanskrit: "अनन्याश्चिन्तयन्तो मां ये जनाः पर्युपासते। तेषां नित्याभियुक्तानां योगक्षेमं वहाम्यहम्॥",
    simpleHindi: "जो अनन्य भाव से सत्कर्म और प्रभु का चिंतन करते हैं, उनके कल्याण और सुरक्षा का दायित्व ईश्वर स्वयं संभालते हैं।",
    bhavarth: "ईमानदारी और समर्पण से कर्म करने वाले को भविष्य की अत्यधिक चिंता करने की आवश्यकता नहीं है।",
    aajKiSeekh: "भविष्य के भय को छोड़ें। सही नीयत और लगन से आगे बढ़ें।",
    topics: ["भय", "सुरक्षा", "चिंता", "विश्वास", "शांति"]
  }
];

// API: Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'GeetaFlow', version: '1.0.0' });
});

// Privacy Policy page
app.get('/privacy', (req, res) => {
  const privacyPath = path.join(process.cwd(), 'public', 'privacy.html');
  if (fs.existsSync(privacyPath)) {
    res.sendFile(privacyPath);
  } else {
    res.redirect('https://geetaflow.ictlabgsssaidana.workers.dev/privacy');
  }
});

// API: Convert canvas recording to YouTube Shorts & Instagram Reels Certified MP4
app.post('/api/convert-to-mp4', async (req, res) => {
  let inputPath = '';
  let outputPath = '';

  try {
    if (!req.body || !Buffer.isBuffer(req.body) || req.body.length === 0) {
      return res.status(400).json({ error: 'No video binary data received' });
    }

    const requestedFilename = (req.headers['x-filename'] as string) || 'GeetaFlow_Reel.mp4';
    const cleanFilename = requestedFilename.replace(/[^a-zA-Z0-9_\-\.]/g, '_').replace(/\.webm$/i, '.mp4');
    
    const uniqueId = crypto.randomUUID();
    const tempDir = os.tmpdir();
    inputPath = path.join(tempDir, `reel_in_${uniqueId}.webm`);
    outputPath = path.join(tempDir, `reel_out_${uniqueId}.mp4`);

    await fs.promises.writeFile(inputPath, req.body);

    // Check if input stream contains audio using ffprobe
    execFile('ffprobe', [
      '-i', inputPath,
      '-show_streams',
      '-select_streams', 'a',
      '-loglevel', 'error'
    ], (probeErr, probeStdout) => {
      const hasAudio = !probeErr && probeStdout && probeStdout.trim().length > 0;

      // Build ffmpeg command with YouTube Shorts & Instagram Reels Certified Specifications:
      // 1. Video Codec: H.264 (libx264)
      // 2. Profile: High, Level 4.1
      // 3. Pixel Format: yuv420p (Mandatory for iOS / Android Reels playback)
      // 4. Framerate: 30.0 fps constant frame rate (CFR)
      // 5. GOP size: 60 (keyframe every 2 seconds for perfect seeking and instant preview)
      // 6. Audio Codec: AAC-LC 192k stereo 44.1kHz
      // 7. Faststart: moov atom placed at start of file for instant streaming and social media upload parsing
      const ffmpegArgs = hasAudio
        ? [
            '-y',
            '-i', inputPath,
            '-c:v', 'libx264',
            '-pix_fmt', 'yuv420p',
            '-profile:v', 'high',
            '-level', '4.1',
            '-preset', 'fast',
            '-crf', '19',
            '-r', '30',
            '-g', '60',
            '-c:a', 'aac',
            '-b:a', '192k',
            '-ar', '44100',
            '-ac', '2',
            '-movflags', '+faststart',
            outputPath,
          ]
        : [
            '-y',
            '-i', inputPath,
            '-f', 'lavfi',
            '-i', 'anullsrc=channel_layout=stereo:sample_rate=44100',
            '-c:v', 'libx264',
            '-pix_fmt', 'yuv420p',
            '-profile:v', 'high',
            '-level', '4.1',
            '-preset', 'fast',
            '-crf', '19',
            '-r', '30',
            '-g', '60',
            '-c:a', 'aac',
            '-b:a', '192k',
            '-shortest',
            '-movflags', '+faststart',
            outputPath,
          ];

      execFile('ffmpeg', ffmpegArgs, async (convErr, _stdout, stderr) => {
        if (convErr) {
          console.error('ffmpeg MP4 conversion error:', convErr, stderr);
          try { if (inputPath) await fs.promises.unlink(inputPath); } catch {}
          try { if (outputPath) await fs.promises.unlink(outputPath); } catch {}
          return res.status(500).json({ error: 'Video encoding failed', details: stderr || convErr.message });
        }

        try {
          const stat = await fs.promises.stat(outputPath);
          res.setHeader('Content-Type', 'video/mp4');
          res.setHeader('Content-Length', stat.size);
          res.setHeader('Content-Disposition', `attachment; filename="${cleanFilename}"`);
          res.setHeader('Cache-Control', 'no-cache');

          const stream = fs.createReadStream(outputPath);
          stream.pipe(res);

          const cleanup = async () => {
            try { if (inputPath) await fs.promises.unlink(inputPath); } catch {}
            try { if (outputPath) await fs.promises.unlink(outputPath); } catch {}
          };

          stream.on('close', cleanup);
          stream.on('error', (streamErr) => {
            console.error('Streaming MP4 error:', streamErr);
            cleanup();
          });
        } catch (statErr) {
          console.error('MP4 stat error:', statErr);
          res.status(500).json({ error: 'Failed to access converted video' });
        }
      });
    });

  } catch (err: any) {
    console.error('Server error in /api/convert-to-mp4:', err);
    try { if (inputPath) await fs.promises.unlink(inputPath); } catch {}
    try { if (outputPath) await fs.promises.unlink(outputPath); } catch {}
    res.status(500).json({ error: 'Internal server error during MP4 conversion' });
  }
});

// API: Ask Gita
app.post('/api/ask-gita', async (req, res) => {
  try {
    const { question } = req.body;
    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Question is required' });
    }

    const cleanQuestion = question.trim().toLowerCase();

    // 1. Identify best matched authentic Gita verses from knowledge base
    const matchedVerses = GITA_KNOWLEDGE_BASE.filter(v => 
      v.topics.some(t => cleanQuestion.includes(t.toLowerCase())) ||
      cleanQuestion.includes(v.simpleHindi.toLowerCase())
    );

    const primaryVerses = matchedVerses.length > 0 
      ? matchedVerses.slice(0, 2) 
      : [GITA_KNOWLEDGE_BASE[0], GITA_KNOWLEDGE_BASE[4]]; // Default to Karma & Self-empowerment

    // If Gemini API Key is configured, use Gemini 3.8 Flash to generate grounded perspective
    let gitaPerspective = "";
    let practicalReflection = "";

    if (process.env.GEMINI_API_KEY) {
      try {
        const ai = getGeminiClient();
        const prompt = `You are a respectful, authentic Bhagavad Gita wisdom guide for GeetaFlow app.
User's Question: "${question}"

Relevant Authentic Gita Verses retrieved for this question:
${primaryVerses.map(v => `• Chapter ${v.chapter}, Verse ${v.verse}:\n  Sanskrit: ${v.sanskrit}\n  Hindi: ${v.simpleHindi}\n  Core Principle: ${v.bhavarth}`).join('\n')}

STRICT THEOLOGICAL & PROMPTING RULES:
1. PROHIBIT DIRECT SPEECH ATTRIBUTION: You are STRICTLY FORBIDDEN from using phrases that attribute direct speech to Krishna (such as "Krishna says...", "श्रीकृष्ण कहते हैं कि...", "भगवान श्रीकृष्ण ने कहा है...") UNLESS you are quoting a specific authentic verse word-for-word with its chapter and verse citation.
2. MANDATORY FRAMING PHRASES: When explaining the philosophical perspective, you MUST consistently use phrases like:
   - "भगवद्गीता की शिक्षाओं के आधार पर..." (Based on the teachings of the Bhagavad Gita...)
   - "इन श्लोकों से आधुनिक जीवन के लिए एक दृष्टिकोण यह हो सकता है..." (A modern interpretation from these verses could be...)
3. PRIORITIZATION: The system presents the authentic verses FIRST to the user. Your role in "gitaPerspective" is to provide a grounded, compassionate philosophical context (100-140 words in clean, natural Hindi).
4. ACTIONABLE REFLECTION: "practicalReflection" must provide 2-3 calm, concrete, peaceful daily steps ("आज के जीवन में प्रयोग") in Hindi.

Return ONLY a valid JSON object with keys:
{
  "gitaPerspective": "string starting with or prominently using 'भगवद्गीता की शिक्षाओं के आधार पर...' or 'इन श्लोकों से आधुनिक जीवन के लिए दृष्टिकोण यह हो सकता है...'",
  "practicalReflection": "string with 2-3 numbered practical daily reflections"
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          }
        });

        const parsed = JSON.parse(response.text || '{}');
        gitaPerspective = parsed.gitaPerspective || "";
        practicalReflection = parsed.practicalReflection || "";
      } catch (geminiErr) {
        console.warn('Gemini API fallback to local grounded synthesis:', geminiErr);
      }
    }

    // High quality local grounded fallback if AI call is unavailable or unconfigured
    if (!gitaPerspective) {
      gitaPerspective = `भगवद्गीता की शिक्षाओं के आधार पर, यह परिस्थिति मन की अस्थिरता और कर्म के स्थान पर केवल परिणाम में उलझने से उत्पन्न होती है। इन श्लोकों से आधुनिक जीवन के लिए एक दृष्टिकोण यह हो सकता है कि हमारे अधिकार क्षेत्र में केवल आज का निष्ठावान प्रयास है, भविष्य का परिणाम नहीं। जब हम फल की चिंता से मुक्त होकर वर्तमान कर्तव्य में एकाग्र होते हैं, तो चित्त को स्वाभाविक शांति और स्पष्टता प्राप्त होती है।`;
      practicalReflection = `1. आज अपने नियंत्रण में आने वाले 2 मुख्य कार्यों की सूची बनाएं और अपना सर्वश्रेष्ठ प्रयास दें।\n2. जब भी मन में संशय या चिंता आए, 5 बार गहरी सांस लें और 'कर्मण्येवाधिकारस्ते' के मूल भाव का स्मरण करें।\n3. दूसरों से तुलना करने के बजाय अपनी मानसिक शांति और आत्म-विकास पर ध्यान केंद्रित करें।`;
    }

    res.json({
      query: question,
      matchedTheme: primaryVerses[0]?.topics[0] || 'कर्म व मार्गदर्शन',
      relevantVerses: primaryVerses,
      gitaPerspective,
      practicalReflection
    });

  } catch (err: any) {
    console.error('Error in /api/ask-gita:', err);
    res.status(500).json({ error: 'Failed to process Gita inquiry', details: err?.message });
  }
});

// Start Server & mount Vite
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GeetaFlow server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
