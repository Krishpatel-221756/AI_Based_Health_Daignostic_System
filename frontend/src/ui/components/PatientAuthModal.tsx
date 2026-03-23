import { useState } from "react";
import { DiagnoseApi, AgeGroup, Gender } from "../api";
import { AGE_GROUPS, GENDERS } from "../catalog";
import { useTranslation } from "react-i18next";

interface PatientAuthModalProps {
  api: DiagnoseApi;
  onLoginSuccess: (user: { username: string; patient_id: number; user_type: string }) => void;
  onCancel: () => void;
  isFullPage?: boolean;
}

export const PatientAuthModal = ({ api, onLoginSuccess, onCancel, isFullPage }: PatientAuthModalProps) => {
  const { t } = useTranslation();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [ageGroup, setAgeGroup] = useState<AgeGroup>("adult");
  const [gender, setGender] = useState<Gender>("male");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (mode === "login") {
        const res = await api.patientLogin(username, password);
        onLoginSuccess(res);
      } else {
        await api.patientSignup(username, password, ageGroup, gender);
        // Auto login after signup
        const res = await api.patientLogin(username, password);
        onLoginSuccess(res);
      }
    } catch (err) {
      setError(t('admin.invalidCredentials')); // Reuse existing error message or generic failure
    } finally {
      setLoading(false);
    }
  };

  const formContent = (
    <div className={`bg-white rounded-2xl ${isFullPage ? 'shadow-lg border border-slate-200' : 'shadow-xl'} max-w-md w-full p-8 animate-in fade-in zoom-in duration-300`}>
      <div className="text-center mb-8">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl mb-4">
          {mode === "login" ? "🔑" : "👋"}
        </div>
        <h2 className="text-3xl font-bold text-slate-900">
          {mode === "login" ? "Welcome Back" : "Create Account"}
        </h2>
        <p className="text-slate-500 mt-2">
          {mode === "login" ? "Sign in to access your health dashboard" : "Join us for personalized health insights"}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t('admin.username')}</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 outline-none transition-all"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t('admin.password')}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 outline-none transition-all"
            required
          />
        </div>

        {mode === "signup" && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t('steps.ageGroup')}</label>
              <select
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value as AgeGroup)}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 outline-none transition-all bg-white"
              >
                {AGE_GROUPS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {t(`options.${opt.id}`)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t('steps.gender')}</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender)}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 outline-none transition-all bg-white"
              >
                {GENDERS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {t(`options.${opt.id}`)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {error && (
          <div className="text-sm font-medium text-rose-600 bg-rose-50 px-4 py-2 rounded-lg border border-rose-100">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none mt-2"
        >
          {loading ? "Please wait..." : (mode === "login" ? "Sign In" : "Sign Up")}
        </button>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            {mode === "login" ? "New here? Create an account" : "Already have an account? Sign in"}
          </button>
        </div>

        {!isFullPage && (
          <button
            type="button"
            onClick={onCancel}
            className="w-full mt-2 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
          >
            Cancel
          </button>
        )}
      </form>
    </div>
  );

  if (isFullPage) {
    return (
      <div className="flex justify-center items-center py-4">
        {formContent}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4 backdrop-blur-md">
      {formContent}
    </div>
  );
};
