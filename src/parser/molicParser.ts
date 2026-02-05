import { type Node as FlowNode, type Edge } from "@xyflow/react";
import { MarkerType } from "@xyflow/react";

export const parseMolic = (code: string) => {
	const nodes: FlowNode[] = [];
	const edges: Edge[] = [];

	let match;

	let yOffset = 60;
	const sceneRegex =
		/scene\s+(\w+)\s*{\s*title:\s*"([^"]+)"(?:\s*content:\s*"([^"]*)")?\s*}/g;

	while ((match = sceneRegex.exec(code)) !== null) {
		const [_, id, title, content] = match;
		nodes.push({
			id,
			type: "scene",
			data: {
				title,
				content: content || "", // Se não houver, fica vazio
			},
			position: { x: 240, y: yOffset }, // Múltiplo de 12
		});
		yOffset += content ? 192 : 144; // Se tiver conteúdo, dá mais espaço pro próximo nó
	}

	// 2. Regex para Ubíquos: ubiq ID { label: "Texto" }
	const ubiqRegex = /ubiq\s+(\w+)\s*{\s*label:\s*"([^"]+)"\s*}/g;
	while ((match = ubiqRegex.exec(code)) !== null) {
		const [_, id, label] = match;
		nodes.push({
			id,
			type: "ubiq",
			data: { label },
			position: { x: 480, y: yOffset - 160 }, // Um pouco para o lado
		});
	}

	const processRegex = /process\s+(\w+)\s*{\s*label:\s*"([^"]+)"\s*}/g;

	while ((match = processRegex.exec(code)) !== null) {
		const [_, id, label] = match;
		nodes.push({
			id,
			type: "process",
			data: { label },
			position: { x: 400, y: yOffset },
		});
		yOffset += 120;
	}

	const transitionRegex = /(\w+)\s*->\s*(\w+)\s*{\s*label:\s*"([^"]+)"\s*}/g;

	while ((match = transitionRegex.exec(code)) !== null) {
		const [_, source, target, label] = match;
		edges.push({
			id: `e-${source}-${target}`,
			source,
			target,
			label,
			markerEnd: {
				type: MarkerType.ArrowClosed,
				color: "var(--color-text)",
			},
			style: { stroke: "var(--color-text)", strokeWidth: 1 },
		});
	}

	const recoveryRegex = /(\w+)\s*->>\s*(\w+)\s*{\s*label:\s*"([^"]+)"\s*}/g;

	while ((match = recoveryRegex.exec(code)) !== null) {
		const [_, source, target, label] = match;
		edges.push({
			id: `e-rec-${source}-${target}`,
			source,
			target,
			label,
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

	return { nodes, edges };
};
