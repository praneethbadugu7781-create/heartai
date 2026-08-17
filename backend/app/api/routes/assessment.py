import uuid
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, HTTPException, status, Query
from ...schemas.assessment import AssessmentCreate, AssessmentResponse
from ...services.prediction_service import prediction_service
from ...database.mongodb import db_manager

router = APIRouter(prefix="/assessment", tags=["Assessment"])


@router.post("", response_model=AssessmentResponse, status_code=status.HTTP_201_CREATED)
def create_assessment(request: AssessmentCreate):
    """
    Runs multi-model AI prediction on submitted health data and persists assessment to database.
    """
    try:
        pred_res = prediction_service.run_prediction_pipeline(
            health_data=request.health_data,
            explain=True,
            include_recommendations=True
        )
        
        assessment_id = str(uuid.uuid4())
        created_at = datetime.utcnow().isoformat()

        doc = {
            "id": assessment_id,
            "created_at": created_at,
            "user_id": request.user_id,
            "patient_name": request.patient_name or "Anonymous Health Profile",
            "notes": request.notes,
            "health_data": request.health_data.model_dump(),
            "dnn_probability": pred_res.dnn_probability,
            "mlp_probability": pred_res.mlp_probability,
            "tabnet_probability": pred_res.tabnet_probability,
            "ensemble_probability": pred_res.ensemble_probability,
            "risk_percentage": pred_res.risk_percentage,
            "risk_category": pred_res.risk_category,
            "risk_level_severity": pred_res.risk_level_severity,
            "model_agreement": pred_res.model_agreement,
            "top_factors": [f.model_dump() for f in pred_res.top_factors],
            "recommendations": [r.model_dump() for r in pred_res.recommendations],
            "disclaimer": pred_res.disclaimer
        }

        db_manager.insert_assessment(doc)
        return doc
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create assessment: {str(e)}"
        )


@router.get("s", response_model=List[AssessmentResponse])
def list_assessments(limit: int = Query(50, ge=1, le=200), skip: int = Query(0, ge=0)):
    """
    Returns list of recorded assessments sorted chronologically descending.
    """
    try:
        items = db_manager.list_assessments(limit=limit, skip=skip)
        return items
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch assessment history: {str(e)}"
        )


@router.get("/{assessment_id}", response_model=AssessmentResponse)
def get_assessment_by_id(assessment_id: str):
    """
    Retrieves a single assessment record by ID.
    """
    doc = db_manager.get_assessment(assessment_id)
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Assessment with ID '{assessment_id}' not found."
        )
    return doc


@router.delete("/{assessment_id}", status_code=status.HTTP_200_OK)
def delete_assessment_by_id(assessment_id: str):
    """
    Deletes an assessment record from storage.
    """
    success = db_manager.delete_assessment(assessment_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Assessment with ID '{assessment_id}' not found."
        )
    return {"message": "Assessment deleted successfully", "id": assessment_id}
