# Twacha (त्वचा) 🌿
### AI Skin Pattern Investigation & Personalized Skin-Diet Prescription Platform

[![FastAPI](https://img.shields.io/badge/FastAPI-0.111.0-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Capacitor](https://img.shields.io/badge/Capacitor-6-119EFF?logo=capacitor&logoColor=white)](https://capacitorjs.com)
[![ONNX Runtime](https://img.shields.io/badge/ONNX-Runtime-005CED?logo=onnx&logoColor=white)](https://onnxruntime.ai)
[![Python](https://img.shields.io/badge/Python-3.10%20|%203.11%20|%203.12%20|%203.13-3776AB?logo=python&logoColor=white)](https://www.python.org)

> **Twacha** investigates a user's unique facial skin pattern and physiological characteristics through computer vision and clinical assessment, automatically prescribing a targeted, personalized dietary nutrition plan combined with natural homemade botanical remedies to heal the skin from within.

---

## 💡 How Twacha Works

```
 ┌────────────────────────┐      ┌────────────────────────┐      ┌─────────────────────────┐
 │   1. INVESTIGATION     │      │   2. SKIN PATTERN      │      │    3. TAILORED DIET     │
 │  AI Face Mesh Scan &   │ ───► │   Analysis & Dosha     │ ───► │  Targeted Nutritional   │
 │  Skin Pattern Analysis │      │   Phototype Mapping    │      │  Plan & Botanical Care  │
 └────────────────────────┘      └────────────────────────┘      └─────────────────────────┘
```

1. **Investigate Skin Pattern**: The user scans their skin using the interactive diagnostic camera. Twacha examines texture, barrier integrity, erythema (redness), pore congestion, and hydration levels calibrated for Indian skin tones (Fitzpatrick III–VI).
2. **Diagnose & Correlate**: Correlates the skin condition with internal nutrient deficiencies, gut-skin axis health, and dosha balance (Vata / Pitta / Kapha).
3. **Prescribe Personalized Diet**: Recommends exact whole-food nutrition mapped to their skin pattern (e.g., Barnyard Millets for low-glycemic oil control, Moong Dal for tissue repair, Pumpkin Seeds for bio-zinc & barrier strength, Amla for collagen synthesis).
4. **Complement with Natural Skincare**: Pairs the internal diet with clean, homemade topical remedies (Honey & Clay masks, Chamomile & Aloe mists, Rose Water).
5. **Track Progression Over Time**: Visual timeline tracks skin improvement across 3–4 day check-in intervals with comparative photos and health scores.

---

## 📁 Repository Structure

```
├── backend/                  # FastAPI REST API & Computer Vision inference engine
│   ├── alembic/              # Database schema migrations
│   ├── app/                  # Application core, CV pipeline, and recommendation engine
│   │   ├── routers/          # REST route handlers (/api/scan, /api/history, /api/log)
│   │   ├── cv_pipeline.py    # Face detection, quality checks, and ONNX model pipeline
│   │   ├── classical_cv.py   # Redness, dryness, and ITA skin tone estimators
│   │   └── recommender.py    # Targeted nutritional prescription logic
│   ├── ml/                   # Production ONNX MobileNetV2 acne grading model
│   ├── tests/                # Test suite with mock & real photo validation
│   ├── requirements.txt      # Production Python dependencies
│   └── start_server.ps1      # Quickstart server script
│
├── frontend/                 # User interface & native mobile wrapper
│   └── web/                  # React 18, Vite, Vanilla CSS design system & Capacitor
│       ├── android/          # Native Android Studio project & Gradle configuration
│       ├── src/              # React components, diagnostic camera, timeline & state
│       ├── package.json      # Node.js dependencies & scripts
│       └── capacitor.config.json # Capacitor mobile runtime configuration
│
├── notebooks/                # PyTorch & ONNX training & evaluation notebooks
│   ├── twacha_acne_training.ipynb
│   └── twacha_acne_training_v2.ipynb
│
├── docs/                     # Architecture blueprints, research papers & presentation
│   ├── Skin_Dietary_Wellness_Tracker_Final_Blueprint.md
│   ├── Twacha_Backend_Implementation_Plan.md
│   ├── Twacha_Frontend_Implementation_Plan.md
│   └── Twacha_Master_Implementation_Plan.md
│
├── netlify.toml              # Continuous deployment configuration for web
└── README.md                 # Project overview and run guide
```

---

## 🚀 Quickstart Guide

### 1. Setting Up and Running the Backend

#### Prerequisites
- Python 3.10 to 3.13 installed
- Git

#### Installation
```bash
# 1. Navigate to the backend directory
cd backend

# 2. (Optional) Create and activate a virtual environment
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Start the backend server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The backend is now live:
- **Interactive OpenAPI Docs**: `http://localhost:8000/docs`
- **Health Check**: `http://localhost:8000/health`

---

### 2. Setting Up and Running the Frontend (Web)

```bash
# 1. Navigate to the frontend web directory
cd frontend/web

# 2. Install dependencies
npm install

# 3. Configure backend URL (optional - defaults to http://localhost:8000)
cp .env.example .env

# 4. Start the Vite development server
npm run dev
```

- Open `http://localhost:5173/` for the editorial desktop/tablet experience.
- Open `http://localhost:5173/?mode=app` for direct mobile interface simulation.

---

### 3. Running on a Physical Android Phone

#### Option A: Direct APK Installation (Fastest)
1. Install `app-debug.apk` directly on your Android phone.
2. If connecting to a local backend, launch an **ngrok** tunnel:
   ```bash
   ngrok http 8000
   ```
3. Set your public ngrok URL in `frontend/web/.env` before building:
   ```env
   VITE_API_BASE_URL=https://your-tunnel.ngrok-free.dev
   ```

#### Option B: Build from Source
```bash
cd frontend/web

# Build the web bundle
npm run build

# Sync with the Android Capacitor project
npx cap sync android

# Build the debug APK via Gradle
cd android
./gradlew assembleDebug

# Install onto your connected Android device via ADB
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

---

## 🔬 Computer Vision & ML Pipeline

| Component | Architecture / Method | Output |
|---|---|---|
| **Face Localization** | Multi-scale Haar cascades with margin padding & border replication | Tight bounding box `(x, y, w, h)` |
| **Image Quality** | Laplacian variance & mean luminance filtering | Sharpness & brightness validation |
| **Acne Assessment** | ONNX MobileNetV2 (RGB 224×224 normalized, anchor-weighted logits) | Continuous score `0.0 – 10.0` |
| **Erythema (Redness)** | Normalized red-chroma excess in Lab/YCrCb color space | Continuous score `0.0 – 10.0` |
| **Hydration / Dryness** | High-frequency gray-level co-occurrence & micro-texture variance | Continuous score `0.0 – 10.0` |
| **Skin Tone (ITA)** | Individual Typology Angle ($ITA^\circ = \arctan((L - 50)/b) \times 180/\pi$) | Calibrated Fitzpatrick scale |

> **Privacy by Design**: Images are decoded and analyzed purely in volatile memory. No raw user photo is ever written to disk or stored in the database.

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/scan/` | Uploads face photo (`image`) + optional `city`. Returns CV scores, AQI data, and nutrient targets. |
| `GET` | `/api/history/` | Returns past scan history and progressive 30-day program day number. |
| `POST` | `/api/log/` | Logs consumed foods for dietary correlation (`{"foods_eaten": [...]}`). |
| `GET` | `/api/log/` | Retrieves recent dietary logs (last 7 days). |
| `GET` | `/api/foods/` | Returns verified Indian whole-food names for the dietary log picker. |
| `GET` | `/health` | Server liveness check and ONNX model status verification. |
| `DELETE`| `/api/data/` | Full GDPR-compliant data wipe for the calling anonymous device ID. |

---

## 🛡️ Clinical Disclaimer
Twacha is an experimental health-tech wellness platform designed for educational and wellness tracking purposes. The estimates provided for acne severity, erythema, and skin hydration are algorithmic assessments and do not constitute formal medical diagnosis. For acute dermatological conditions, consult a certified dermatologist.
