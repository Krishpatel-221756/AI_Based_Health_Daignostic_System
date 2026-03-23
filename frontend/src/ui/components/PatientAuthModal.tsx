import { useState } from "react";
import { DiagnoseApi, AgeGroup, Gender } from "../api";
import { AGE_GROUPS, GENDERS } from "../catalog";
import { useTranslation } from "react-i18next";

interface PatientAuthModalProps {
  api: DiagnoseApi;
  onLoginSuccess: (user: { username: string; patient_id: number; user_type: string }) => void;
  onCancel: () => void;
}

export const PatientAuthModal = ({ api, onLoginSuccess, onCancel }: PatientAuthModalProps) => {
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">
          {mode === "login" ? "Patient Login" : "Patient Signup"}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('admin.username')}</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('admin.password')}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              required
            />
          </div>

          {mode === "signup" && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('steps.ageGroup')}</label>
                <select
                  value={ageGroup}
                  onChange={(e) => setAgeGroup(e.target.value as AgeGroup)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                >
                  {AGE_GROUPS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {t(`options.${opt.id}`)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('steps.gender')}</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as Gender)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                >
                  {GENDERS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {t(`options.${opt.id}`)}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors"
            >
              {t('admin.cancel')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Processing..." : (mode === "login" ? t('admin.login') : "Sign Up")}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("signup")}
                className="text-blue-600 hover:underline font-medium"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("login")}
                className="text-blue-600 hover:underline font-medium"
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
