# AI-Based Health Diagnostic System

Short description
- AI-based web platform that collects patient information, runs ML models to provide diagnoses, recommendations and risk estimates, and captures feedback for improvement.

Quick tech summary
- Frontend: React + TypeScript, Vite, Tailwind CSS, i18n (see `frontend/package.json`, `frontend/src`).
- Backend: FastAPI, SQLAlchemy, Pydantic, served with Uvicorn/Gunicorn (see `backend/requirements.txt`, `backend/run.py`, `backend/app`).
- Database: Configured via `DATABASE_URL` environment variable; defaults to local SQLite at `./health.db` (see `backend/app/database.py`).

How to run locally

1. Backend (Python virtualenv):

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8003 --reload
```

2. Frontend (Node):

```bash
cd frontend
npm install
npm run dev -- --port 5173
```

Notes about environment and deployment
- The frontend uses `VITE_API_URL` to locate the backend API. For local dev, create `frontend/.env` with `VITE_API_URL=http://localhost:8003` or update as needed.
- For production deployment the `render.yaml` is preconfigured to use `$PORT` for the backend bind and a static frontend publish path. Update `render.yaml` with your backend URL as needed.

Publishing to GitHub
- This repository already has a remote named `origin`. To publish your local commits to GitHub run:

```bash
git add .
git commit -m "Describe changes"
git push origin main
```

- If you prefer to create a new GitHub repository instead, use the GitHub CLI:

```bash
gh repo create <owner>/<repo> --public --source=. --remote=origin --push
```

Security note
- Do not commit secrets or credentials. Ensure `.env` and local virtual environments remain ignored by `.gitignore`.

Next steps
- If you want, I can: create a new GitHub repository and push these changes for you; add a GitHub Actions workflow for CI; or update `render.yaml` to point to an existing deployed backend URL.
# AI Based Health Diagnostic System 🩺

An intelligent, full-stack health diagnostic application that provides preliminary health assessments using AI-driven symptom analysis. This system is designed to help users understand potential health conditions based on their symptoms and provides recommended actions, lifestyle tips, and dietary suggestions.

## 🚀 Key Features

- **AI-Powered Diagnosis**: Analyzes user symptoms to predict possible health conditions with confidence scores.
- **Patient Authentication**: Secure Sign In and Sign Up flow to protect user data and track health history.
- **Multilingual Support**: Fully localized in over 10 languages, including English, Hindi, Gujarati, Tamil, Telugu, and more.
- **Health History Tracking**: Patients can view their past diagnoses and track health trends over time.
- **Doctor/Admin Dashboard**: Specialized view for healthcare professionals to analyze system data and feedback.
- **Dynamic Recommendations**: Provides home care tips, "When to see a doctor" advice, and personalized meal routines.
- **Docker Ready**: Fully containerized for consistent development and easy deployment.
- **Cloud Optimized**: Pre-configured for deployment on platforms like Render, Railway, or Fly.io.

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, i18next (Internationalization), Recharts.
- **Backend**: FastAPI (Python), SQLAlchemy ORM, Pydantic, Gunicorn/Uvicorn.
- **Database**: SQLite (Local Dev) / PostgreSQL (Production).
- **DevOps**: Docker, Docker Compose, Nginx (Frontend Proxy).

## 🚦 Getting Started

### Prerequisites
- [Python 3.10+](https://www.python.org/)
- [Node.js 18+](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

### Installation & Local Run

You will need to run the **Backend** and the **Frontend** separately in two different terminal windows.

#### 1. Start the Backend (FastAPI)
Open a terminal and navigate to the `backend` folder:
```bash
cd backend
# Create and activate a virtual environment
python3 -m venv .venv
source .venv/bin/activate  # On Windows use: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the backend server
python run.py
```
*The backend API will be available at [http://localhost:8000](http://localhost:8000).*

#### 2. Start the Frontend (React + Vite)
Open a **second terminal** and navigate to the `frontend` folder:
```bash
cd frontend
# Install dependencies
npm install

# Run the frontend in development mode
npm run dev
```
*The frontend will be available at [http://localhost:5173](http://localhost:5173).*

## 🌐 Deployment

This project includes a `render.yaml` file for one-click deployment on [Render](https://render.com). Simply connect your GitHub repository to Render, and it will automatically build and deploy both the frontend and backend.

## ⚖️ Disclaimer

*This application is for educational and preliminary informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.*
