import os
import random
from datetime import date, datetime, timedelta, timezone

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine, SessionLocal, ensure_columns
from .models import SkinScan, Program, DietaryLog
from .deps import get_device_id
from .routers import scans

def _utcnow():
    return datetime.now(timezone.utc).replace(tzinfo=None)


app = FastAPI(title="Twacha API", version="0.4.0")

# Flutter web / browser clients need CORS; mobile apps ignore it.
app.add_middleware(CORSMiddleware, allow_origins=os.getenv("CORS_ORIGINS", "*").split(","),
                   allow_methods=["*"], allow_headers=["*"])
app.include_router(scans.router)


@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)
    ensure_columns()


@app.get("/")
def root():
    return {"status": "ok", "service": "twacha-api", "version": app.version}


@app.get("/health")
def health():
    from .cv_pipeline import real_acne_enabled
    return {"status": "ok", "acne_model_loaded": bool(real_acne_enabled())}


# ── Demo helpers (off unless ENABLE_DEMO=1) ──────────────────────────────────
# For the class presentation only: a 30-day program needs 30 days of history.
# These rows are SYNTHETIC. Say so on stage. Do not enable in any real deployment.

def _demo_enabled():
    if os.getenv("ENABLE_DEMO", "0") != "1":
        raise HTTPException(status_code=404, detail="Not found")


@app.post("/demo/seed", tags=["demo"])
def demo_seed(days: int = 14, start_acne: float = 6.5, end_acne: float = 3.5, seed: int = 7,
              device_id: str = Depends(get_device_id)):
    """Create `days` synthetic daily scans ending yesterday with a gently improving acne trend."""
    _demo_enabled()
    days = max(3, min(days, 29))
    rng = random.Random(seed)
    db = SessionLocal()
    try:
        for m in (SkinScan, Program, DietaryLog):
            db.query(m).filter_by(device_id=device_id).delete()
        today = date.today()
        db.add(Program(start_date=today - timedelta(days=days), total_days=30, device_id=device_id, is_demo=True))
        for i in range(days):
            frac = i / max(days - 1, 1)
            acne = start_acne + (end_acne - start_acne) * frac + rng.uniform(-0.4, 0.4)
            when = _utcnow() - timedelta(days=days - i)
            db.add(SkinScan(
                created_at=when, day_number=i + 1, device_id=device_id,
                acne_score=round(max(0, min(10, acne)), 1),
                redness_score=round(max(0, min(10, 4.0 - 1.5 * frac + rng.uniform(-0.3, 0.3))), 1),
                dryness_score=round(max(0, min(10, 5.0 - 1.0 * frac + rng.uniform(-0.3, 0.3))), 1),
                ita_value=40.0, local_aqi=None, pm25=None, dominant_pollutant=None, aqi_band=None,
            ))
        db.commit()
        return {"seeded_days": days, "note": "synthetic demo data"}
    finally:
        db.close()


@app.post("/demo/reset", tags=["demo"])
def demo_reset(device_id: str = Depends(get_device_id)):
    _demo_enabled()
    db = SessionLocal()
    try:
        for m in (SkinScan, Program, DietaryLog):
            db.query(m).filter_by(device_id=device_id).delete()
        db.commit()
        return {"reset": True}
    finally:
        db.close()
