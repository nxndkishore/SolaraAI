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

## Security notes

- API keys are stored in `localStorage` — appropriate for personal/hackathon use
- For production, consider a thin backend proxy so keys are server-side only

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
