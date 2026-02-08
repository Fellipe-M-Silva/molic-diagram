import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type Theme = "light" | "dark" | "system";

export interface Viewport {
  x: number;
  y: number;
  zoom: number;
}

export interface EdgeConfig {
	sourceHandle: string | null;
	targetHandle: string | null;
}
interface MolicStore {
	code: string;
	theme: Theme;
	viewport: Viewport;
	nodePositions: Record<string, { x: number; y: number }>;
	edgeConfigs: Record<string, EdgeConfig>;
	setCode: (code: string) => void;
	setTheme: (theme: Theme) => void;
	setViewport: (viewport: Viewport) => void;
	updateNodePositions: (nodes: Node[]) => void;
	updateEdgeConfig: (edgeId: string, config: EdgeConfig) => void;
}

export const useStore = create<MolicStore>()(
	persist(
		(set) => ({
			// Estado Inicial
			code: "",
			theme: "system",
			viewport: { x: 0, y: 0, zoom: 1 },
			nodePositions: {},
			edgeConfigs: {},

			// Ações
			setCode: (code) => set({ code }),

			setTheme: (theme) => set({ theme }),

			setViewport: (viewport) => set({ viewport }),

			updateNodePositions: (nodes) =>
				set((state) => ({
					nodePositions: {
						...state.nodePositions,
						...Object.fromEntries(
							nodes.map((n) => [n.id, n.position]),
						),
					},
				})),

			updateEdgeConfig: (edgeId, config) =>
				set((state) => ({
					edgeConfigs: {
						...state.edgeConfigs,
						[edgeId]: config,
					},
				})),
		}),
		{
			name: "molic-storage",
			storage: createJSONStorage(() => localStorage),
			onRehydrateStorage: () => (state) => {
				console.log("Storage hidratado");
			},
		},
	),
);
