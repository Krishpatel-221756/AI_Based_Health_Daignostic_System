import { useTranslation } from "react-i18next";

export function StepHeader({ step, title, total }: { step: number; title: string; total: number }) {
  const { t } = useTranslation();
  return (
    <div className="flex items-baseline justify-between border-b border-gray-100 pb-4 mb-4">
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      <div className="text-base font-semibold text-gray-500">
        {t('app.step', { current: step, total })}
      </div>
    </div>
  );
}
