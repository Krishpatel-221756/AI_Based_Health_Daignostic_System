from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
import hashlib
from app.database import get_db
from app.models import Patient
from app.schemas.patient import PatientCreate, PatientLogin, PatientResponse

router = APIRouter()

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    success: bool
    token: str
    user_type: str = "admin"
    patient_id: int | None = None
    username: str | None = None

@router.post("/login", response_model=LoginResponse)
def login(creds: LoginRequest):
    if creds.username == "admin" and creds.password == "123":
        return {
            "success": True, 
            "token": "fake-jwt-token-for-demo",
            "user_type": "admin",
            "username": "Dr. Admin"
        }
    raise HTTPException(status_code=401, detail="Invalid credentials")

@router.post("/patient/signup", response_model=PatientResponse)
def patient_signup(patient: PatientCreate, db: Session = Depends(get_db)):
    db_patient = db.query(Patient).filter(Patient.username == patient.username).first()
    if db_patient:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    new_patient = Patient(
        username=patient.username,
        password_hash=hash_password(patient.password),
        age_group=patient.age_group.value,
        gender=patient.gender.value
    )
    db.add(new_patient)
    db.commit()
    db.refresh(new_patient)
    return new_patient

@router.post("/patient/login", response_model=LoginResponse)
def patient_login(creds: PatientLogin, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.username == creds.username).first()
    if not patient or patient.password_hash != hash_password(creds.password):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    return {
        "success": True,
        "token": f"fake-patient-token-{patient.id}",
        "user_type": "patient",
        "patient_id": patient.id,
        "username": patient.username
    }
