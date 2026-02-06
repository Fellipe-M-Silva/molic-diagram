import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type Theme = "light" | "dark" | "system";

interface MolicStore {
	code: string;
	theme: Theme;
	setCode: (code: string) => void;
	setTheme: (theme: Theme) => void;
}

export const useStore = create<MolicStore>()(
	persist(
		(set) => ({
			// Estado Inicial
			code: "",
			theme: "system",

			// Ações
			setCode: (code) => set({ code }),

			setTheme: (theme) => set({ theme }),
		}),
		{
			name: "molic-storage",
			storage: createJSONStorage(() => localStorage),
		},
	),
);
