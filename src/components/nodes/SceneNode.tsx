import { Handle, Position, type NodeProps, type Node as FlowNode } from '@xyflow/react';

export interface SceneNodeData {
  title: string;
}

// Usamos FlowNode para garantir que o TS pegue a interface da biblioteca
export type SceneNode = FlowNode & {
  data: SceneNodeData;
  type: 'scene';
};

// Aqui o NodeProps<SceneNode> agora vai reconhecer id, position, etc.
const SceneNode = ({ data }: NodeProps<SceneNode>) => {
  return (
    <div className="molic-node scene">
      <Handle type="target" position={Position.Top} />
      
      <div className="node-label">
        <strong>{data.title || 'Nova Cena'}</strong>
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default SceneNode;