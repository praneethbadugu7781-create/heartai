from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from .assessment import HealthInput


class ChatMessage(BaseModel):
    role: str = Field(..., description="'user', 'assistant', or 'system'")
    content: str


class AssistantQueryRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=2000, description="User question for the AI Health Assistant")
    assessment_id: Optional[str] = None
    health_data: Optional[HealthInput] = None
    prediction_summary: Optional[Dict[str, Any]] = None
    conversation_history: Optional[List[ChatMessage]] = Field(default_factory=list)


class AssistantQueryResponse(BaseModel):
    answer: str
    is_emergency: bool = False
    emergency_notice: Optional[str] = None
    suggested_followups: List[str] = Field(default_factory=list)
    disclaimer: str = (
        "Educational Notice: HeartGuard Assistant provides generalized health information and "
        "model context only. It cannot provide clinical diagnoses, prescriptions, or replace a doctor's care."
    )
