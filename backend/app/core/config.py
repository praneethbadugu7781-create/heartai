import os
from typing import List
from pydantic import BaseModel


class Settings(BaseModel):
    PROJECT_NAME: str = "HeartGuard AI"
    PROJECT_TAGLINE: str = "AI-Powered Heart Disease Risk Assessment & Lifestyle Intelligence"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    # Risk thresholds
    RISK_THRESHOLD_LOW: float = float(os.getenv("RISK_THRESHOLD_LOW", "0.35"))
    RISK_THRESHOLD_MODERATE: float = float(os.getenv("RISK_THRESHOLD_MODERATE", "0.65"))
    
    # Model ensemble weights (validated against validation set ROC-AUC)
    DNN_WEIGHT: float = float(os.getenv("DNN_WEIGHT", "0.35"))
    MLP_WEIGHT: float = float(os.getenv("MLP_WEIGHT", "0.30"))
    TABNET_WEIGHT: float = float(os.getenv("TABNET_WEIGHT", "0.35"))
    
    # Database
    MONGODB_URI: str = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
    MONGODB_DB_NAME: str = os.getenv("MONGODB_DB_NAME", "heartguard_db")
    
    # External AI keys (optional, fallback conversational engine built-in)
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "*"
    ]


settings = Settings()
