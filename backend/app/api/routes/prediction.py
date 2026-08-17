from fastapi import APIRouter, HTTPException, status
from ...schemas.prediction import PredictionRequest, PredictionResponse
from ...services.prediction_service import prediction_service

router = APIRouter(prefix="/predict", tags=["Prediction"])


@router.post("", response_model=PredictionResponse, status_code=status.HTTP_200_OK)
def run_prediction(request: PredictionRequest):
    """
    Executes real-time multi-model risk assessment across DNN, MLP, and TabNet.
    Returns individual model probabilities, weighted ensemble score, XAI factor attributions,
    and personalized lifestyle intelligence.
    """
    try:
        response = prediction_service.run_prediction_pipeline(
            health_data=request.health_data,
            explain=request.explain,
            include_recommendations=request.include_recommendations
        )
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error executing AI risk estimation pipeline: {str(e)}"
        )
