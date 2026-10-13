# Twacha backend (v0.4)

FastAPI + SQLAlchemy + ONNX acne model. Photos are processed in memory and never stored.

## Run
    pip install -r requirements.txt
    uvicorn app.main:app --reload --host 0.0.0.0
    open http://localhost:8000/docs

Render start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

## Endpoints
| Method | Path | Purpose |
|---|---|---|
| POST | /api/scan/ | multipart: `image` (required), `city` (optional). Returns scores, AQI, recommendations, `quality_notes` |
| GET  | /api/history/?limit=30 | past scans + program day (limit 1-200) |
| POST | /api/log/ | `{"foods_eaten": [...], "log_date": "YYYY-MM-DD"?}` |
| GET  | /api/log/?limit=7 | recent food logs |
| GET  | /api/foods/ | food names for the log picker |
| GET  | /health | liveness + whether the acne model is loaded |
| DELETE | /api/data/ | deletes every record stored for the calling device ID |
| POST | /demo/seed, /demo/reset | only when `ENABLE_DEMO=1`. SYNTHETIC history for the class demo (affects only the calling device ID) |

Errors: 422 with a readable `detail` (no face, too dark/blurry, not an image), 413 if larger than 10 MB.

## Per-device data
The app sends an anonymous random `X-Device-Id` header (8 to 64 letters, digits or dashes). Scans, food logs and the 30-day program are stored per ID. A missing or malformed header uses the shared ID `anonymous`. Older databases get the new columns automatically at startup.

## Environment variables
| Var | Meaning |
|---|---|
| WAQI_TOKEN | free token from aqicn.org. Without it the API reports `environment.source = "unavailable"` |
| DEFAULT_CITY | city when the app sends none (default bhopal) |
| DEMO_AQI | e.g. 215. Used only if live AQI fails; response is labelled `source: "demo"` |
| ENABLE_DEMO | `1` to enable /demo/* endpoints |
| CORS_ORIGINS | comma list, default `*` |
| DATABASE_URL | default sqlite:///./twacha.db (Render free disk is wiped on redeploy) |
| USE_REAL_ACNE / REQUIRE_FACE / USE_CLASSICAL_CV | feature switches (defaults: on / on / on) |

## Tests
    pip install pytest httpx
    pytest -q
    TWACHA_PHOTOS=/folder/with/face/photos pytest -q      # also runs real photos

## What is and is not reliable (be honest with the professor)
* Acne score: ACNE04 MobileNetV2, macro-F1 0.60 on 56 test images. Weak on beards, darker skin, frontal selfies.
  Beard detected -> forehead and cheeks only (a heuristic).
* Redness / dryness / skin tone (ITA): simple colour/texture estimates, NOT calibrated against any reference.
* Nutrient weights in recommender.py are team-chosen placeholders. Source notes in app/evidence.py were read and
  summarised honestly; none is rated "clinical".
* No accounts or login: data is tied to an anonymous device ID. Reinstalling the app creates a new ID, so old records become unreachable (they can still be removed by the team).
* Not a medical device or diagnosis.
