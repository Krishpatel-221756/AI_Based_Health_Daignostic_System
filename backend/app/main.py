from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
from app.routes.diagnose import router as diagnose_router
from app.routes.auth import router as auth_router
from app.routes.feedback import router as feedback_router

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Health Diagnosis System API",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(diagnose_router, prefix="/api/v1", tags=["diagnosis"])
app.include_router(auth_router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(feedback_router, prefix="/api/v1/feedback", tags=["feedback"])


@app.get("/")
def root():
    return {
        "message": "AI Health Diagnosis System API is running",
        "status": "online",
        "version": "0.1.0",
        "endpoints": {
            "health": "/health",
            "diagnosis": "/api/v1/diagnose",
            "auth": "/api/v1/auth",
            "feedback": "/api/v1/feedback"
        }
    }


@app.get("/health")
def health():
    return {"status": "ok"}

