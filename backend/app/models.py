from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password_hash = Column(String)
    age_group = Column(String)  # Storing as string enum value
    gender = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    diagnoses = relationship("DiagnosisRecord", back_populates="patient")

class DiagnosisRecord(Base):
    __tablename__ = "diagnoses"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=True)
    
    # Input
    age_group = Column(String)
    gender = Column(String)
    body_location = Column(String, nullable=True)
    symptoms = Column(Text)  # stored as comma-separated string
    severity = Column(String)
    duration = Column(String)
    medical_history = Column(Text) # stored as comma-separated string
    additional_info = Column(Text, nullable=True)
    
    # Output
    predicted_condition = Column(String)
    confidence = Column(Float)
    red_alert = Column(Boolean, default=False)
    red_alert_reason = Column(String, nullable=True)

    patient = relationship("Patient", back_populates="diagnoses")

class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=True)
    rating = Column(Integer)
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    patient = relationship("Patient")
