# Dhaka Hangout Finder

Find the best hangout spots in Dhaka — parks, cafes, restaurants and more, filtered by your location and budget.

## Tech Stack

- **React** + **Vite** — fast frontend
- **Tailwind CSS** — styling
- **Leaflet** + **OpenStreetMap** — free maps, no API key needed
- **Vercel** — hosting

## Running Locally

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Deploying to Vercel

1. Push this repo to GitHub
2. Go to vercel.com → New Project → Import from GitHub
3. Vercel auto-detects Vite — click Deploy

Done. No environment variables needed for V1.

## Project Structure

```
src/
  components/
    HomeScreen.jsx     # Location + filters UI
    ResultsScreen.jsx  # Filtered list of places
    DetailScreen.jsx   # Full place detail + map
  data/
    places.js          # All 20 seed places (add more here!)
  utils/
    distance.js        # Haversine distance calculation
    categoryStyles.js  # Color config per category
  App.jsx              # Screen routing
  main.jsx             # Entry point
  index.css            # Global styles + Tailwind
```

## Adding More Places

Open `src/data/places.js` and add objects to the `PLACES` array.

Each place needs:
- `name`, `category`, `lat`, `lng`, `budget`, `budgetMax`
- `bestFor` array, `activities` array, `bestTime`
- `facilities` object: `{ food, seating, photography, parking }`

Get lat/lng from Google Maps (right-click any location → copy coordinates).

## Roadmap

- **V2** — Budget & "Best For" filters, smarter search
- **V3** — Saved lists (localStorage)
- **V4** — Community photos & ratings (Supabase)
- **V5** — AI Planner: describe your trip, get a full itinerary
