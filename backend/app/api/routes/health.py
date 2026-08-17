from fastapi import APIRouter
from datetime import datetime
from ...database.mongodb import db_manager
from ...ml.inference import inference_engine

router = APIRouter(prefix="/health", tags=["Health"])


@router.get("")
def get_health_status():
    """
    Health check endpoint returning system status, ML inference state, and database connectivity.
    """
    return {
        "status": "healthy",
        "service": "HeartGuard AI Backend API",
        "timestamp": datetime.utcnow().isoformat(),
        "database": {
            "connected": db_manager.is_connected,
            "type": "MongoDB" if db_manager.is_connected else "Persistent In-Memory Fallback",
            "stored_assessments": db_manager.count_assessments()
        },
        "models": {
            "loaded": inference_engine.is_loaded,
            "architectures": ["DNN (4-Layer)", "MLP (2-Layer)", "TabNet (Attentive)"],
            "ensemble": "Calibrated Performance-Weighted"
        }
    }
