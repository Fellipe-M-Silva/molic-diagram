import { Handle, Position, type NodeProps, type Node as FlowNode } from '@xyflow/react';

export interface UbiqNodeData {
  label: string;
}

export type UbiqNode = FlowNode & {
  data: UbiqNodeData;
  type: 'ubiq';
};

const UbiqNode = ({ data }: NodeProps<UbiqNode>) => {
  return (
    <div className="molic-node ubiq">
      <Handle type="target" position={Position.Top} />
      <div className="node-label">
        <span>{data.label}</span>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default UbiqNode;