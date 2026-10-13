# Twacha (त्वचा) 🌿
### AI Skin Pattern Investigation & Personalized Skin-Diet Prescription Platform

> **Twacha** investigates a user's unique facial skin pattern and physiological characteristics through computer vision and clinical assessment, and automatically prescribes a targeted, personalized dietary nutrition plan combined with natural homemade botanical remedies to heal the skin from within.

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
3. **Prescribe Personalized Diet**: Recommends exact whole-food nutrition mapped to their skin pattern (e.g., Barnyard Millets for low-glycemic oil control, Moong Dal for tissue repair, Pumpkin Seeds for zinc & barrier strength, Amla for collagen synthesis).
4. **Complement with Natural Skincare**: Pairs the internal diet with clean, homemade topical remedies (Honey & Clay masks, Chamomile & Aloe mists, Rose Water).
5. **Track Progression Over Time**: Visual timeline tracks skin improvement across 3–4 day check-in intervals with comparative photos and health scores.

---

## 🌟 Key Features

### 🔍 1. Clinical AI Skin Pattern Scanner
- Real-time facial diagnostic studio with dynamic computer-vision mesh overlay.
- Detects skin patterns: dry/combination, reactive erythema, sebum imbalance, and barrier stress.
- Supports both live webcam/phone camera streaming and simulated clinical subjects.

### 🥗 2. Personalized Diet & Nutrition Engine
- Built-in nutritional logic drawing from evidence-based dermatology and the Indian Nutrient Databank (INDB).
- Custom meal and ingredient recommendations:
  - **Barnyard Millets**: Low glycemic index to curb insulin spikes and regulate sebum production.
  - **Split Yellow Moong Dal**: Bioavailable amino acids for cellular epidermal regeneration.
  - **Pumpkin Seeds & Oats**: Rich in bio-zinc and beta-glucan to soothe inflammation and strengthen the lipid barrier.
  - **Indian Gooseberry (Amla)**: High natural Vitamin C concentration for antioxidant defense and melanin regulation.

### 🔄 3. Dual-Category Plan Switcher
- Segmented tablet switch button allowing users to effortlessly toggle between:
  - **Diet Foods**: Specific items, nutritional benefits, and preparation guidelines.
  - **Skincare Products**: Clean homemade botanical remedies and barrier-supportive solutions.

### 📅 4. Interactive Skin Timeline Tracker
- Chronological timeline with entries logged every 3–4 days (newest date on top).
- Interactive dropdown accordions revealing overall progress, health score metrics (0–100), logged remedy history, and photographic clinical previews.

### 🧘 5. Mind-Body Balance & Golden Chakra Splash
- Dynamic animated onboarding splash featuring a meditating yogic silhouette and 7 vibrant chakras.
- Reflects holistic wellness—calibrating dosha phototypes, prana balance, and natural bio-actives.

### 📱 6. Multi-Platform: Web & Native Mobile App
- **Web App**: Responsive editorial interface accessible across any browser.
- **Native Android APK**: Packaged via Capacitor for edge-to-edge mobile screens, offline functionality, and direct installation on Android devices.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React 18, Vite |
| **Styling & System** | Vanilla CSS Design System, Google Fonts (*Playfair Display*, *Plus Jakarta Sans*) |
| **Iconography** | Lucide React |
| **Mobile Runtime** | Capacitor 6 (Native Android wrapper) |
| **Hosting & CI/CD** | Netlify (Automated Git builds & SPA rewrites) |
| **Build Tools** | Gradle 8.14, Android SDK Platform 34/35, Node.js |

---

## 🚀 Running Locally

### 1. Web Application
```bash
# Navigate to web directory
cd web

# Install dependencies
npm install

# Start development server
npm run dev
```

- Open `http://localhost:5173/` for the web experience.
- Open `http://localhost:5173/?mode=app` for direct mobile app simulation.

### 2. Building for Production
```bash
cd web
npm run build
```

---

## 📲 Building & Installing the Android APK

To build the native Android `.apk` file:

```bash
# 1. Sync compiled assets to Android project
cd web
npm run build
npx cap sync android

# 2. Compile APK using Gradle
cd android
./gradlew assembleDebug

# 3. Install directly to a phone connected via USB
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

The compiled APK will be located at:
`web/android/app/build/outputs/apk/debug/app-debug.apk`

---

## 📂 Project Structure

```text
├── docs/                                # Technical research & architecture plans
├── netlify.toml                         # Netlify automated build and SPA redirect configuration
├── web/
│   ├── android/                         # Capacitor Native Android project
│   ├── public/
│   │   ├── _redirects                   # Netlify single-page redirect rule
│   │   ├── manifest.json                # PWA configuration
│   │   └── favicon.svg                  # Brand favicon
│   ├── src/
│   │   ├── components/
│   │   │   ├── PhoneSimulator.jsx       # Complete mobile app (Scan, Timeline, Diet Plan, Profile)
│   │   │   ├── ScanStudioModal.jsx      # AI Diagnostic face scanner modal
│   │   │   ├── Hero.jsx                 # Web landing hero
│   │   │   ├── Navbar.jsx               # Navigation bar
│   │   │   └── ...                      # Web platform sections
│   │   ├── data/
│   │   │   └── mockData.js              # Dietary databank, clinical evidence & timeline data
│   │   ├── App.jsx                      # App root router
│   │   └── index.css                    # Design system tokens and layout
│   ├── capacitor.config.json            # Capacitor app configuration
│   ├── package.json                     # Project scripts and dependencies
│   └── vite.config.js                   # Vite build configuration
├── .gitignore                           # Excluded build artifacts and node_modules
└── README.md                            # Primary documentation
```

---

## 📄 License
This project is open-source and licensed under the MIT License.
