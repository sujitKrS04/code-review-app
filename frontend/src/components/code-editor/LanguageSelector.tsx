import { Language, LANGUAGES } from '@/types/code.types';

interface LanguageSelectorProps {
  value: Language;
  onChange: (language: Language) => void;
}

export const LanguageSelector = ({ value, onChange }: LanguageSelectorProps) => {
  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="language" className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Language:
      </label>
      <select
        id="language"
        value={value}
        onChange={(e) => onChange(e.target.value as Language)}
        className="px-3 py-2 border border-gray-300 dark:border-dark-700 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.value} value={lang.value}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
};
