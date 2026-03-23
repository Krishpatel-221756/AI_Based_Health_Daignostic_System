import { jsPDF } from "jspdf";
import type { DiagnosisResponse } from "../api";
import { useTranslation } from "react-i18next";

export function ResultCards({ result }: { result: DiagnosisResponse }) {
  const { t } = useTranslation();

  const downloadPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(22);
    doc.setTextColor(41, 128, 185);
    doc.text(t('results.reportTitle'), 105, 20, { align: "center" });

    // Date
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`${t('results.generatedOn')}: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 105, 28, { align: "center" });

    // Disclaimer
    doc.setFontSize(9);
    doc.setTextColor(120);
    const disclaimerLines = doc.splitTextToSize(`${t('results.disclaimerPrefix')}: ${result.disclaimer}`, 170);
    doc.text(disclaimerLines, 20, 40);

    let y = 40 + (disclaimerLines.length * 4) + 10;

    // Red Alert
    if (result.red_alert) {
      doc.setFillColor(255, 235, 238);
      doc.rect(15, y, 180, 20, "F");
      doc.setTextColor(198, 40, 40);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(t('results.urgentAlert').toUpperCase(), 20, y + 8);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(result.red_alert_reason || "", 20, y + 16);
      y += 25;
    }

    // Conditions
    doc.setTextColor(0);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(t('results.analysisResults'), 20, y);
    y += 8;

    result.possible_conditions.forEach((c) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text(`• ${c.name}`, 25, y);
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`(${t('results.confidence')}: ${Math.round(c.confidence * 100)}%)`, 100, y);
      doc.setTextColor(0);
      y += 7;
    });
    y += 5;

    // Recommendations
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(t('results.recommendedActions'), 20, y);
    y += 8;

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    result.recommended_actions.home_care.forEach((action) => {
      doc.text(`• ${action}`, 25, y);
      y += 6;
    });

    y += 4;
    doc.setFont("helvetica", "bold");
    doc.text(t('results.doctorTitle') + ":", 25, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    const doctorLines = doc.splitTextToSize(result.recommended_actions.when_to_see_a_doctor, 160);
    doc.text(doctorLines, 25, y);
    y += (doctorLines.length * 5) + 8;

    // Meal Routine
    if (y > 230) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(t('results.mealTitle'), 20, y);
    y += 8;

    result.meal_routine.items.forEach((item) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(`${item.time}:`, 25, y);
      
      doc.setFont("helvetica", "normal");
      const suggestions = item.suggestions.join(", ");
      const lines = doc.splitTextToSize(suggestions, 130);
      doc.text(lines, 60, y);
      y += (lines.length * 5) + 4;
    });

    doc.save("medical-report.pdf");
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-center">
        <button
          onClick={downloadPDF}
          className="flex w-full max-w-md items-center justify-center gap-3 rounded-xl bg-blue-600 px-6 py-4 text-lg font-bold text-white shadow-lg transition-transform hover:scale-105 hover:bg-blue-700 active:scale-95"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          {t('results.download')}
        </button>
      </div>

      {result.red_alert ? (
        <div className="rounded-2xl border-2 border-rose-200 bg-rose-50 px-6 py-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xl font-bold tracking-wide text-rose-800 flex items-center gap-2">
              <span className="text-2xl">🚨</span> {t('results.urgentAlert')}
            </div>
            <div className="rounded-full bg-rose-200 px-3 py-1 text-sm font-bold text-rose-900">
              {t('results.seekHelp')}
            </div>
          </div>
          <div className="text-lg text-rose-900 leading-relaxed font-medium">{result.red_alert_reason}</div>
          {result.recommended_actions.emergency_warning ? (
            <div className="mt-4 rounded-xl bg-white/50 p-4 font-semibold text-rose-900 border border-rose-100">
              {result.recommended_actions.emergency_warning}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        {result.possible_conditions.map((c) => (
          <div
            key={c.name}
            className="rounded-2xl border-2 border-gray-100 bg-white p-6 shadow-sm hover:border-emerald-200 transition-colors"
          >
            <div className="text-lg font-bold text-gray-900 mb-2">{c.name}</div>
            <div className="flex items-end justify-between gap-3">
              <div className="text-3xl font-bold text-emerald-700">
                {Math.round(c.confidence * 100)}%
              </div>
              <div className="h-3 flex-1 overflow-hidden rounded-full bg-gray-100 mb-2">
                <div
                  className="h-3 rounded-full bg-emerald-500"
                  style={{ width: `${Math.round(c.confidence * 100)}%` }}
                />
              </div>
            </div>
            <div className="mt-1 text-sm font-medium text-gray-500">{t('results.likelihood')}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border-2 border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">📋</span>
          <div className="text-xl font-bold text-gray-900">{t('results.actionsTitle')}</div>
        </div>
        <ul className="space-y-3 pl-2">
          {result.recommended_actions.home_care.map((t) => (
            <li key={t} className="flex items-start gap-3 text-lg text-gray-800">
              <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-emerald-500" />
              {t}
            </li>
          ))}
        </ul>
        <div className="mt-6 rounded-xl bg-blue-50 p-5 border border-blue-100">
          <div className="flex items-center gap-2 mb-2 font-bold text-blue-900 text-lg">
            <span>👨‍⚕️</span> {t('results.doctorTitle')}
          </div>
          <div className="text-lg text-blue-900/90 leading-relaxed">
            {result.recommended_actions.when_to_see_a_doctor}
          </div>
        </div>
        {result.recommended_actions.emergency_warning ? (
          <div className="mt-4 rounded-xl border-2 border-rose-100 bg-rose-50 p-5">
            <div className="flex items-center gap-2 font-bold text-rose-800 text-lg mb-2">
              <span>⚠️</span> {t('results.emergencyTitle')}
            </div>
            <div className="text-lg text-rose-900">{result.recommended_actions.emergency_warning}</div>
          </div>
        ) : null}
      </div>

      <div className="rounded-2xl border-2 border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">🧘</span>
          <div className="text-xl font-bold text-gray-900">{t('results.lifestyleTitle')}</div>
        </div>
        <ul className="space-y-3 pl-2">
          {result.lifestyle_tips.map((t) => (
            <li key={t} className="flex items-start gap-3 text-lg text-gray-800">
              <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-blue-400" />
              {t}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border-2 border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">🥗</span>
          <div className="text-xl font-bold text-gray-900">{t('results.mealTitle')}</div>
        </div>
        <div className="mb-4 text-lg text-gray-700 leading-relaxed">{result.meal_routine.overview}</div>
        <div className="grid gap-4 md:grid-cols-2">
          {result.meal_routine.items.map((it) => (
            <div key={it.time} className="rounded-xl border border-gray-200 bg-gray-50/50 p-5">
              <div className="text-lg font-bold text-gray-900 mb-2">{it.time}</div>
              <ul className="space-y-2">
                {it.suggestions.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-base text-gray-800">
                    <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-400" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {result.meal_routine.notes.length ? (
          <div className="mt-6 rounded-xl border-2 border-amber-100 bg-amber-50 p-5 text-amber-900">
            <div className="font-bold text-lg mb-2 flex items-center gap-2">
              <span>💡</span> {t('results.notesTitle')}
            </div>
            <ul className="space-y-2">
              {result.meal_routine.notes.map((n) => (
                <li key={n} className="flex items-start gap-2 text-base">
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-400" />
                  {n}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}
