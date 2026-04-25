# ☀️ Solara — AI Solar System Designer

AI-powered residential solar system design using Google Photorealistic 3D Tiles, PVGIS JRC meteorological data, and Claude AI.

## What it does

1. **3D Roof Analysis** — loads Google's photorealistic 3D building models, lets you click on a roof surface to detect pitch and orientation, or draw a polygon to measure area precisely
2. **PVGIS Solar Data** — fetches real irradiation data from the European Commission's JRC API for any EU location
3. **AI System Design** — Claude AI designs a complete system (PV modules, inverter, battery, heat pump) with real European products
4. **Financial modelling** — payback period, 25-year IRR/NPV, KfW/BAFA subsidy estimates
5. **Refinement chat** — multi-turn conversation to adjust any aspect of the design

## Stack

- Pure HTML/CSS/JS — zero build step, zero dependencies to install
- [CesiumJS](https://cesium.com) v1.118.2 (CDN) — 3D tiles renderer
- [Chart.js](https://chartjs.org) v4.4.1 (CDN) — monthly production chart
- [PVGIS JRC API](https://re.jrc.ec.europa.eu/api/) — EU solar radiation data
- [Nominatim](https://nominatim.openstreetmap.org) — free geocoding
- [Anthropic Claude API](https://anthropic.com) — AI system design
- [Google Map Tiles API](https://developers.google.com/maps/documentation/tile) — photorealistic 3D buildings

## API Keys

Users add their own API keys via the **API Keys** button in the top right. Keys are stored in `localStorage` — they never leave the user's browser.

### Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a project (or select existing)
3. Go to **APIs & Services → Library**
4. Search for and enable **Map Tiles API**
5. Go to **APIs & Services → Credentials → Create Credentials → API Key**
6. (Optional but recommended) Restrict the key to Map Tiles API only

### Anthropic API Key

1. Go to [console.anthropic.com](https://console.anthropic.com/account/keys)
2. Create a new API key
3. Paste it into the Solara settings panel

> **Note:** The tool still works without an Anthropic key in environments where the API is proxied (e.g. Claude.ai artifacts). For standalone deployment, users need their own key.

## Deploy to Vercel

### Option A — Vercel CLI (fastest)

```bash
# Install Vercel CLI if you don't have it
npm i -g vercel

# Clone / enter the repo
cd solara

# Deploy
vercel

# Follow prompts — it's a static site, no framework needed
# Vercel auto-detects the vercel.json config
```

### Option B — GitHub + Vercel dashboard

1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your GitHub repo
4. Framework preset: **Other** (no framework)
5. Build command: *(leave empty)*
6. Output directory: *(leave empty or `.`)*
7. Click **Deploy**

That's it — Vercel serves `index.html` for all routes.

## Local development

```bash
# Any static server works
npx serve .
# or
python3 -m http.server 3000
# or just open index.html directly in a browser
```

> Note: Google 3D Tiles requires a valid API key even for local testing.

## File structure

```
solara/
├── index.html      # Entire app — HTML, CSS, JS in one file
├── vercel.json     # Vercel routing config (all routes → index.html)
└── README.md
```

## Security notes

- API keys are stored in `localStorage` — appropriate for personal/hackathon use
- For production, consider a thin backend proxy so keys are server-side only
- The `vercel.json` adds basic security headers (no-sniff, no-frame, referrer policy)

## PVGIS API

The tool calls the European Commission's PVGIS API:

```
https://re.jrc.ec.europa.eu/api/v5_3/PVcalc
  ?lat=<latitude>
  &lon=<longitude>
  &peakpower=1          # 1 kWp reference system
  &loss=14              # system losses %
  &aspect=<az-180>      # azimuth offset from south
  &angle=<tilt>         # roof pitch degrees
  &pvtechchoice=crystSi
  &mountingplace=building
  &outputformat=json
```

Free, no key required, EU coverage only. Falls back to a latitude-based yield estimate for non-EU locations.

## License

MIT — use freely for hackathon, commercial, or personal projects.
