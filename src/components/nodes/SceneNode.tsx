import { Handle, Position, type NodeProps, type Node as FlowNode } from '@xyflow/react';

export interface SceneItem {
  title: string;
  precond?: string | null;
  dialogs: {
    u?: string;
    d?: string;
    du?: string;
  };
}

export interface SceneNodeData {
  title: string;
  items?: SceneItem[]; 
}

export type SceneNode = FlowNode & {
  data: SceneNodeData;
  type: 'scene';
};

const SceneNode = ({ data }: NodeProps<SceneNode>) => {
  const { title, items } = data;
  const hasItems = items && items.length > 0;

  return (
    <div className={`molic-node scene ${hasItems ? 'with-content' : ''}`}>
      <Handle type="target" position={Position.Top} id="t" />
      <Handle type="target" position={Position.Bottom} id="b" />
      <Handle type="target" position={Position.Left} id="l" />
      <Handle type="target" position={Position.Right} id="r" />

      <div className="node-header">
        <strong>{title}</strong>
      </div>
      
      {hasItems &&
        <>
      <div className="node-divider" style={{ borderBottom: '1px solid #ccc' }} />
      
      <div className="node-content">
        {data.items?.map((item, idx) => (
          <div key={idx} className="scene-item">
            <div className="item-title-row">
              <span className="item-action">{item.title}</span>
              {item.precond && <span className="precond-chip">Pré-condição: {item.precond}</span>}
            </div>
            
            <div className="item-dialogs">
              {item.dialogs.d && <div className="line"><strong>d:</strong> {item.dialogs.d}</div>}
              {item.dialogs.u && <div className="line"><strong>u:</strong> {item.dialogs.u}</div>}
              {item.dialogs.du && <div className="line"><strong>d+u:</strong> {item.dialogs.du}</div>}
            </div>
          </div>
        ))}
        </div>
        </>
      }

      <Handle type="source" position={Position.Top} id="st" />
      <Handle type="source" position={Position.Bottom} id="sb" />
      <Handle type="source" position={Position.Left} id="sl" />
      <Handle type="source" position={Position.Right} id="sr" />
      
    </div>
  );
};

export default SceneNode;