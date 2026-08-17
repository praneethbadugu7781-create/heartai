import os
import json
from fastapi import APIRouter, HTTPException, status
from ...schemas.model_performance import ModelPerformanceReport

router = APIRouter(prefix="/model-performance", tags=["Model Performance"])

METRICS_FILE = os.path.join(os.path.dirname(__file__), "..", "..", "artifacts", "metrics", "metrics.json")


@router.get("", response_model=ModelPerformanceReport)
def get_model_performance_report():
    """
    Returns empirical evaluation metrics (Accuracy, Precision, Recall/Sensitivity, Specificity, F1, ROC-AUC),
    confusion matrices, ROC curves, and feature importance rankings generated from real trained models on the test split.
    """
    if not os.path.exists(METRICS_FILE):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Model performance metrics have not been generated yet. Please run training first."
        )

    try:
        with open(METRICS_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
        return data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error reading model performance metrics: {str(e)}"
        )
