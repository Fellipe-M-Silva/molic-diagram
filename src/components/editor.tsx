import { Editor as MonacoEditor } from '@monaco-editor/react';
import { useStore } from '../stores/useStore';
import { molicLanguageDef, molicThemeDef } from '../language/molic';
import { molicSnippets } from '../language/snippets';

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

  const handleBeforeMount = (monaco: any) => {
    // 1. Registra a ID da linguagem
    monaco.languages.register({ id: 'molic' });

    // 2. Define as regras de cores
    monaco.languages.setMonarchTokensProvider('molic', molicLanguageDef);

    // 3. Define o tema visual
    monaco.editor.defineTheme('molic-theme', molicThemeDef);

    // 4. Registra os snippets
    monaco.languages.registerCompletionItemProvider('molic', {
      provideCompletionItems: () => ({
        suggestions: molicSnippets(monaco)
      })
    });
  };

  const handleEditorDidMount = (editor: any) => {
    // Impede que eventos de teclado "vazem" para o React Flow
    editor.onKeyDown((e: any) => {
      
    });
  };

  return (
    <MonacoEditor
      height="100%"
      defaultLanguage="molic"
      beforeMount={handleBeforeMount}
      onMount={handleEditorDidMount}
      value={code}
      theme={getEditorTheme()}
      onChange={(value) => setCode(value || '')}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
        automaticLayout: true,
        wordWrap: 'on', 
        wrappingStrategy: 'advanced',
        wrappingIndent: 'indent',
        
      }}
    />
  );
};

export default Editor;