from fastapi import APIRouter, HTTPException, status, Response
from ...database.mongodb import db_manager
from ...services.report_service import report_service

router = APIRouter(prefix="/report", tags=["Report"])


@router.get("/pdf/{assessment_id}")
def download_pdf_report(assessment_id: str):
    """
    Generates and streams a downloadable medical-grade PDF summary report for a specific assessment.
    """
    doc = db_manager.get_assessment(assessment_id)
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Assessment with ID '{assessment_id}' not found."
        )

    try:
        pdf_buffer = report_service.generate_pdf_report(doc)
        pdf_bytes = pdf_buffer.getvalue()
        
        headers = {
            "Content-Disposition": f"attachment; filename=HeartGuard_Risk_Report_{assessment_id[:8]}.pdf",
            "Content-Type": "application/pdf"
        }
        return Response(content=pdf_bytes, media_type="application/pdf", headers=headers)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate PDF report: {str(e)}"
        )
