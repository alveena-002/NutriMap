# NutriMap — AI Food Security & Zero Hunger Dashboard

Hackathon-ready full-stack demo: Pakistani food-insecurity cockpit with React (Vite) + Flask, Mapbox-ready GIS, Hugging Face AI fallbacks, and SDG-aligned analytics.

## Quick start

### 1. Backend (Flask)

```bash
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python app.py
```

API listens on `http://127.0.0.1:5000`. Optionally set `HF_TOKEN` in `.env` ([Hugging Face token](https://huggingface.co/settings/tokens)).

### 2. Frontend (Vite + React)

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Open `http://localhost:5173`. The dev server proxies `/api/*` to the Flask backend.

### 3. Mapbox (optional)

Add your token to `frontend/.env`:

```env
VITE_MAPBOX_ACCESS_TOKEN=pk.xx...
```

If omitted, **Hunger Map** uses an interactive SVG fallback (still clickable).

## Routes (React Router)

| Path            | Page          |
|-----------------|---------------|
| `/`             | Dashboard     |
| `/hunger-map`   | Hunger Map    |
| `/meal-finder`  | Meal Finder   |
| `/ai-assistant` | AI Assistant  |

Unknown paths redirect to `/`.

## AI endpoints (HF + mocks)

| Method | Endpoint              | Models / behavior |
|--------|-----------------------|-------------------|
| `POST` | `/api/assistant`      | Routes chat via zero-shot + SST-2 + optional summarization |
| `POST` | `/api/ai/zero-shot`   | `facebook/bart-large-mnli` |
| `POST` | `/api/ai/classify`    | `distilbert-base-uncased-finetuned-sst-2-english` |
| `POST` | `/api/ai/summarize`   | `facebook/bart-large-cnn` |

Cold models or rate limits return deterministic **mock** JSON so the UI never dead-ends.

## Stack

- **Frontend:** React 19, React Router DOM, Tailwind CSS v4 (`@tailwindcss/vite`), Recharts, Mapbox GL, Axios  
- **Backend:** Flask + flask-cors + requests  
- **Data:** Mock JSON for regions, KPIs, and meals  

## Production build

```bash
cd frontend && npm run build
```

Serve `frontend/dist/` via any static host; configure reverse proxy `/api` to Flask or set `VITE_API_URL` at build time.

---

NutriMap is a demonstration project — figures are illustrative, not official statistics.
