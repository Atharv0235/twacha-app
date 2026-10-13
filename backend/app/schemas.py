from datetime import datetime, date
from enum import Enum
from typing import List, Optional, Any
from datetime import timezone
from pydantic import BaseModel, ConfigDict, field_validator


class EvidenceTier(str, Enum):
    clinical    = "clinical"
    mixed       = "mixed"
    traditional = "traditional"


class Trend(str, Enum):
    improving        = "improving"
    flat             = "flat"
    worsening        = "worsening"
    insufficient_data = "insufficient_data"


class AqiBand(str, Enum):
    good         = "good"
    satisfactory = "satisfactory"
    moderate     = "moderate"
    poor         = "poor"
    very_poor    = "very_poor"
    severe       = "severe"


class DominantPollutant(str, Enum):
    pm25 = "pm25"
    pm10 = "pm10"
    o3   = "o3"
    no2  = "no2"
    so2  = "so2"
    co   = "co"


class FoodItem(BaseModel):
    name:           str
    reason:         str
    nutrient_value: Optional[Any]  = None
    unit:           Optional[str]  = None
    gi:             Optional[int]  = None
    source:         Optional[str]  = None     # where nutrient_value / gi came from
    logged_recently: bool          = False    # user logged this food in the last 3 days


class NutrientRecommendation(BaseModel):
    nutrient_key:        str
    relevance_score:     float        # continuous score from recommender.py
    title:               str
    body:                str
    nutrient_explanation: str
    evidence_tier:       EvidenceTier
    source_note:         Optional[str] = None
    foods_to_add:        List[FoodItem] = []
    foods_to_reduce:     List[FoodItem] = []
    trend:               Trend


class EnvironmentContext(BaseModel):
    local_aqi:          int
    pm25:               float
    dominant_pollutant: DominantPollutant
    aqi_band:           AqiBand
    source:             str = "live"            # live | demo | unavailable (hide the AQI card)
    city:               Optional[str] = None


def _as_utc(v):
    # SQLite returns naive datetimes that are really UTC. Mark them so clients convert correctly.
    return v.replace(tzinfo=timezone.utc) if isinstance(v, datetime) and v.tzinfo is None else v


class ScanOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id:            int
    created_at:    datetime
    _utc = field_validator("created_at")(_as_utc)
    day_number:    int
    acne_score:    float
    redness_score: float
    dryness_score: float
    ita_value:     float


class ScanResponse(BaseModel):
    scan:            ScanOut
    environment:     EnvironmentContext
    nutrient_scores: dict           # full ranked nutrient relevance map
    recommendations: List[NutrientRecommendation]
    quality_notes:   List[str] = []      # e.g. 'Facial hair detected - scored forehead and cheeks'
    prototype_notice: str = "Experimental estimate for a class project. Not a medical diagnosis."


class HistoryScanOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id:            int
    created_at:    datetime
    _utc = field_validator("created_at")(_as_utc)
    day_number:    int
    acne_score:    float
    redness_score: float
    dryness_score: float
    ita_value:     float
    local_aqi:     Optional[int] = None


class ProgramOut(BaseModel):
    start_date:  date
    current_day: int
    total_days:  int
    is_demo:     bool = False


class HistoryResponse(BaseModel):
    program: ProgramOut
    scans:   List[HistoryScanOut]


# ── Dietary log schemas ────────────────────────────────────────────────────

class DietaryLogIn(BaseModel):
    foods_eaten: List[str]   # ["white rice", "dal", "curd"]
    log_date:    Optional[date] = None   # defaults to today


class DietaryLogOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id:          int
    log_date:    date
    foods_eaten: List[str]
