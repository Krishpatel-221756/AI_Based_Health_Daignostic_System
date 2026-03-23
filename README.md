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
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) installed.

### Installation & Local Run
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/AI_Based_Health_Daignostic_System.git
   cd AI_Based_Health_Daignostic_System
   ```

2. Start the application using Docker Compose:
   ```bash
   docker-compose up --build
   ```

3. Open your browser:
   - **Frontend**: [http://localhost:3000](http://localhost:3000)
   - **Backend API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

## 🌐 Deployment

This project includes a `render.yaml` file for one-click deployment on [Render](https://render.com). Simply connect your GitHub repository to Render, and it will automatically build and deploy both the frontend and backend.

## ⚖️ Disclaimer

*This application is for educational and preliminary informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.*
