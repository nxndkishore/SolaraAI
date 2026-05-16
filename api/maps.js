export default async function handler(req, res) {
  const origin = req.headers.origin || '';
  const allowed = ['https://solarainanda.vercel.app', 'http://localhost:3000', 'http://localhost'];
  if (allowed.some(o => origin.startsWith(o))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Maps API not configured' });

  const path = req.url.replace(/^\/api\/maps/, '') || '/v1/3dtiles/root.json';
  const sep = path.includes('?') ? '&' : '?';
  const googleUrl = `https://tile.googleapis.com${path}${sep}key=${apiKey}`;

  try {
    const response = await fetch(googleUrl, { headers: { 'User-Agent': 'Solara/1.0' } });
    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const buffer = await response.arrayBuffer();
    res.setHeader('Content-Type', contentType);
    res.status(response.status).send(Buffer.from(buffer));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
