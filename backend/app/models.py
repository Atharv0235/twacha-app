from datetime import datetime, date
from sqlalchemy import Column, Integer, Float, String, DateTime, Date, JSON, Text, Boolean
from .database import Base


class Program(Base):
    __tablename__ = "programs"
    id          = Column(Integer, primary_key=True, index=True)
    start_date  = Column(Date, default=date.today, nullable=False)
    total_days  = Column(Integer, default=30, nullable=False)
    device_id   = Column(String, default="anonymous", nullable=False, index=True)
    is_demo     = Column(Boolean, default=False, nullable=False)   # True when seeded with synthetic scans


class SkinScan(Base):
    __tablename__ = "skin_scans"
    id                 = Column(Integer, primary_key=True, index=True)
    created_at         = Column(DateTime, default=datetime.utcnow, nullable=False)
    day_number         = Column(Integer, nullable=False)
    device_id          = Column(String, default="anonymous", nullable=False, index=True)

    # CV output vector — swap mock_cv.py for the real model later
    acne_score         = Column(Float, nullable=False)   # 0-10, lower = healthier
    redness_score      = Column(Float, nullable=False)   # 0-10, lower = healthier
    dryness_score      = Column(Float, nullable=False)   # 0-10, lower = healthier
    ita_value          = Column(Float, nullable=False)   # fairness context only, never shown as a score

    # Environmental context
    local_aqi          = Column(Integer, nullable=True)
    pm25               = Column(Float, nullable=True)
    dominant_pollutant = Column(String, nullable=True)
    aqi_band           = Column(String, nullable=True)

    # No image column — images are processed in memory and discarded (blueprint §6)


class DietaryLog(Base):
    """
    Daily food log per user. This is what makes recommendations
    personalized — without it, everyone with the same scores gets the
    same food list. With it, foods the user already eats are filtered
    out and actual dietary gaps drive the output.
    """
    __tablename__ = "dietary_logs"
    id         = Column(Integer, primary_key=True, index=True)
    logged_at  = Column(DateTime, default=datetime.utcnow, nullable=False)
    log_date   = Column(Date, nullable=False)
    device_id  = Column(String, default="anonymous", nullable=False, index=True)

    # Stored as a JSON list of food name strings
    # e.g. ["white rice", "dal", "curd", "chai"]
    foods_eaten = Column(JSON, default=list, nullable=False)


class NutrientEvidenceRule(Base):
    """
    Evidence documentation layer — stores the citation, explanation, and
    body text for each nutrient target. The matching logic is now math
    (scoring coefficients in recommender.py), not centroid lookup.
    These records are referenced by nutrient_key after scoring, not
    matched against — they exist purely to provide human-readable
    explanations and citations for what the scorer already decided.
    """
    __tablename__ = "nutrient_evidence_rules"
    id                   = Column(Integer, primary_key=True, index=True)
    nutrient_key         = Column(String, unique=True, nullable=False)
    title                = Column(String, nullable=False)
    body                 = Column(Text, nullable=False)
    nutrient_explanation = Column(Text, nullable=False)
    evidence_tier        = Column(String, nullable=False)  # clinical | mixed | traditional
    source_note          = Column(String, nullable=True)
