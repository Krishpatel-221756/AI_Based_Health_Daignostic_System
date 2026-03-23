from datetime import datetime
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field


class AgeGroup(str, Enum):
    child = "child"
    teen = "teen"
    adult = "adult"
    senior = "senior"


class Gender(str, Enum):
    male = "male"
    female = "female"
    other = "other"


class Severity(str, Enum):
    mild = "mild"
    moderate = "moderate"
    severe = "severe"


class Duration(str, Enum):
    lt_24h = "lt_24h"
    d_1_3 = "d_1_3"
    d_4_7 = "d_4_7"
    gt_week = "gt_week"


class SymptomId(str, Enum):
    fever = "fever"
    fatigue = "fatigue"
    weight_loss = "weight_loss"
    chills = "chills"
    cough = "cough"
    shortness_of_breath = "shortness_of_breath"
    chest_pain = "chest_pain"
    nausea = "nausea"
    vomiting = "vomiting"
    diarrhea = "diarrhea"
    abdominal_pain = "abdominal_pain"
    headache = "headache"
    dizziness = "dizziness"
    confusion = "confusion"
    rash = "rash"
    itching = "itching"
    redness = "redness"


class HistoryItem(str, Enum):
    diabetes = "diabetes"
    blood_pressure = "blood_pressure"
    heart_disease = "heart_disease"
    asthma = "asthma"
    none = "none"


class BodyLocation(str, Enum):
    head_neck = "head_neck"
    chest = "chest"
    abdomen = "abdomen"
    back = "back"
    arms_hands = "arms_hands"
    legs_feet = "legs_feet"
    skin = "skin"
    general = "general"


class DiagnosisRequest(BaseModel):
    age_group: AgeGroup
    gender: Gender
    body_location: Optional[BodyLocation] = None
    symptoms: List[SymptomId] = Field(default_factory=list)
    severity: Severity
    duration: Duration
    medical_history: List[HistoryItem] = Field(default_factory=list)
    additional_information: Optional[str] = Field(default=None, max_length=800)
    patient_id: Optional[int] = None


class ConditionResult(BaseModel):
    name: str
    confidence: float = Field(ge=0.0, le=1.0)


class RecommendedActions(BaseModel):
    home_care: List[str]
    when_to_see_a_doctor: str
    emergency_warning: Optional[str] = None


class MealRoutineItem(BaseModel):
    time: str
    suggestions: List[str]


class MealRoutine(BaseModel):
    overview: str
    items: List[MealRoutineItem]
    notes: List[str]


class DiagnosisResponse(BaseModel):
    disclaimer: str
    red_alert: bool = False
    red_alert_reason: Optional[str] = None
    possible_conditions: List[ConditionResult]
    recommended_actions: RecommendedActions
    lifestyle_tips: List[str]
    meal_routine: MealRoutine


class DiagnosisHistoryItem(BaseModel):
    id: int
    created_at: datetime
    age_group: str
    gender: str
    body_location: Optional[str]
    symptoms: str
    severity: str
    duration: str
    medical_history: str
    predicted_condition: str
    confidence: float
    red_alert: bool

    class Config:
        from_attributes = True


class AnalyticsStats(BaseModel):
    total_diagnoses: int
    condition_counts: dict[str, int]
    age_group_counts: dict[str, int]
    gender_counts: dict[str, int]
    red_alert_count: int
