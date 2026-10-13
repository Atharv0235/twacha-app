# Twacha web and Android app

React 19 + Vite 8 + Capacitor 8. One codebase gives:

- a short website (landing page, privacy policy, terms), and
- the app view (`?mode=app`, or automatically on phones and inside the Android app).

## Run

```bash
npm install
cp .env.example .env      # set VITE_API_BASE_URL to your backend
npm run dev               # http://localhost:5173/   (add ?mode=app for the app view)
npm run lint && npm run build
```

`VITE_API_BASE_URL` is read at build time (set it in Netlify's environment variables as well).

## Settings to edit before the demo

`src/config.js`: `TEAM` (real names), `CONTACT_EMAIL`, and the API base URL fallback.

## Android

```bash
npm run build
npx cap sync android
cd android && ./gradlew assembleDebug
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

The manifest asks for camera permission. The scan screen uses a file input with `capture="user"` (the most reliable path in the Android WebView); "Live camera" is an extra that needs the permission. Test on a real phone over mobile data.

## Structure

```text
src/
  api/client.js         fetch wrapper, X-Device-Id, error messages, wake-up call
  api/image.js          resize and re-encode photos (drops EXIF), small on-phone thumbnails
  state/AppData.jsx     profile, latest result, history, food log (localStorage + API)
  config.js             team, contact, disclaimer text
  components/           website (Navbar, Landing, Footer, Privacy, Terms, ScanStudioModal)
  components/PhoneSimulator.jsx   app shell: splash -> onboarding -> tabs
  components/app/       Splash, Onboarding, Home/Scan/Timeline/Diet/About tabs, ScanCapture, ScanResult
```

Rules: never show invented data; keep the disclaimer on result screens; show the WAQI credit next to air quality; label redness and dryness as rough estimates.
