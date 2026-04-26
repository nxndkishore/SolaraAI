// Vercel serverless function — proxies Anthropic API calls server-side
// The ANTHROPIC_API_KEY env var is set in Vercel dashboard, never in git

const RATE_LIMIT = 20; // requests per IP per hour
const requests = new Map();

export default async function handler(req, res) {
  // CORS — only allow from our own domain
  const origin = req.headers.origin || '';
  const allowed = ['https://reonicnanda.vercel.app', 'http://localhost:3000'];
  if (allowed.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Rate limiting — 20 AI calls per IP per hour
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown';
  const now = Date.now();
  const WINDOW = 60 * 60 * 1000;

  let rec = requests.get(ip) || { count: 0, start: now };
  if (now - rec.start > WINDOW) rec = { count: 0, start: now };
  rec.count++;
  requests.set(ip, rec);

  if (rec.count > RATE_LIMIT) {
    return res.status(429).json({
      error: { message: `Rate limit reached (${RATE_LIMIT} requests/hour). Please try again later.` }
    });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: { message: 'API not configured — contact the site owner.' } });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: { message: 'Proxy error: ' + err.message } });
  }
}
