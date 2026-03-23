import { useState } from "react";
import { DiagnoseApi } from "../api";
import { useTranslation } from "react-i18next";

interface LoginModalProps {
  api: DiagnoseApi;
  onLoginSuccess: () => void;
  onCancel: () => void;
}

export const LoginModal = ({ api, onLoginSuccess, onCancel }: LoginModalProps) => {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.login(username, password);
      onLoginSuccess();
    } catch (err) {
      setError(t('admin.invalidCredentials'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">{t('admin.loginTitle')}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('admin.username')}</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder={t('admin.enterUsername')}
              autoFocus
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('admin.password')}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder={t('admin.enterPassword')}
            />
          </div>

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
              {loading ? t('admin.loggingIn') : t('admin.login')}
            </button>
          </div>
        </form>
        <div className="mt-4 text-center text-xs text-slate-400">
          {t('admin.demoCredentials')}
        </div>
      </div>
    </div>
  );
};
