import {
	type Node as FlowNode,
	type Edge,
	MarkerType,
} from "@xyflow/react";

export const parseMolic = (code: string, existingNodes: FlowNode[] = []) => {
	const nodes: FlowNode[] = [];
	const edges: Edge[] = [];

	// Cria um mapa para lembrar onde o usuário colocou os nós manualmente
	const positionMap = new Map(
		existingNodes.map((node) => [node.id, node.position]),
	);

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
		const savedPos = positionMap.get(id);

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
		/scene\s+(\w+)\s*{\s*title:\s*"([^"]+)"(?:\s*details:\s*{\s*([^}]*)\s*})?\s*}/gs;
	while ((match = sceneRegex.exec(code)) !== null) {
		const [_, id, title, detailsRaw] = match;
		const details: any = {};
		const savedPos = positionMap.get(id);

		if (detailsRaw) {
			const fields = ["u", "d", "du", "precond"];
			fields.forEach((field) => {
				const m = detailsRaw.match(
					new RegExp(`${field}:\\s*["\`]([^"\`]*?)["\`](?:\\s|$)`),
				);
				if (m) details[field] = m[1].trim();
			});
		}

		nodes.push({
			id,
			type: "scene",
			data: { title, details },
			position: savedPos || getNextDefaultPos(),
		});
	}

	// --- 3. PROCESSOS (Caixa-Preta) ---
	const processRegex =
		/process\s+(\w+)(?:\s*{\s*(?:label:\s*"([^"]+)")?\s*})?/g;
	while ((match = processRegex.exec(code)) !== null) {
		const [_, id, label] = match;
		const savedPos = positionMap.get(id);

		nodes.push({
			id,
			type: "process",
			data: { label: label || "" },
			position: savedPos || getNextDefaultPos(),
		});
	}

	// --- 4. TRANSIÇÕES DE RECUPERAÇÃO (->>) ---
	const recoveryRegex =
		/(\w+)(?::(\w+))?\s*->>\s*(\w+)(?::(\w+))?\s*{\s*label:\s*"([^"]+)"\s*}/g;
	while ((match = recoveryRegex.exec(code)) !== null) {
		const [_, srcId, srcP, tgtId, tgtP, label] = match;
		const recoveryEdge: SmoothStepEdge = {
			id: `e-rec-${srcId}-${tgtId}-${label.replace(/\s+/g, "-")}`,
			source: srcId,
			target: tgtId,
			type: "smoothstep", 
			sourceHandle: srcP ? `s${srcP}` : "sb",
			targetHandle: tgtP ? tgtP : "t",
			label,
			pathOptions: {
				borderRadius: 16,
				offset: 24,
			},
			style: {
				stroke: "var(--color-border-alt)",
				strokeWidth: 1.5,
				strokeDasharray: "5,5", 
			},
			markerEnd: {
				type: MarkerType.ArrowClosed,
				color: "var(--color-border-alt)",
			},
		};

		edges.push(recoveryEdge);
	}

	// --- 5. TRANSIÇÕES NORMAIS (->) ---
	const transitionRegex =
		/(\w+)(?::(\w+))?\s*->(?![>])\s*(\w+)(?::(\w+))?\s*{\s*label:\s*"([^"]+)"\s*}/g;
	while ((match = transitionRegex.exec(code)) !== null) {
		const [_, srcId, srcP, tgtId, tgtP, label] = match;
		const newEdge: SmoothStepEdge = {
			id: `e-${srcId}-${tgtId}-${label.replace(/\s+/g, "-")}`,
			source: srcId,
			target: tgtId,
			type: "smoothstep",
			sourceHandle: srcP ? `s${srcP}` : "sb",
			targetHandle: tgtP ? tgtP : "t",
			label,
			pathOptions: {
				borderRadius: 16,
				offset: 24,
			},
			markerEnd: {
				type: MarkerType.ArrowClosed,
				color: "var(--color-text)",
			},
			style: { stroke: "var(--color-text)", strokeWidth: 1.5 },
		};

		edges.push(newEdge);
	}

	return { nodes, edges };
};
