import { Handle, Position, type NodeProps, type Node as FlowNode } from '@xyflow/react';

export type UbiqNode = FlowNode & {
  type: 'ubiq';
};

const UbiqNode = (_props: NodeProps<UbiqNode>) => {
  return (
    <div className="molic-node ubiq">
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default UbiqNode;