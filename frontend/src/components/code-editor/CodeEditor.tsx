import Editor from '@monaco-editor/react';
import { useTheme } from '@/hooks/useTheme';
import { Language } from '@/types/code.types';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: Language;
  readOnly?: boolean;
  height?: string;
}

const LANGUAGE_MAP: Record<Language, string> = {
  python: 'python',
  javascript: 'javascript',
  typescript: 'typescript',
  java: 'java',
  cpp: 'cpp',
};

export const CodeEditor = ({ value, onChange, language, readOnly = false, height = '500px' }: CodeEditorProps) => {
  const { isDark } = useTheme();

  return (
    <div className="border border-gray-300 dark:border-dark-700 rounded-lg overflow-hidden">
      <Editor
        height={height}
        language={LANGUAGE_MAP[language]}
        value={value}
        onChange={(value) => onChange(value || '')}
        theme={isDark ? 'vs-dark' : 'vs-light'}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          readOnly,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
};
