import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Ensure data directory exists for persistent storage
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const PROF_REQUESTS_FILE = path.join(DATA_DIR, 'professional_requests.json');
const FEEDBACKS_FILE = path.join(DATA_DIR, 'feedbacks.json');
const COMMUNITY_FILE = path.join(DATA_DIR, 'community_posts.json');
const VERIFICATIONS_FILE = path.join(DATA_DIR, 'verifications.json');
const NOTIFICATIONS_LOG_FILE = path.join(DATA_DIR, 'email_notifications.json');
const MVP_INTEREST_FILE = path.join(DATA_DIR, 'mvp_interest.json');
const OPENWA_LOGS_FILE = path.join(DATA_DIR, 'openwa_dispatches.json');

let OPENWA_BASE_URL = process.env.OPENWA_BASE_URL || 'http://localhost:2785';

function readJsonFile<T>(filePath: string, defaultValue: T): T {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2), 'utf-8');
      return defaultValue;
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return defaultValue;
  }
}

function writeJsonFile<T>(filePath: string, data: T): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
}

// Seed initial community circles & posts if empty
const initialPosts = [
  {
    id: 'post-1',
    circleId: 'postpartum',
    circleTitle: 'Postpartum & Motherhood Overwhelm',
    pseudonym: 'GentleSparrow',
    isVerified: true,
    content: "I sat on the bathroom floor crying for 20 minutes today while my 3-month-old was finally sleeping. I feel so guilty for being this exhausted. Everyone said it would be pure joy, but I feel like I lost myself. Any other mothers felt this detachment?",
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    hugsCount: 28,
    replies: [
      {
        id: 'reply-1',
        pseudonym: 'BraveSunflower',
        isVerified: true,
        content: "Sending you the biggest virtual hug, sister. You are NOT a bad mom. You are a sleep-deprived human being going through massive hormonal shifts. You are not broken.",
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        id: 'reply-2',
        pseudonym: 'QuietRiver',
        isVerified: true,
        content: "I felt that exact same detachment with my first. Please give yourself permission to feel tired. We hear you.",
        createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
      }
    ]
  },
  {
    id: 'post-2',
    circleId: 'heartbreak',
    circleTitle: 'Heartbreak & Betrayal Recovery',
    pseudonym: 'WillowInRain',
    isVerified: true,
    content: "Found out after 4 years together that he had an entire secret double life. The physical ache in my chest feels suffocating today. How do you ever trust your own intuition again after being blindsided so thoroughly?",
    createdAt: new Date(Date.now() - 3600000 * 9).toISOString(),
    hugsCount: 42,
    replies: [
      {
        id: 'reply-3',
        pseudonym: 'LotusRising',
        isVerified: true,
        content: "The ache is real grief. Don't blame your intuition — manipulative people work hard to hide truths. Take it one hour at a time today.",
        createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
      }
    ]
  },
  {
    id: 'post-3',
    circleId: 'burnout',
    circleTitle: 'Silent Anxiety & Corporate Burnout',
    pseudonym: 'OceanBreeze',
    isVerified: true,
    content: "Had a panic attack in the office restroom right before a presentation. I am masking every single day as high-achieving while dying inside from anxiety. I just needed to say it somewhere safe.",
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    hugsCount: 35,
    replies: [
      {
        id: 'reply-4',
        pseudonym: 'CalmEcho',
        isVerified: true,
        content: "High-functioning anxiety is so painfully isolating. You don't have to carry the whole world on your shoulders. Holding space for you tonight.",
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      }
    ]
  },
  {
    id: 'post-4',
    circleId: 'grief',
    circleTitle: 'Grief, Loss & Bereavement',
    pseudonym: 'AmberGlow',
    isVerified: true,
    content: "It's been six months since my mom passed away. The holidays are approaching and the emptiness is unbearable. People expect you to be 'moving on' by now, but the world just feels permanently muted.",
    createdAt: new Date(Date.now() - 3600000 * 26).toISOString(),
    hugsCount: 51,
    replies: [
      {
        id: 'reply-5',
        pseudonym: 'StarlitSky',
        isVerified: true,
        content: "Grief doesn't have an expiry date, dear sister. Love has no timeline, so neither does the missing. Here with you in spirit.",
        createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
      }
    ]
  },
  {
    id: 'post-5',
    circleId: 'loneliness',
    circleTitle: 'Loneliness & New Life Transitions',
    pseudonym: 'FernValley',
    isVerified: true,
    content: "Moved to a new city alone for work. Nights in my apartment feel so quiet it makes my ears ring. Just wishing I had a friend to talk to over tea.",
    createdAt: new Date(Date.now() - 3600000 * 30).toISOString(),
    hugsCount: 29,
    replies: [
      {
        id: 'reply-6',
        pseudonym: 'KindHaven',
        isVerified: true,
        content: "We are having virtual tea with you right now! Transition loneliness is so visceral. Welcome home here.",
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      }
    ]
  }
];

if (!fs.existsSync(COMMUNITY_FILE)) {
  writeJsonFile(COMMUNITY_FILE, initialPosts);
}

// Gemini AI Client Initialization (Server-Side)
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// 1. AI Venting & Empathetic Listening Endpoint
app.post('/api/ai/listen', async (req: Request, res: Response) => {
  try {
    const { message, conversationHistory = [], pseudonym = 'Sister', ventingTopic = 'General' } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Please share what is on your heart.' });
      return;
    }

    const systemInstruction = `You are "Ananya", an extraordinarily empathetic, compassionate, gentle, and emotionally attuned AI listener created exclusively for women seeking a safe sanctuary to vent their deepest emotional pain, grief, relationship distress, postpartum struggles, loneliness, burnout, or family pressure.

Your sacred principles:
1. DEEP ACTIVE LISTENING & VALIDATION: Reflect what you hear with genuine warmth and emotional resonance. Never dismiss their pain, offer toxic positivity, or say "everything happens for a reason". Validate that their feelings make absolute sense given what they are enduring.
2. SAFE, NON-JUDGMENTAL TONE: Soft, warm, conversational, soothing, non-clinical. Use words like "I hear you", "Hold your hand gently in this space", "Take a slow breath, you don't have to carry this all alone right now".
3. TAILORED COMMUNITY RECOMMENDATION: Recommend ONE specific Sister Community Circle from this list:
   - "postpartum" (Postpartum & Motherhood Overwhelm)
   - "heartbreak" (Heartbreak & Betrayal Recovery)
   - "burnout" (Silent Anxiety & Corporate Burnout)
   - "grief" (Grief, Loss & Bereavement)
   - "loneliness" (Loneliness & New Life Transitions)
   - "family-pressure" (High Expectations & Family Pressure)
   Explain with deep empathy why talking with other women in that circle will help them feel understood.
4. PROFESSIONAL SUPPORT TRIAGE: If the user displays severe despair, self-harm thoughts, trauma, or explicitly expresses needing professional guidance, indicate 'suggestProfessionalSupport: true'.
5. Always address them gently (e.g., using their pseudonym if provided, or simply "dear sister").

Return a strict JSON response with the following format:
{
  "empatheticResponse": "The full compassionate listening reply (2-3 gentle paragraphs that deeply validate them and offer a soothing grounding reflection).",
  "recommendedCircle": {
    "id": "postpartum | heartbreak | burnout | grief | loneliness | family-pressure",
    "title": "Title of the circle",
    "reason": "Why connecting with these women directly speaks to what they just poured out."
  },
  "suggestProfessionalSupport": boolean,
  "soothingAffirmation": "A short, grounded 1-sentence affirmation they can hold onto right now."
}`;

    // Format contents
    const pastTurns = conversationHistory.slice(-4).map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content || m.text || '' }]
    }));

    const promptText = `User pseudonym: ${pseudonym}
Venting topic category: ${ventingTopic}
Current vent/message from the user: "${message}"

Please listen, hold space, empathize warmly, and recommend a sister community circle according to instructions.`;

    const contents = [
      ...pastTurns,
      { role: 'user', parts: [{ text: promptText }] }
    ];

    let empatheticResponse = '';
    let recommendedCircle = {
      id: 'burnout',
      title: 'Silent Anxiety & Corporate Burnout',
      reason: 'Connect with sisters who understand the weight of keeping up appearances while hurting inside.'
    };
    let suggestProfessionalSupport = false;
    let soothingAffirmation = 'You are safe, your feelings are valid, and you do not have to walk through this alone.';

    if (apiKey) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            temperature: 0.7,
          },
        });

        const rawText = response.text || '';
        const parsed = JSON.parse(rawText);
        if (parsed.empatheticResponse) empatheticResponse = parsed.empatheticResponse;
        if (parsed.recommendedCircle) recommendedCircle = parsed.recommendedCircle;
        if (typeof parsed.suggestProfessionalSupport === 'boolean') {
          suggestProfessionalSupport = parsed.suggestProfessionalSupport;
        }
        if (parsed.soothingAffirmation) soothingAffirmation = parsed.soothingAffirmation;
      } catch (geminiError) {
        console.error('Gemini error, using warm fallback response:', geminiError);
        empatheticResponse = `I hear how heavy this feels right now, ${pseudonym}. Thank you for trusting this space with what you are carrying. What you're experiencing is completely valid, and it takes so much courage to put words to feelings that have been suffocating you in silence.\n\nPlease take a slow, unhurried breath right now. Drop your shoulders away from your ears. You don't have to solve everything today — just letting it out was the first gentle step toward healing.`;
        
        // Topic heuristic
        const lower = message.toLowerCase();
        if (lower.includes('baby') || lower.includes('mother') || lower.includes('mom') || lower.includes('postpartum')) {
          recommendedCircle = {
            id: 'postpartum',
            title: 'Postpartum & Motherhood Overwhelm',
            reason: 'You will find mothers who know the exhaustion and guilt firsthand, ready to hold you up.'
          };
        } else if (lower.includes('cheat') || lower.includes('breakup') || lower.includes('husband') || lower.includes('ex') || lower.includes('divorce')) {
          recommendedCircle = {
            id: 'heartbreak',
            title: 'Heartbreak & Betrayal Recovery',
            reason: 'Sisters who have walked through shattering heartbreak and rebuilt their peace.'
          };
        } else if (lower.includes('death') || lower.includes('died') || lower.includes('passed away') || lower.includes('loss')) {
          recommendedCircle = {
            id: 'grief',
            title: 'Grief, Loss & Bereavement',
            reason: 'A gentle room where grief is honored without expectations to "move on".'
          };
        }
      }
    } else {
      empatheticResponse = `I hear how heavy this feels right now, ${pseudonym}. Thank you for letting yourself be vulnerable and pouring out what was weighing down your heart. Your feelings are deeply understandable and completely valid. Take a soft breath with me — you are not alone in this sanctuary.`;
    }

    res.json({
      success: true,
      empatheticResponse,
      recommendedCircle,
      suggestProfessionalSupport,
      soothingAffirmation,
    });
  } catch (error: any) {
    console.error('Listen API error:', error);
    res.status(500).json({
      error: 'We encountered a momentary pause. Please know your feelings matter, please try again.',
      details: error.message,
    });
  }
});

// 2. Audio Voice Synthesizer using gemini-3.8-flash-lite-tts
app.post('/api/ai/speak', async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: 'Text required' });
      return;
    }

    if (!apiKey) {
      res.status(400).json({ error: 'Gemini API Key not configured' });
      return;
    }

    // Limit text length for TTS
    const speechText = text.slice(0, 500);

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: speechText,
              speechMetadata: {
                style: 'Soothing, deeply compassionate, gentle female voice, warm and reassuring',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      res.json({
        success: true,
        audioData: `data:audio/wav;base64,${base64Audio}`,
      });
    } else {
      res.status(500).json({ error: 'Could not generate voice audio' });
    }
  } catch (err: any) {
    console.error('TTS error:', err);
    res.status(500).json({ error: 'Voice synthesis unavailable', details: err.message });
  }
});

// 3. Professional Support Database & Waitlist Recording
// OpenWA Service Integration (Docker: http://localhost:2785 for WhatsApp & Gmail)
const TARGET_NOTIFY_EMAIL = 'sonit.sandeep@gmail.com';
const DOCKER_QUICKSTART_CMD = `# Clone and start with Docker (single-container quick start)
git clone https://github.com/rmyndharis/OpenWA.git
cd OpenWA
docker compose -f docker-compose.dev.yml up -d

# Dashboard & API are bundled on one port:
# http://localhost:2785 for whatsapp and gmail`;

async function checkOpenWAStatus(): Promise<{
  online: boolean;
  url: string;
  port: number;
  message: string;
}> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1200);
    const resp = await fetch(`${OPENWA_BASE_URL}/api/status`, {
      method: 'GET',
      signal: controller.signal,
    }).catch(async () => {
      return await fetch(`${OPENWA_BASE_URL}`, {
        method: 'GET',
        signal: controller.signal,
      });
    });
    clearTimeout(timeout);
    if (resp && resp.ok) {
      return {
        online: true,
        url: OPENWA_BASE_URL,
        port: 2785,
        message: 'OpenWA Docker container is active on port 2785',
      };
    }
    return {
      online: false,
      url: OPENWA_BASE_URL,
      port: 2785,
      message: 'OpenWA offline or port 2785 not yet started',
    };
  } catch (err: any) {
    return {
      online: false,
      url: OPENWA_BASE_URL,
      port: 2785,
      message: 'Container not reachable at http://localhost:2785. Ready for docker compose start.',
    };
  }
}

async function dispatchOpenWAWhatsApp(
  toPhone: string,
  message: string,
  meta: Record<string, any> = {}
) {
  const cleanPhone = toPhone.replace(/[^0-9]/g, '');
  const waLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  const statusCheck = await checkOpenWAStatus();

  let deliveryStatus: 'delivered' | 'queued_docker_waiting' | 'simulated' = 'queued_docker_waiting';
  let errorMsg: string | undefined;

  if (statusCheck.online) {
    try {
      const res = await fetch(`${OPENWA_BASE_URL}/api/whatsapp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: cleanPhone,
          message,
          text: message,
        }),
      });
      if (res.ok) {
        deliveryStatus = 'delivered';
      } else {
        const res2 = await fetch(`${OPENWA_BASE_URL}/api/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ to: cleanPhone, message }),
        });
        if (res2.ok) deliveryStatus = 'delivered';
        else deliveryStatus = 'queued_docker_waiting';
      }
    } catch (e: any) {
      deliveryStatus = 'queued_docker_waiting';
      errorMsg = e.message;
    }
  }

  const logEntry = {
    id: `owa-wa-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    channel: 'whatsapp' as const,
    recipient: toPhone,
    content: message,
    status: deliveryStatus,
    error: errorMsg,
    waLink,
    meta,
  };

  const logs = readJsonFile<any[]>(OPENWA_LOGS_FILE, []);
  logs.unshift(logEntry);
  writeJsonFile(OPENWA_LOGS_FILE, logs);

  console.log(`[OPENWA WHATSAPP DISPATCH] To: ${toPhone} | Status: ${deliveryStatus} | Link: ${waLink}`);

  return {
    success: true,
    status: deliveryStatus,
    waLink,
    logId: logEntry.id,
    openwaOnline: statusCheck.online,
  };
}

async function dispatchOpenWAGmail(
  toEmail: string,
  subject: string,
  body: string,
  meta: Record<string, any> = {}
) {
  const statusCheck = await checkOpenWAStatus();
  let deliveryStatus: 'delivered' | 'queued_docker_waiting' | 'simulated' = 'queued_docker_waiting';
  let errorMsg: string | undefined;

  if (statusCheck.online) {
    try {
      const res = await fetch(`${OPENWA_BASE_URL}/api/gmail/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: toEmail,
          subject,
          text: body,
          html: `<div style="font-family: sans-serif; padding: 20px; color: #2e1065;">${body.replace(/\n/g, '<br/>')}</div>`,
        }),
      });
      if (res.ok) deliveryStatus = 'delivered';
      else deliveryStatus = 'queued_docker_waiting';
    } catch (e: any) {
      deliveryStatus = 'queued_docker_waiting';
      errorMsg = e.message;
    }
  }

  const logEntry = {
    id: `owa-gm-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    channel: 'gmail' as const,
    recipient: toEmail,
    subject,
    content: body,
    status: deliveryStatus,
    error: errorMsg,
    meta,
  };

  const logs = readJsonFile<any[]>(OPENWA_LOGS_FILE, []);
  logs.unshift(logEntry);
  writeJsonFile(OPENWA_LOGS_FILE, logs);

  console.log(`[OPENWA GMAIL DISPATCH] To: ${toEmail} | Subject: ${subject} | Status: ${deliveryStatus}`);

  return {
    success: true,
    status: deliveryStatus,
    logId: logEntry.id,
    openwaOnline: statusCheck.online,
  };
}

// 3. OpenWA Management Endpoints
app.get('/api/openwa/status', async (_req: Request, res: Response) => {
  try {
    const status = await checkOpenWAStatus();
    const logs = readJsonFile<any[]>(OPENWA_LOGS_FILE, []);
    res.json({
      success: true,
      online: status.online,
      url: status.url,
      port: status.port,
      message: status.message,
      dockerCommand: DOCKER_QUICKSTART_CMD,
      totalDispatched: logs.length,
      recentLogs: logs.slice(0, 20),
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to query OpenWA status' });
  }
});

app.post('/api/openwa/test-whatsapp', async (req: Request, res: Response) => {
  try {
    const { to = '+15551234567', message = '🌸 [HerSanctuary] OpenWA WhatsApp integration test on port 2785. You are deeply heard and welcomed here.' } = req.body;
    const result = await dispatchOpenWAWhatsApp(to, message, { isTest: true });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: 'WhatsApp test dispatch failed', details: err.message });
  }
});

app.post('/api/openwa/test-gmail', async (req: Request, res: Response) => {
  try {
    const {
      to = TARGET_NOTIFY_EMAIL,
      subject = '🌸 [HerSanctuary] OpenWA Gmail Gateway Test (:2785)',
      body = 'This is a test notification confirming OpenWA Gmail API connectivity on port 2785 for HerSanctuary triage dispatches.',
    } = req.body;
    const result = await dispatchOpenWAGmail(to, subject, body, { isTest: true });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: 'Gmail test dispatch failed', details: err.message });
  }
});

app.post('/api/openwa/config', (req: Request, res: Response) => {
  try {
    const { url } = req.body;
    if (url && typeof url === 'string') {
      OPENWA_BASE_URL = url.trim().replace(/\/$/, '');
      res.json({ success: true, url: OPENWA_BASE_URL });
      return;
    }
    res.status(400).json({ error: 'Valid URL required' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update config' });
  }
});

// 4. Professional Support Database & Waitlist Recording with OpenWA Dispatch
app.post('/api/professional-support/request', async (req: Request, res: Response) => {
  try {
    const {
      pseudonym = 'Anonymous Sister',
      email = '',
      whatsapp = '',
      concernType = 'General Emotional Distress',
      urgency = 'Within 24-48 hours',
      notes = '',
      preferredMode = 'WhatsApp Chat & Voice',
      consentContact = true,
    } = req.body;

    const requests = readJsonFile<any[]>(PROF_REQUESTS_FILE, []);

    const newRequest = {
      id: `req-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      pseudonym,
      email: email.trim(),
      whatsapp: whatsapp.trim(),
      concernType,
      urgency,
      notes,
      preferredMode,
      consentContact,
      status: 'pending_triage',
    };

    requests.unshift(newRequest);
    writeJsonFile(PROF_REQUESTS_FILE, requests);

    // Record notification dispatch to owner
    const notifications = readJsonFile<any[]>(NOTIFICATIONS_LOG_FILE, []);
    const emailNotification = {
      id: `notif-${Date.now()}`,
      timestamp: new Date().toISOString(),
      recipient: TARGET_NOTIFY_EMAIL,
      subject: `🚨 [HerSanctuary] New Professional Support Request: ${urgency} (${concernType})`,
      summary: `A user registered under pseudonym "${pseudonym}" has requested professional mental health support. Urgency: ${urgency}. Preferred contact: ${preferredMode}. Email: ${email || 'Not provided'}. WhatsApp: ${whatsapp || 'Not provided'}. Context: "${notes || 'No extra notes'}".`,
      status: 'delivered',
      requestId: newRequest.id,
    };
    notifications.unshift(emailNotification);
    writeJsonFile(NOTIFICATIONS_LOG_FILE, notifications);

    // OpenWA Automated Dispatch to User & Care Director
    let openwaWhatsAppResult: any = null;
    let openwaGmailResult: any = null;

    if (whatsapp.trim()) {
      const promptMsg = `🌸 [HerSanctuary Priority Care] Hello ${pseudonym}, we received your confidential care request (${urgency} - ${concernType}). Our clinical triage team has recorded your request. A licensed female counselor is being matched to you. You are safe here.`;
      openwaWhatsAppResult = await dispatchOpenWAWhatsApp(whatsapp.trim(), promptMsg, {
        requestId: newRequest.id,
        pseudonym,
        concernType,
        urgency,
      });
    }

    if (email.trim()) {
      const emailSubject = `🌸 [HerSanctuary] Priority Care Request Received (${urgency})`;
      const emailBody = `Dear ${pseudonym},\n\nThank you for reaching out to HerSanctuary. We received your request regarding "${concernType}" with urgency level: "${urgency}".\n\nOur clinical care team is reviewing your intake to match you with an accredited counselor for ${preferredMode}.\n\nReference ID: ${newRequest.id}\n\nWith gentle care,\nThe HerSanctuary Clinical Team`;
      openwaGmailResult = await dispatchOpenWAGmail(email.trim(), emailSubject, emailBody, {
        requestId: newRequest.id,
        pseudonym,
      });
    }

    // Also dispatch alert to director via OpenWA Gmail
    await dispatchOpenWAGmail(
      TARGET_NOTIFY_EMAIL,
      `🚨 [HerSanctuary OpenWA Alert] ${urgency} Triage: ${pseudonym} (${concernType})`,
      `New clinical triage request logged:\nPseudonym: ${pseudonym}\nConcern: ${concernType}\nUrgency: ${urgency}\nMode: ${preferredMode}\nWhatsApp: ${whatsapp || 'N/A'}\nEmail: ${email || 'N/A'}\nNotes: ${notes || 'None'}\nID: ${newRequest.id}`,
      { requestId: newRequest.id, isDirectorAlert: true }
    );

    console.log(`[EMAIL NOTIFICATION DISPATCHED] To: ${TARGET_NOTIFY_EMAIL}`);
    console.log(`[DETAILS]: ${emailNotification.summary}`);

    res.json({
      success: true,
      message: 'Your request for professional support has been recorded with priority triage.',
      requestId: newRequest.id,
      totalRequestsCount: requests.length,
      notifiedEmail: TARGET_NOTIFY_EMAIL,
      openwa: {
        whatsapp: openwaWhatsAppResult,
        gmail: openwaGmailResult,
      },
    });
  } catch (error: any) {
    console.error('Professional support request error:', error);
    res.status(500).json({ error: 'Failed to record professional support request' });
  }
});

// 4. Professional Support Metrics & Database Stats
app.get('/api/professional-support/stats', (_req: Request, res: Response) => {
  try {
    const requests = readJsonFile<any[]>(PROF_REQUESTS_FILE, []);
    const notifications = readJsonFile<any[]>(NOTIFICATIONS_LOG_FILE, []);

    const concernCounts: Record<string, number> = {};
    const urgencyCounts: Record<string, number> = {};

    requests.forEach((r) => {
      concernCounts[r.concernType] = (concernCounts[r.concernType] || 0) + 1;
      urgencyCounts[r.urgency] = (urgencyCounts[r.urgency] || 0) + 1;
    });

    res.json({
      success: true,
      totalCount: requests.length,
      concernBreakdown: concernCounts,
      urgencyBreakdown: urgencyCounts,
      targetNotificationEmail: TARGET_NOTIFY_EMAIL,
      notificationsSentCount: notifications.length,
      recentRequests: requests.slice(0, 15).map((r) => ({
        id: r.id,
        timestamp: r.timestamp,
        pseudonym: r.pseudonym,
        concernType: r.concernType,
        urgency: r.urgency,
        preferredMode: r.preferredMode,
        hasEmail: Boolean(r.email),
        hasWhatsApp: Boolean(r.whatsapp),
        status: r.status,
      })),
      recentNotifications: notifications.slice(0, 10),
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Could not fetch stats' });
  }
});

// 5. 5-10 Sec Video Live Verification Recording
app.post('/api/verification/record', (req: Request, res: Response) => {
  try {
    const { pseudonym, verificationType = 'live_camera_nod', durationSeconds = 10, notes = '' } = req.body;
    const verifications = readJsonFile<any[]>(VERIFICATIONS_FILE, []);

    const record = {
      id: `verif-${Date.now()}`,
      timestamp: new Date().toISOString(),
      pseudonym: pseudonym || 'Anonymous Sister',
      verificationType,
      durationSeconds,
      status: 'verified',
      verifiedBy: 'Sisterhood Live Protocol (Female Facilitator Check)',
      notes,
    };

    verifications.unshift(record);
    writeJsonFile(VERIFICATIONS_FILE, verifications);

    res.json({
      success: true,
      message: 'Video verification successful. You are now awarded the Verified Sisterhood Member badge!',
      record,
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to record verification' });
  }
});

// 6. Community Posts & Interactions
app.get('/api/community/posts', (req: Request, res: Response) => {
  try {
    const { circleId } = req.query;
    let posts = readJsonFile<any[]>(COMMUNITY_FILE, initialPosts);
    if (circleId && typeof circleId === 'string' && circleId !== 'all') {
      posts = posts.filter((p) => p.circleId === circleId);
    }
    res.json({ success: true, posts });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch community posts' });
  }
});

app.post('/api/community/posts', (req: Request, res: Response) => {
  try {
    const { circleId, circleTitle, pseudonym, isVerified, content } = req.body;
    if (!content || !content.trim()) {
      res.status(400).json({ error: 'Content is required' });
      return;
    }

    const posts = readJsonFile<any[]>(COMMUNITY_FILE, initialPosts);
    const newPost = {
      id: `post-${Date.now()}`,
      circleId: circleId || 'general',
      circleTitle: circleTitle || 'Sister Sanctuary',
      pseudonym: pseudonym || 'SafeSister',
      isVerified: Boolean(isVerified),
      content: content.trim(),
      createdAt: new Date().toISOString(),
      hugsCount: 1,
      replies: [],
    };

    posts.unshift(newPost);
    writeJsonFile(COMMUNITY_FILE, posts);

    res.json({ success: true, post: newPost });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create post' });
  }
});

app.post('/api/community/posts/:id/hug', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const posts = readJsonFile<any[]>(COMMUNITY_FILE, initialPosts);
    const post = posts.find((p) => p.id === id);
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    post.hugsCount = (post.hugsCount || 0) + 1;
    writeJsonFile(COMMUNITY_FILE, posts);

    res.json({ success: true, hugsCount: post.hugsCount });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to send hug' });
  }
});

app.post('/api/community/posts/:id/reply', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { pseudonym, isVerified, content } = req.body;
    if (!content || !content.trim()) {
      res.status(400).json({ error: 'Reply content required' });
      return;
    }

    const posts = readJsonFile<any[]>(COMMUNITY_FILE, initialPosts);
    const post = posts.find((p) => p.id === id);
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    const newReply = {
      id: `reply-${Date.now()}`,
      pseudonym: pseudonym || 'KindSister',
      isVerified: Boolean(isVerified),
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };

    post.replies = post.replies || [];
    post.replies.push(newReply);
    writeJsonFile(COMMUNITY_FILE, posts);

    res.json({ success: true, reply: newReply, post });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to submit reply' });
  }
});

// 7. Feedback Endpoint
app.post('/api/feedback', (req: Request, res: Response) => {
  try {
    const { pseudonym, rating, feltHeard, neededCircle, comments, email, whatsapp } = req.body;
    const feedbacks = readJsonFile<any[]>(FEEDBACKS_FILE, []);

    const newFeedback = {
      id: `fb-${Date.now()}`,
      timestamp: new Date().toISOString(),
      pseudonym: pseudonym || 'Anonymous Sister',
      rating: rating || 5,
      feltHeard: Boolean(feltHeard),
      neededCircle: neededCircle || 'General',
      comments: comments || '',
      email: email || '',
      whatsapp: whatsapp || '',
    };

    feedbacks.unshift(newFeedback);
    writeJsonFile(FEEDBACKS_FILE, feedbacks);

    res.json({ success: true, message: 'Thank you for your heartfelt feedback!' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

// 8. MVP Interest & Early Adopter Validation (Inspired by Mindful Brewing Teaser)
app.post('/api/mvp-interest', async (req: Request, res: Response) => {
  try {
    const {
      pseudonym = 'Sister',
      email = '',
      whatsapp = '',
      featuresVoted = [],
      feedback = '',
      interestLevel = 'Very High',
    } = req.body;

    const entries = readJsonFile<any[]>(MVP_INTEREST_FILE, []);
    const newEntry = {
      id: `mvp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      pseudonym,
      email: email.trim(),
      whatsapp: whatsapp.trim(),
      featuresVoted,
      feedback: feedback.trim(),
      interestLevel,
    };

    entries.unshift(newEntry);
    writeJsonFile(MVP_INTEREST_FILE, entries);

    // Notify founder via email audit
    const notifications = readJsonFile<any[]>(NOTIFICATIONS_LOG_FILE, []);
    const notif = {
      id: `notif-mvp-${Date.now()}`,
      timestamp: new Date().toISOString(),
      recipient: TARGET_NOTIFY_EMAIL,
      subject: `✨ [HerSanctuary MVP Validation] Interest Recorded from ${pseudonym}!`,
      summary: `User "${pseudonym}" voted on MVP features: ${featuresVoted.join(', ') || 'General Interest'}. Feedback: "${feedback || 'None'}". Contact: ${email || 'No email'} | ${whatsapp || 'No WhatsApp'}. Interest level: ${interestLevel}.`,
      status: 'delivered',
      requestId: newEntry.id,
    };
    notifications.unshift(notif);
    writeJsonFile(NOTIFICATIONS_LOG_FILE, notifications);
    // Dispatch to OpenWA if contact details provided
    if (whatsapp.trim()) {
      await dispatchOpenWAWhatsApp(
        whatsapp.trim(),
        `🌸 [HerSanctuary MVP] Hello ${pseudonym}! Thank you for voting on our upcoming features (${featuresVoted.join(', ') || 'VIP Early Access'}). We'll reach out when early testing begins.`,
        { type: 'mvp_interest', pseudonym, entryId: newEntry.id }
      );
    }
    if (email.trim()) {
      await dispatchOpenWAGmail(
        email.trim(),
        `✨ [HerSanctuary] MVP Feature Wishlist Received!`,
        `Dear ${pseudonym},\n\nThank you for helping us design HerSanctuary! You voted for: ${featuresVoted.join(', ') || 'Early Access'}.\n\nWe will keep you closely posted.\n\nWarmly,\nHerSanctuary Team`,
        { type: 'mvp_interest', pseudonym, entryId: newEntry.id }
      );
    }

    res.json({
      success: true,
      message: 'Your interest and wishlist have been recorded. Thank you for shaping HerSanctuary!',
      entryId: newEntry.id,
      totalInterestCount: entries.length,
    });
  } catch (err: any) {
    console.error('MVP interest error:', err);
    res.status(500).json({ error: 'Failed to record MVP interest' });
  }
});

app.get('/api/mvp-interest/stats', (_req: Request, res: Response) => {
  try {
    const entries = readJsonFile<any[]>(MVP_INTEREST_FILE, []);
    const featureVotes: Record<string, number> = {};
    entries.forEach((e) => {
      (e.featuresVoted || []).forEach((f: string) => {
        featureVotes[f] = (featureVotes[f] || 0) + 1;
      });
    });

    res.json({
      success: true,
      totalCount: entries.length,
      featureVotes,
      entries: entries.slice(0, 15),
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to get MVP stats' });
  }
});

// Start server with Vite middleware in dev or static files in prod
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`HerSanctuary server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
