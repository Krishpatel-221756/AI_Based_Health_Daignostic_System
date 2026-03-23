import { useTranslation } from 'react-i18next';

export function LanguageSelector() {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
    { code: 'gu', label: 'ગુજરાતી', flag: '🇮🇳' },
    { code: 'pa', label: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
    { code: 'bn', label: 'বাংলা', flag: '🇮🇳' },
    { code: 'ta', label: 'தமிழ்', flag: '🇮🇳' },
    { code: 'te', label: 'తెలుగు', flag: '🇮🇳' },
    { code: 'ml', label: 'മലയാളം', flag: '🇮🇳' },
    { code: 'mr', label: 'मराठी', flag: '🇮🇳' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
  ];

  return (
    <div className="flex items-center gap-2">
      <select
        value={i18n.language}
        onChange={(e) => i18n.changeLanguage(e.target.value)}
        className="rounded-lg border-gray-300 bg-white py-1.5 pl-3 pr-8 text-sm font-medium text-gray-700 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
}
