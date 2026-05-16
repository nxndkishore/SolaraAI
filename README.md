# ☀️ Solara - AI Solar System Designer

AI-powered residential solar system design using Google Photorealistic 3D Tiles, PVGIS JRC meteorological data, and Claude AI.

## Environment Variables (set in Vercel dashboard)

- `ANTHROPIC_API_KEY` — Claude AI key for system design generation
- `GOOGLE_MAPS_API_KEY` — Google Map Tiles API key for 3D roof analysis

## File structure

```
index.html        ← main app (no API keys)
vercel.json       ← routing config
api/
  chat.js         ← Anthropic proxy (rate limited: 20 req/IP/hr)
  maps.js         ← Google Maps proxy (key server-side only)
```
