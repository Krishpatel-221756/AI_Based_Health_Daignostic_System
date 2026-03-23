import { useEffect, useState } from "react";
import { DiagnoseApi, DiagnosisHistoryItem } from "../api";
import { useTranslation } from "react-i18next";

interface HistoryViewProps {
  api: DiagnoseApi;
  patientId: number;
  onBack: () => void;
}

export const HistoryView = ({ api, patientId, onBack }: HistoryViewProps) => {
  const { t } = useTranslation();
  const [history, setHistory] = useState<DiagnosisHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await api.getHistory(patientId);
        setHistory(data);
      } catch (err) {
        setError("Failed to load history.");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [api, patientId]);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <button
          onClick={onBack}
          className="mb-6 text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-2"
        >
          ← {t('actions.back')}
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Medical History</h1>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading history...</div>
        ) : error ? (
          <div className="rounded-xl bg-red-50 p-4 text-red-800 border border-red-200">
            {error}
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <p className="text-gray-500 text-lg">No diagnosis history found.</p>
            <button 
                onClick={onBack}
                className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
                Start a Checkup
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <div key={item.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{item.predicted_condition}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(item.created_at).toLocaleDateString()} at {new Date(item.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                  {item.red_alert && (
                    <span className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full">
                      RED ALERT
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold text-gray-700">Symptoms:</span>
                    <p className="text-gray-600 mt-1">{item.symptoms.split(',').map(s => t(`symptoms.${s}`)).join(', ')}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Severity:</span>
                    <p className="text-gray-600 mt-1 capitalize">{t(`options.${item.severity}`)}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Duration:</span>
                    <p className="text-gray-600 mt-1 capitalize">{t(`options.${item.duration}`)}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Confidence:</span>
                    <p className="text-gray-600 mt-1">{(item.confidence * 100).toFixed(1)}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
