import { useEffect, useMemo, useState } from "react";
import {
  AGE_GROUPS,
  DURATIONS,
  GENDERS,
  HISTORY_ITEMS,
  SEVERITIES,
  SYMPTOM_CATEGORIES,
  type AgeGroup,
  type BodyLocation,
  type Duration,
  type Gender,
  type HistoryItem,
  type Severity,
  type SymptomId
} from "../ui/catalog";
import { useTranslation } from "react-i18next";
import { DiagnoseApi, type DiagnosisResponse } from "../ui/api";
import { AdminDashboard } from "./components/AdminDashboard";
import { ButtonChoice } from "./components/ButtonChoice";
import { BodyMapSelector } from "./components/BodyMapSelector";
import { CheckboxGrid } from "./components/CheckboxGrid";
import { ResultCards } from "./components/ResultCards";
import { StepHeader } from "./components/StepHeader";
import { PatientAuthModal } from "./components/PatientAuthModal";
import { LoginModal } from "./components/LoginModal";
import { LanguageSelector } from "./components/LanguageSelector";
import { HistoryView } from "./components/HistoryView";
import { FeedbackView } from "./components/FeedbackView";

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
type View = "app" | "admin" | "history" | "feedback";

const totalSteps = 8;

export default function App() {
  const { t } = useTranslation();

  const api = useMemo(() => {
    // Priority:
    // 1. VITE_API_URL environment variable (from build time)
    // 2. Relative path (if running on same host/port or proxied)
    // 3. Fallback to localhost:8000 for local dev
    
    const envUrl = import.meta.env.VITE_API_URL;
    if (envUrl) return new DiagnoseApi(envUrl);

    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    const baseUrl = isLocal && window.location.port !== "8000" ? "http://localhost:8000" : "";
    return new DiagnoseApi(baseUrl); 
  }, []);


  const [view, setView] = useState<View>("app");
  const [showLogin, setShowLogin] = useState(false);
  const [showPatientAuth, setShowPatientAuth] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ username: string; patient_id: number; user_type: string } | null>(null);

  const [step, setStep] = useState<Step>(1);
  const [ageGroup, setAgeGroup] = useState<AgeGroup | null>(null);
  const [gender, setGender] = useState<Gender | null>(null);
  const [bodyLocation, setBodyLocation] = useState<BodyLocation | null>(null);
  const [symptoms, setSymptoms] = useState<Set<SymptomId>>(new Set());
  const [severity, setSeverity] = useState<Severity | null>(null);
  const [duration, setDuration] = useState<Duration | null>(null);
  const [history, setHistory] = useState<Set<HistoryItem>>(new Set(["none"]));
  const [additionalInformation, setAdditionalInformation] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<"checking" | "online" | "offline">("checking");

  const translatedAgeGroups = AGE_GROUPS.map((opt) => ({ ...opt, label: t(`options.${opt.id}`) }));
  const translatedGenders = GENDERS.map((opt) => ({ ...opt, label: t(`options.${opt.id}`) }));
  const translatedSeverities = SEVERITIES.map((opt) => ({ ...opt, label: t(`options.${opt.id}`) }));
  const translatedDurations = DURATIONS.map((opt) => ({ ...opt, label: t(`options.${opt.id}`) }));
  const translatedHistory = HISTORY_ITEMS.map((opt) => ({ ...opt, label: t(`options.${opt.id}`) }));
  const translatedSymptoms = SYMPTOM_CATEGORIES.map((cat) => ({
    ...cat,
    label: t(`categories.${cat.id}`),
    items: cat.items.map((item) => ({ ...item, label: t(`symptoms.${item.id}`) })),
  }));

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      try {
        await api.health();
        if (!cancelled) {
          setApiStatus("online");
        }
      } catch {
        if (!cancelled) {
          setApiStatus("offline");
        }
      }
    };

    void check();
    const id = setInterval(check, 15000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [api]);

  if (view === "admin") {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="mx-auto max-w-5xl">
          <AdminDashboard api={api} onBack={() => setView("app")} />
        </div>
      </div>
    );
  }

  if (view === "history" && currentUser) {
    return <HistoryView api={api} patientId={currentUser.patient_id} onBack={() => setView("app")} />;
  }

  if (view === "feedback") {
    return <FeedbackView api={api} patientId={currentUser?.patient_id} onBack={() => setView("app")} />;
  }

  const statusLabel =
    apiStatus === "online" ? t('app.connected') : apiStatus === "offline" ? t('app.offline') : t('app.checking');
  const statusClasses =
    apiStatus === "online"
      ? "bg-emerald-50 text-emerald-800 ring-emerald-100"
      : apiStatus === "offline"
        ? "bg-rose-50 text-rose-800 ring-rose-100"
        : "bg-gray-50 text-gray-700 ring-gray-200";

  const canGoNext = (() => {
    if (step === 1) return Boolean(ageGroup && gender);
    if (step === 4) return Boolean(severity);
    if (step === 5) return Boolean(duration);
    if (step === 6) return history.size > 0;
    return true;
  })();

  const next = () => setStep((s) => (s < totalSteps ? ((s + 1) as Step) : s));
  const back = () => setStep((s) => (s > 1 ? ((s - 1) as Step) : s));

  const toggleSymptom = (id: SymptomId) => {
    setSymptoms((prev) => {
      const nextSet = new Set(prev);
      if (nextSet.has(id)) nextSet.delete(id);
      else nextSet.add(id);
      return nextSet;
    });
  };

  const toggleHistory = (id: HistoryItem) => {
    setHistory((prev) => {
      const nextSet = new Set(prev);
      if (id === "none") {
        return new Set(["none"]);
      }
      if (nextSet.has(id)) nextSet.delete(id);
      else nextSet.add(id);
      nextSet.delete("none");
      if (nextSet.size === 0) nextSet.add("none");
      return nextSet;
    });
  };

  const submit = async () => {
    if (!ageGroup || !gender || !severity || !duration) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.diagnose({
        age_group: ageGroup,
        gender,
        body_location: bodyLocation,
        symptoms: Array.from(symptoms),
        severity,
        duration,
        medical_history: Array.from(history),
        additional_information: additionalInformation.trim() ? additionalInformation.trim() : null,
        patient_id: currentUser?.patient_id
      });
      setResult(res);
      setStep(8);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to diagnose.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-white text-gray-900">
      {/* Header Bar */}
      <div className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="mx-auto max-w-5xl px-6 h-16 flex items-center justify-between">
          <div className="font-bold text-xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            HealthAI
          </div>
          <div className="flex items-center gap-4">
            <LanguageSelector />
            
            {currentUser ? (
              <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-full shadow-sm ring-1 ring-slate-200">
                <div className="text-sm font-medium text-slate-700">
                  {currentUser.username}
                </div>
                <button
                  onClick={() => setCurrentUser(null)}
                  className="text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded-full transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowPatientAuth(true)}
                className="text-sm font-medium text-emerald-600 hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors ring-1 ring-emerald-200"
              >
                Patient Login
              </button>
            )}

            {currentUser && (
              <button
                onClick={() => setView("history")}
                className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
              >
                My History
              </button>
            )}

            <button
              onClick={() => setView("feedback")}
              className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
            >
              Feedback
            </button>

            <button
              onClick={() => setShowLogin(true)}
              className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
            >
              {t('app.doctorLogin')}
            </button>
          </div>
        </div>
      </div>

      {showLogin && (
        <LoginModal
          api={api}
          onLoginSuccess={() => {
            setShowLogin(false);
            setView("admin");
          }}
          onCancel={() => setShowLogin(false)}
        />
      )}

      {showPatientAuth && (
        <PatientAuthModal
          api={api}
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            setShowPatientAuth(false);
          }}
          onCancel={() => setShowPatientAuth(false)}
        />
      )}

      <div className="mx-auto max-w-3xl px-4 py-8">
        <header className="mb-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-bold text-emerald-800 ring-1 ring-emerald-200">
                <span aria-hidden="true">🩺</span>
                <span>{t('app.subtitle')}</span>
              </div>
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                {t('app.title')}
              </h1>
              <p className="mt-4 text-lg text-gray-600 leading-relaxed max-w-xl">
                {t('app.disclaimer')}
                <br />
                <span className="text-sm text-gray-500">{t('app.description')}</span>
              </p>
            </div>
            <div className="flex flex-col items-end gap-3">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500 bg-white/50 px-3 py-1 rounded-full border border-gray-100">
                <span>{t('app.status')}:</span>
                <span
                  className={[
                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-bold",
                    apiStatus === "online" ? "text-emerald-700 bg-emerald-50" : "text-gray-600 bg-gray-50"
                  ].join(" ")}
                >
                  <span
                    className={[
                      "h-2.5 w-2.5 rounded-full",
                      apiStatus === "online"
                        ? "bg-emerald-500"
                        : apiStatus === "offline"
                          ? "bg-rose-500"
                          : "bg-gray-400"
                    ].join(" ")}
                    aria-hidden="true"
                  />
                  {statusLabel}
                </span>
              </div>
            </div>
          </div>
        </header>

        {error ? (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {error}
          </div>
        ) : null}

        {step === 1 ? (
          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
            <StepHeader step={step} title={t('steps.personalDetails')} total={totalSteps} />
            <div className="mt-4 space-y-6">
              <div>
                <div className="text-sm font-medium text-gray-900">{t('steps.ageGroup')}</div>
                <div className="mt-2">
                  <ButtonChoice
                    options={translatedAgeGroups}
                    value={ageGroup}
                    onChange={setAgeGroup}
                  />
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">{t('steps.gender')}</div>
                <div className="mt-2">
                  <ButtonChoice options={translatedGenders} value={gender} onChange={setGender} />
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {step === 2 ? (
          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
            <StepHeader step={step} title={t('steps.bodyLocation')} total={totalSteps} />
            <div className="mt-4">
              <BodyMapSelector value={bodyLocation} onChange={setBodyLocation} />
            </div>
          </section>
        ) : null}

        {step === 3 ? (
          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
            <StepHeader step={step} title={t('steps.selectSymptoms')} total={totalSteps} />
            <div className="mt-4 space-y-6">
              {translatedSymptoms.map((cat) => (
                <div key={cat.id}>
                  <div className="text-sm font-medium text-gray-900">{cat.label}</div>
                  <div className="mt-2">
                    <CheckboxGrid
                      items={cat.items}
                      selected={symptoms}
                      onToggle={toggleSymptom}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {step === 4 ? (
          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
            <StepHeader step={step} title={t('steps.severity')} total={totalSteps} />
            <div className="mt-4">
              <ButtonChoice options={translatedSeverities} value={severity} onChange={setSeverity} />
            </div>
          </section>
        ) : null}

        {step === 5 ? (
          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
            <StepHeader step={step} title={t('steps.duration')} total={totalSteps} />
            <div className="mt-4">
              <ButtonChoice options={translatedDurations} value={duration} onChange={setDuration} />
            </div>
          </section>
        ) : null}

        {step === 6 ? (
          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
            <StepHeader step={step} title={t('steps.history')} total={totalSteps} />
            <div className="mt-4">
              <CheckboxGrid items={translatedHistory} selected={history} onToggle={toggleHistory} />
            </div>
            <div className="mt-3 text-xs text-gray-600">
              Selecting any condition disables “None”. If you unselect all, “None” is restored.
            </div>
          </section>
        ) : null}

        {step === 7 ? (
          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
            <StepHeader step={step} title={t('steps.additionalInfo')} total={totalSteps} />
            <div className="mt-4">
              <textarea
                className="min-h-40 w-full resize-none rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-lg outline-none ring-emerald-200 focus:border-emerald-500 focus:ring-4 transition-all"
                maxLength={800}
                placeholder={t('steps.placeholderInfo')}
                value={additionalInformation}
                onChange={(e) => setAdditionalInformation(e.target.value)}
              />
              <div className="mt-2 text-sm text-gray-500 font-medium">
                {additionalInformation.length}/800
              </div>
            </div>
          </section>
        ) : null}

        {step === 8 && result ? (
          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
            <StepHeader step={step} title={t('steps.results')} total={totalSteps} />
            <div className="mt-4">
              <ResultCards result={result} />
            </div>
          </section>
        ) : null}

        <div className="mt-6 flex items-center justify-between">
          <button
            className="rounded-xl px-6 py-4 text-lg font-medium text-gray-700 transition hover:bg-white/70 disabled:opacity-40"
            onClick={back}
            disabled={step === 1 || loading}
          >
            {t('actions.back')}
          </button>

          {step < 7 ? (
            <button
              className="rounded-xl bg-emerald-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-emerald-700 hover:scale-105 active:scale-95 disabled:opacity-40"
              onClick={next}
              disabled={!canGoNext || loading}
            >
              {t('actions.next')}
            </button>
          ) : null}

          {step === 7 ? (
            <button
              className="rounded-xl bg-emerald-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-emerald-700 hover:scale-105 active:scale-95 disabled:opacity-40"
              onClick={submit}
              disabled={loading || !ageGroup || !gender || !severity || !duration}
            >
              {loading ? t('actions.analyzing') : t('actions.analyze')}
            </button>
          ) : null}

          {step === 8 ? (
            <button
              className="rounded-xl bg-emerald-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-emerald-700 hover:scale-105 active:scale-95"
              onClick={() => {
                setStep(1);
                setResult(null);
                setError(null);
                setBodyLocation(null);
              }}
            >
              {t('actions.startOver')}
            </button>
          ) : null}
        </div>

        <footer className="mt-12 text-center text-sm text-gray-500 font-medium bg-white/50 p-4 rounded-xl border border-gray-100">
          ⚠️ {result?.disclaimer ?? t('app.disclaimer')}
        </footer>
      </div>
    </div>
  );
}
