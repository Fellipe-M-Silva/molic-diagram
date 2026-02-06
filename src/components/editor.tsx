import { Editor as MonacoEditor } from '@monaco-editor/react';
import { useStore } from '../stores/useStore';

interface EditorProps {
  onChange: (value: string | undefined) => void;
}

const Editor = ({ onChange }: EditorProps) => {
  const { code, setCode, theme } = useStore();

  const getEditorTheme = () => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? 'vs-dark' 
        : 'light';
    }
    return theme === 'dark' ? 'vs-dark' : 'light';
  };

  return (
    <MonacoEditor
      height="100%"
      defaultLanguage="javascript" //a mudar para molic
      value={code}
      theme={getEditorTheme()}
      onChange={(value) => setCode(value || '')}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
        automaticLayout: true,
      }}
    />
  );
};

export default Editor;