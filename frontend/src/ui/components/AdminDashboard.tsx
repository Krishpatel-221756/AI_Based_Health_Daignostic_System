import { useEffect, useState } from "react";
import { DiagnoseApi, type DiagnosisHistoryItem, type AnalyticsStats } from "../api";
import { AnalyticsCharts } from "./AnalyticsCharts";
import { LoginModal } from "./LoginModal";
import { useTranslation } from "react-i18next";

type Props = {
  api: DiagnoseApi;
  onBack: () => void;
};

export function AdminDashboard({ api, onBack }: Props) {
  const { t } = useTranslation();
  const [history, setHistory] = useState<DiagnosisHistoryItem[]>([]);
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      Promise.all([api.getHistory(), api.getStats()])
        .then(([historyData, statsData]) => {
          setHistory(historyData);
          setStats(statsData);
        })
        .catch((err) => setError(String(err)))
        .finally(() => setLoading(false));
    }
  }, [api, isAuthenticated]);

  if (!isAuthenticated) {
    if (showLogin) {
      return (
        <LoginModal
          api={api}
          onLoginSuccess={() => {
            setIsAuthenticated(true);
            setShowLogin(false);
          }}
          onCancel={onBack}
        />
      );
    }
    return null; // Should not happen as we redirect on cancel
  }

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{t('admin.dashboardTitle')}</h2>
          <p className="text-sm text-gray-500">{t('admin.dashboardSubtitle')}</p>
        </div>
        <button
          onClick={onBack}
          className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
        >
          {t('admin.exitDashboard')}
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-500">{t('admin.loading')}</div>
      ) : error ? (
        <div className="py-8 text-center text-rose-600">{error}</div>
      ) : (
        <>
          {stats && <AnalyticsCharts stats={stats} />}
          
          <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('admin.patientHistory')}</h3>
          
          {history.length === 0 ? (
            <div className="py-12 text-center text-gray-500">{t('admin.noRecords')}</div>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">{t('admin.date')}</th>
                    <th className="px-4 py-3 font-medium">{t('admin.patient')}</th>
                    <th className="px-4 py-3 font-medium">{t('admin.condition')}</th>
                    <th className="px-4 py-3 font-medium">{t('admin.confidence')}</th>
                    <th className="px-4 py-3 font-medium">{t('admin.status')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                  {history.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50">
                      <td className="whitespace-nowrap px-4 py-3">
                        {new Date(item.created_at).toLocaleDateString()}
                        <div className="text-xs text-gray-400">
                          {new Date(item.created_at).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900 capitalize">
                          {t(`options.${item.age_group}`) || item.age_group} • {t(`options.${item.gender}`) || item.gender}
                        </div>
                        <div className="text-xs text-gray-400">
                          {t('admin.location')}: {t(`bodyMap.${item.body_location}`) || item.body_location || "N/A"}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">{item.predicted_condition}</td>
                      <td className="px-4 py-3">{(item.confidence * 100).toFixed(1)}%</td>
                      <td className="px-4 py-3">
                        {item.red_alert ? (
                          <span className="inline-flex items-center rounded-full bg-rose-100 px-2 py-1 text-xs font-medium text-rose-700">
                            {t('admin.redAlert')}
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">
                            {t('admin.stable')}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
