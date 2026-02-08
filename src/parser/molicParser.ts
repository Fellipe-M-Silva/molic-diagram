import { type Node as FlowNode, type Edge, MarkerType } from "@xyflow/react";
import type { SceneItem } from "../components/nodes/SceneNode";
import type { EdgeConfig } from "../stores/useStore";

export const parseMolic = (
	code: string,
	savedPositions: Record<string, { x: number; y: number }> = {},
	edgeConfigs: Record<string, EdgeConfig> = {},
) => {
	const nodes: FlowNode[] = [];
	const edges: Edge[] = [];

	// Cria um mapa para lembrar onde o usuário colocou os nós manualmente
	const positionMap = new Map(Object.entries(savedPositions));

	let xPos = 48;

	let yPosUbiquo = 48;
	let yPosResto = 168;

	const colWidth = 288;
	const rowHeight = 240;
	const maxCols = 800;

	let match;

	// --- 1. UBÍQUOS (Linha do Topo) ---
	const ubiqRegex = /ubiq\s+(\w+)(?:\s*{\s*(?:label:\s*"([^"]+)")?\s*})?/g;

	while ((match = ubiqRegex.exec(code)) !== null) {
		const [_, id, label] = match;
		const savedPos = positionMap.get(id); // Defina savedPos aqui

		nodes.push({
			id,
			type: "ubiq",
			data: { label: label || "" },
			position: savedPos || { x: xPos, y: yPosUbiquo },
		});

		if (!savedPos) {
			xPos += colWidth;
			if (xPos > maxCols) {
				xPos = 48;
				yPosUbiquo += 120;
				yPosResto += 120;
			}
		}
	}

	xPos = 48;

	const getNextDefaultPos = () => {
		const pos = { x: xPos, y: yPosResto };
		xPos += colWidth;
		if (xPos > maxCols) {
			xPos = 48;
			yPosResto += rowHeight;
		}
		return pos;
	};

	// --- 2. CENAS (Com Details e Precond) ---
	const sceneRegex =
		/scene\s+(\w+)\s*{\s*title:\s*"([^"]+)"(?:\s*details:\s*{\s*([\s\S]*?)\s*}\s*})?\s*}/gs;

	let sceneMatch;
	while ((sceneMatch = sceneRegex.exec(code)) !== null) {
		// O primeiro elemento [0] é o match completo, por isso começamos do [1]
		const id = sceneMatch[1];
		const title = sceneMatch[2];
		const detailsRaw = sceneMatch[3];

		const items: SceneItem[] = [];
		if (detailsRaw) {
			const itemRegex =
				/([^{}\n(]+)(?:\s*\((?:precond:\s*)?([^)]+)\))?\s*{\s*([^}]*)\s*}/g;
			let itemMatch;
			while ((itemMatch = itemRegex.exec(detailsRaw)) !== null) {
				const [_, actionTitle, precond, dialogsRaw] = itemMatch;
				const dialogs: any = {};
				const dMatch = dialogsRaw.match(/d:\s*([^;}\n]+)/);
				const uMatch = dialogsRaw.match(/u:\s*([^;}\n]+)/);
				const duMatch = dialogsRaw.match(/d\+u:\s*([^;}\n]+)/);
				if (dMatch) dialogs.d = dMatch[1].trim();
				if (uMatch) dialogs.u = uMatch[1].trim();
				if (duMatch) dialogs.du = duMatch[1].trim();

				items.push({
					title: actionTitle.trim(),
					precond: precond ? precond.trim() : null,
					dialogs,
				});
			}
		}

		nodes.push({
			id,
			type: "scene",
			data: { title, items },
			position: positionMap.get(id) || getNextDefaultPos(),
		});
	}

	// --- 3. PROCESSOS (Caixa-Preta) ---
	const processRegex =
		/process\s+(\w+)(?:\s*{\s*(?:label:\s*"([^"]+)")?\s*})?/g;
	while ((match = processRegex.exec(code)) !== null) {
		const [_, id, label] = match;

		nodes.push({
			id,
			type: "process",
			data: { label: label || "" },
			position: positionMap.get(id) || getNextDefaultPos(),
		});
	}

	// --- 4. TRANSIÇÕES DE RECUPERAÇÃO (->>) ---
	const recoveryRegex = /(\w+)\s*->>\s*(\w+)\s*{\s*label:\s*"([^"]+)"\s*}/g;
	while ((match = recoveryRegex.exec(code)) !== null) {
		const [_, srcId, tgtId, label] = match;
		const edgeId = `e-rec-${srcId}-${tgtId}-${label.replace(/\s+/g, "-")}`;
		const savedConfig = edgeConfigs[edgeId];

		edges.push({
			id: edgeId,
			source: srcId,
			target: tgtId,
			type: "smoothstep",
			sourceHandle: savedConfig?.sourceHandle || "sb",
			targetHandle: savedConfig?.targetHandle || "t",
			label,
			labelStyle: {
				fill: "var(--color-text)",
				fontSize: 12,
			},
			labelBgPadding: [4, 2],
			labelBgStyle: {
				fill: "var(--color-bg-alt)",
				fillOpacity: 1,
				zIndex: 10,
			},
			pathOptions: { borderRadius: 16, offset: 24 },
			style: {
				stroke: "var(--color-border-alt)",
				strokeWidth: 1,
				strokeDasharray: "5,5",
			},
			markerEnd: {
				type: MarkerType.ArrowClosed,
				color: "var(--color-border-alt)",
			},
		});
	}

	// --- 5. TRANSIÇÕES NORMAIS (->) ---
	const transitionRegex =
		/(\w+)\s*->(?![>])\s*(\w+)\s*{\s*label:\s*"([^"]+)"\s*}/g;
	let tMatch;
	while ((tMatch = transitionRegex.exec(code)) !== null) {
		const [_, srcId, tgtId, label] = tMatch;
		const edgeId = `e-${srcId}-${tgtId}-${label.replace(/\s+/g, "-")}`;
		const savedConfig = edgeConfigs[edgeId];

		edges.push({
			id: edgeId,
			source: srcId,
			target: tgtId,
			sourceHandle: savedConfig?.sourceHandle || "sb",
			targetHandle: savedConfig?.targetHandle || "t",
			type: "smoothstep",
			label: label,
			labelStyle: {
				fill: "var(--color-text)",
				fontSize: 12,
			},
			labelBgPadding: [4, 2],
			labelBgStyle: {
				fill: "var(--color-bg-alt)",
				fillOpacity: 1,
			},
			markerEnd: {
				type: MarkerType.ArrowClosed,
				color: "var(--color-text)",
			},
			style: { stroke: "var(--color-text)", strokeWidth: 1 },
		});
	}

	return { nodes, edges };
};
