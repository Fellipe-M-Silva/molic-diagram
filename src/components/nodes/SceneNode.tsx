import { Handle, Position, type NodeProps, type Node as FlowNode } from '@xyflow/react';

export interface SceneNodeData {
  title: string;
  details?: {
    u?: string;
    d?: string;
    du?: string;
    precond?: string;
  };
}

export type SceneNode = FlowNode & {
  data: SceneNodeData;
  type: 'scene';
};

const SceneNode = ({ data }: NodeProps<SceneNode>) => {
  const { title, details } = data;
  const hasDetails = details && Object.keys(details).length > 0;

  return (
    <div className={`molic-node scene ${hasDetails ? 'with-content' : ''}`}>
      <Handle type="target" position={Position.Top} id="t" />
      <Handle type="target" position={Position.Bottom} id="b" />
      <Handle type="target" position={Position.Left} id="l" />
      <Handle type="target" position={Position.Right} id="r" />

      <div className="node-header">
        <strong>{title}</strong>
      </div>
      
      {hasDetails && (
        <>
          <div className="node-divider"></div>
          <div className="node-content">
            {details.precond && <div className="detail-item"><em>({details.precond})</em></div>}
            {details.u && <div className="detail-item"><strong>u:</strong> {details.u}</div>}
            {details.d && <div className="detail-item"><strong>d:</strong> {details.d}</div>}
            {details.du && <div className="detail-item"><strong>du:</strong> {details.du}</div>}
          </div>
        </>
      )}

      <Handle type="source" position={Position.Top} id="st" />
      <Handle type="source" position={Position.Bottom} id="sb" />
      <Handle type="source" position={Position.Left} id="sl" />
      <Handle type="source" position={Position.Right} id="sr" />
      
    </div>
  );
};

export default SceneNode;