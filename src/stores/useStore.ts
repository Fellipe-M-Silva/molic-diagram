import { create } from "zustand";
import {
	addEdge,
	applyEdgeChanges,
	applyNodeChanges,
	type Connection,
	type Edge,
	type Node,
	type OnEdgesChange,
	type OnNodesChange,
} from "@xyflow/react";
import { persist } from "zustand/middleware";

export type Theme = "light" | "dark" | "system";

interface MolicState {
	code: string;
	nodes: Node[];
	edges: Edge[];
	theme: Theme;
	setCode: (code: string) => void;
	setNodes: (nodes: Node[]) => void;
	setEdges: (edges: Edge[]) => void;
	setTheme: (theme: Theme) => void;
	onNodesChange: OnNodesChange;
	onEdgesChange: OnEdgesChange;
	onConnect: (connection: Connection) => void;
}

export const useStore = create<MolicState>()(
	persist(
		(set, get) => ({
			// Valores Iniciais
			code: '// Bem-vindo ao MISplica Web\nscene Home {\n  title: "Início"\n}',
			nodes: [],
			edges: [],
			theme: "system",

			// Implementação das Ações
			setCode: (code) => set({ code }),

			setTheme: (theme) => set({ theme }),

			setNodes: (nodes) => set({ nodes }),

			setEdges: (edges) => set({ edges }),

			onNodesChange: (changes) => {
				set({
					nodes: applyNodeChanges(changes, get().nodes),
				});
			},

			onEdgesChange: (changes) => {
				set({
					edges: applyEdgeChanges(changes, get().edges),
				});
			},

			onConnect: (connection: Connection) => {
				set({
					edges: addEdge(connection, get().edges),
				});
			},
		}),
		{
			name: "molic-app-storage",
			partialize: (state) => ({
				code: state.code,
				theme: state.theme,
			}),
		},
	),
);