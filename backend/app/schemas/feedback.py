from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class FeedbackBase(BaseModel):
    rating: int
    comment: Optional[str] = None

class FeedbackCreate(FeedbackBase):
    patient_id: Optional[int] = None

class FeedbackResponse(FeedbackBase):
    id: int
    patient_id: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True
