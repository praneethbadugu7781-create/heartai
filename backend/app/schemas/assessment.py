from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, field_validator
from datetime import datetime


class HealthInput(BaseModel):
    age: int = Field(..., ge=18, le=105, description="Age in years (18-105)")
    sex: int = Field(..., ge=0, le=1, description="Biological sex (1 = Male, 0 = Female)")
    cp: int = Field(..., ge=0, le=3, description="Chest pain type (0: Typical Angina, 1: Atypical Angina, 2: Non-anginal, 3: Asymptomatic)")
    trestbps: int = Field(..., ge=80, le=220, description="Resting systolic blood pressure in mm Hg (80-220)")
    chol: int = Field(..., ge=100, le=600, description="Serum cholesterol in mg/dL (100-600)")
    fbs: int = Field(..., ge=0, le=1, description="Fasting blood sugar > 120 mg/dL (1 = True, 0 = False)")
    restecg: int = Field(..., ge=0, le=2, description="Resting ECG results (0: Normal, 1: ST-T wave abnormality, 2: Left ventricular hypertrophy)")
    thalach: int = Field(..., ge=60, le=220, description="Maximum heart rate achieved in bpm (60-220)")
    exang: int = Field(..., ge=0, le=1, description="Exercise-induced angina (1 = Yes, 0 = No)")
    oldpeak: float = Field(..., ge=0.0, le=7.0, description="ST depression induced by exercise relative to rest (0.0-7.0)")
    slope: int = Field(..., ge=0, le=2, description="Slope of the peak exercise ST segment (0: Upsloping, 1: Flat, 2: Downsloping)")
    ca: int = Field(..., ge=0, le=4, description="Number of major vessels (0-4) colored by fluoroscopy")
    thal: int = Field(..., ge=0, le=3, description="Thalassemia status (1: Normal, 2: Fixed defect, 3: Reversible defect, 0: Unknown)")

    @field_validator("age")
    @classmethod
    def validate_age(cls, v: int) -> int:
        if v < 18 or v > 105:
            raise ValueError("Age must be between 18 and 105 years.")
        return v

    @field_validator("trestbps")
    @classmethod
    def validate_trestbps(cls, v: int) -> int:
        if v < 80 or v > 220:
            raise ValueError("Resting blood pressure must be between 80 and 220 mmHg.")
        return v

    @field_validator("chol")
    @classmethod
    def validate_chol(cls, v: int) -> int:
        if v < 100 or v > 600:
            raise ValueError("Serum cholesterol must be between 100 and 600 mg/dL.")
        return v

    @field_validator("thalach")
    @classmethod
    def validate_thalach(cls, v: int) -> int:
        if v < 60 or v > 220:
            raise ValueError("Maximum heart rate must be between 60 and 220 bpm.")
        return v


class AssessmentCreate(BaseModel):
    user_id: Optional[str] = Field(None, description="Optional user or session identifier")
    patient_name: Optional[str] = Field("Anonymous Health Profile", description="Display name for report")
    health_data: HealthInput
    notes: Optional[str] = None


class RecommendationItem(BaseModel):
    category: str  # Nutrition, Physical Activity, Sleep, Stress, Monitoring, Professional Care
    title: str
    summary: str
    actionable_points: List[str]
    priority: str  # high, medium, standard
    icon: str


class TopFactorItem(BaseModel):
    feature: str
    feature_name: str
    value: Any
    display_value: str
    importance_score: float
    direction: str  # "elevates_risk" or "protective"
    clinical_insight: str


class AssessmentResponse(BaseModel):
    id: str
    created_at: str
    patient_name: str
    health_data: HealthInput
    dnn_probability: float
    mlp_probability: float
    tabnet_probability: float
    ensemble_probability: float
    risk_percentage: float
    risk_category: str
    risk_level_severity: str  # low, moderate, high
    model_agreement: str  # High, Moderate, Divergent
    top_factors: List[TopFactorItem]
    recommendations: List[RecommendationItem]
    disclaimer: str = (
        "Medical Disclaimer: HeartGuard AI provides algorithmic risk assessments strictly "
        "for educational and informational purposes. It is not a diagnostic tool or clinical confirmation. "
        "Always consult a licensed medical professional for personal cardiovascular care."
    )
