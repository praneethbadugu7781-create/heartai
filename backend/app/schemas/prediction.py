from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from .assessment import HealthInput, TopFactorItem, RecommendationItem


class PredictionRequest(BaseModel):
    health_data: HealthInput
    explain: bool = True
    include_recommendations: bool = True


class ModelPredictionDetail(BaseModel):
    model_name: str
    probability: float
    percentage: float
    risk_tier: str
    architecture: str
    key_characteristics: str


class PredictionResponse(BaseModel):
    dnn_probability: float
    mlp_probability: float
    tabnet_probability: float
    ensemble_probability: float
    risk_percentage: float
    risk_category: str
    risk_level_severity: str  # low, moderate, high
    model_agreement: str
    models_breakdown: List[ModelPredictionDetail]
    top_factors: List[TopFactorItem]
    recommendations: List[RecommendationItem]
    disclaimer: str
