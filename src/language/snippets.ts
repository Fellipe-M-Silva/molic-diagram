import { languages } from "monaco-editor";

export const molicSnippets = (monaco: any) => [
  {
    label: 'scene',
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertText: [
      'scene ${1:ID} {',
      '  title: "${2:Titulo da Cena}"',
      '  details: {',
      '    ${3:acao} {',
      '      u: ${4:usuario faz}',
      '      d: "${5:sistema responde}"',
      '    }',
      '  }',
      '}'
    ].join('\n'),
    documentation: 'Cria uma nova cena MoLIC completa'
  },
  {
    label: 'trans',
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertText: '${1:origem} -> ${2:destino} { label: "${3:clique}" }',
    documentation: 'Cria uma transição normal'
  },
  {
    label: 'rec',
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertText: '${1:origem} ->> ${2:destino} { label: "${3:erro}" }',
    documentation: 'Cria uma transição de recuperação (tracejada)'
  },
	{
		label: "note",
		kind: monaco.languages.CompletionItemKind.Snippet,
		insertText: "// ${1:Sua anotação aqui...}",
		documentation: "Adiciona uma nota interna que não aparece no diagrama",
		range: undefined as any,
	},
];
