import { languages } from "monaco-editor";

export const molicLanguageDef: languages.IMonarchLanguage = {
	tokenizer: {
		root: [
			[/\/\/.*$/, "comment"],
			
			// Palavras-chave principais
			[/\b(scene|ubiq|process|details|title)\b/, "keyword"],

			// Elementos de diálogo e pré-condição
			[/\b(d|u|d\+u|precond)\b/, "variable"],

			// IDs e referências (ex: Login:b)
			[/\w+(?=:)/, "type.identifier"],
			[/(?<=:)(t|b|l|r)\b/, "tag"],

			// Strings (títulos e labels)
			[/"[^"]*"/, "string"],

			// Operadores de transição
			[/->>?/, "operator"],

			// Delimitadores e Comentários
			[/[{}()]/, "@brackets"],
			[/\/\/.*$/, "comment"],
		],
	},
};

export const molicThemeDef: languages.IStandaloneThemeData = {
	base: "vs-dark",
	inherit: true,
	rules: [
		{ token: "keyword", foreground: "#C586C0", fontStyle: "bold" },
		{ token: "variable", foreground: "#9CDCFE" },
		{ token: "string", foreground: "#CE9178" },
		{ token: "operator", foreground: "#569CD6" },
		{ token: "type.identifier", foreground: "#4EC9B0" },
		{ token: "tag", foreground: "#D7BA7D" },
		{ token: "comment", foreground: "#6A9955", fontStyle: "italic" },
	],
	colors: {
		"editor.background": "#1e1e1e00",
	},
};
