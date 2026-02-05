import { type Node as FlowNode, type Edge } from "@xyflow/react";

export const parseMolic = (code: string) => {
	const nodes: FlowNode[] = [];
	const edges: Edge[] = [];

	const sceneRegex = /scene\s+(\w+)\s*{\s*title:\s*"([^"]+)"\s*}/g;
	let match;

	let yOffset = 50; 

	while ((match = sceneRegex.exec(code)) !== null) {
		const [_, id, title] = match;
		nodes.push({
			id,
			type: "scene",
			data: { title },
			position: { x: 250, y: yOffset },
		});
		yOffset += 150;
	}

	// 2. Regex para Ubíquos: ubiq ID { label: "Texto" }
	const ubiqRegex = /ubiq\s+(\w+)\s*{\s*label:\s*"([^"]+)"\s*}/g;
	while ((match = ubiqRegex.exec(code)) !== null) {
		const [_, id, label] = match;
		nodes.push({
			id,
			type: "ubiq",
			data: { label },
			position: { x: 500, y: yOffset - 150 }, // Um pouco para o lado
		});
	}

	return { nodes, edges };
};
