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

  // Get the full original path from the x-matched-path header or fallback
  const originalUrl = req.headers['x-vercel-deployment-url']
    ? req.url
    : (req.headers['x-original-url'] || req.url);

  // Strip /api/maps prefix to get the Google path
  const googlePath = originalUrl.replace(/^\/api\/maps/, '') || '/v1/3dtiles/root.json';
  const cleanPath = googlePath.split('?')[0] || '/v1/3dtiles/root.json';
  
  // Build Google URL - always use root.json as Cesium will follow redirects for tiles
  const googleUrl = `https://tile.googleapis.com/v1/3dtiles/root.json?key=${apiKey}`;

  try {
    const response = await fetch(googleUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const buffer = await response.arrayBuffer();
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.status(response.status).send(Buffer.from(buffer));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
