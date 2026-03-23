from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import DiagnosisRecord
from app.schemas.diagnosis import DiagnosisHistoryItem, DiagnosisRequest, DiagnosisResponse, AnalyticsStats
from app.services.diagnosis_service import diagnose
from sqlalchemy import func


router = APIRouter()


@router.get("/stats", response_model=AnalyticsStats)
def get_stats(db: Session = Depends(get_db)):
    total = db.query(DiagnosisRecord).count()

    # Condition counts
    conditions = db.query(DiagnosisRecord.predicted_condition, func.count(DiagnosisRecord.predicted_condition)).group_by(DiagnosisRecord.predicted_condition).all()
    condition_counts = {c: count for c, count in conditions}

    # Age group counts
    age_groups = db.query(DiagnosisRecord.age_group, func.count(DiagnosisRecord.age_group)).group_by(DiagnosisRecord.age_group).all()
    age_group_counts = {a: count for a, count in age_groups}

    # Gender counts
    genders = db.query(DiagnosisRecord.gender, func.count(DiagnosisRecord.gender)).group_by(DiagnosisRecord.gender).all()
    gender_counts = {g: count for g, count in genders}

    red_alerts = db.query(DiagnosisRecord).filter(DiagnosisRecord.red_alert == True).count()

    return {
        "total_diagnoses": total,
        "condition_counts": condition_counts,
        "age_group_counts": age_group_counts,
        "gender_counts": gender_counts,
        "red_alert_count": red_alerts
    }


@router.get("/history", response_model=List[DiagnosisHistoryItem])
def get_history(patient_id: int | None = None, db: Session = Depends(get_db)):
    query = db.query(DiagnosisRecord)
    if patient_id:
        query = query.filter(DiagnosisRecord.patient_id == patient_id)
    return query.order_by(DiagnosisRecord.created_at.desc()).all()


@router.post("/diagnose", response_model=DiagnosisResponse)
def diagnose_endpoint(payload: DiagnosisRequest, db: Session = Depends(get_db)):
    result = diagnose(payload)

    # Save to database
    record = DiagnosisRecord(
        age_group=payload.age_group,
        gender=payload.gender,
        body_location=payload.body_location,
        symptoms=",".join(payload.symptoms),
        severity=payload.severity,
        duration=payload.duration,
        medical_history=",".join(payload.medical_history),
        additional_info=payload.additional_information,
        predicted_condition=result.possible_conditions[0].name if result.possible_conditions else "Unknown",
        confidence=result.possible_conditions[0].confidence if result.possible_conditions else 0.0,
        red_alert=result.red_alert,
        red_alert_reason=result.red_alert_reason,
        patient_id=payload.patient_id
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    return result

