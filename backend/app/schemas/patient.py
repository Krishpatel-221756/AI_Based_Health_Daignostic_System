from typing import Optional
from pydantic import BaseModel
from datetime import datetime
from app.schemas.diagnosis import AgeGroup, Gender

class PatientBase(BaseModel):
    username: str
    age_group: AgeGroup
    gender: Gender

class PatientCreate(PatientBase):
    password: str

class PatientLogin(BaseModel):
    username: str
    password: str

class PatientResponse(PatientBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
