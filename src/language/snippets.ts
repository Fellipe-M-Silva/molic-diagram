import { languages } from "monaco-editor";

export const molicSnippets = (monaco: any): languages.CompletionItem[] => [
	{
		label: "scene",
		kind: monaco.languages.CompletionItemKind.Snippet,
		insertText: [
			"scene ${1:id} {",
			'  title: "${2:Titulo}"',
			"  details: {",
			"    ${3:acao} {",
			"      d: ${4:fala}",
			"    }",
			"  }",
			"}",
		].join("\n"),
		insertTextRules:
			monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
		documentation: "Estrutura completa de uma cena MoLIC",
		range: undefined as any,
	},
	{
		label: "trans",
		kind: monaco.languages.CompletionItemKind.Snippet,
		insertText:
			'${1:origem}:${2:b} -> ${3:destino}:${4:t} { label: "${5:fala}" }',
		insertTextRules:
			monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
		documentation: "Transição normal (diálogo)",
		range: undefined as any,
	},
];
