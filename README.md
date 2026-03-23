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
