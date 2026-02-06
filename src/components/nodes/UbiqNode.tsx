import { Handle, Position, type NodeProps, type Node as FlowNode } from '@xyflow/react';

export type UbiqNode = FlowNode & {
  type: 'ubiq';
};

const UbiqNode = (_props: NodeProps<UbiqNode>) => {
  return (
    <div className="molic-node ubiq">
      <Handle type="target" position={Position.Top} id="t" />
      <Handle type="target" position={Position.Bottom} id="b" />
      <Handle type="target" position={Position.Left} id="l" />
      <Handle type="target" position={Position.Right} id="r" />

      <Handle type="source" position={Position.Top} id="st" />
      <Handle type="source" position={Position.Bottom} id="sb" />
      <Handle type="source" position={Position.Left} id="sl" />
      <Handle type="source" position={Position.Right} id="sr" />
    </div>
  );
};

export default UbiqNode;