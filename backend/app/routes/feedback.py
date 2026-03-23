from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import Feedback
from app.schemas.feedback import FeedbackCreate, FeedbackResponse

router = APIRouter()

@router.post("/", response_model=FeedbackResponse)
def create_feedback(feedback: FeedbackCreate, db: Session = Depends(get_db)):
    db_feedback = Feedback(
        patient_id=feedback.patient_id,
        rating=feedback.rating,
        comment=feedback.comment
    )
    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)
    return db_feedback

@router.get("/", response_model=List[FeedbackResponse])
def get_feedback(db: Session = Depends(get_db)):
    return db.query(Feedback).order_by(Feedback.created_at.desc()).all()
