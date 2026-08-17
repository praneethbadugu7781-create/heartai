from fastapi import APIRouter, HTTPException, status
from ...schemas.assistant import AssistantQueryRequest, AssistantQueryResponse
from ...services.assistant_service import assistant_service
from ...database.mongodb import db_manager
from ...schemas.assessment import HealthInput

router = APIRouter(prefix="/assistant", tags=["AI Assistant"])


@router.post("", response_model=AssistantQueryResponse, status_code=status.HTTP_200_OK)
def query_health_assistant(request: AssistantQueryRequest):
    """
    Handles user inquiries regarding risk assessment factors, physiological vitals,
    lifestyle guidelines, and model mechanics with strict non-diagnostic medical boundaries
    and emergency symptom detection.
    """
    try:
        # If assessment_id is provided but health_data was omitted, hydrate context from database
        if request.assessment_id and not request.health_data:
            doc = db_manager.get_assessment(request.assessment_id)
            if doc and "health_data" in doc:
                request.health_data = HealthInput(**doc["health_data"])
                request.prediction_summary = {
                    "risk_percentage": doc.get("risk_percentage"),
                    "risk_category": doc.get("risk_category"),
                    "dnn_probability": doc.get("dnn_probability"),
                    "mlp_probability": doc.get("mlp_probability"),
                    "tabnet_probability": doc.get("tabnet_probability")
                }

        response = assistant_service.generate_response(request)
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Assistant error: {str(e)}"
        )
