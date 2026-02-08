import { Handle, Position, type NodeProps, type Node as FlowNode } from '@xyflow/react';

export type UbiqNode = FlowNode & {
  type: 'ubiq';
};

const UbiqNode = (_props: NodeProps<UbiqNode>) => {
  return (
    <div className="molic-node ubiq">
      <Handle type="target" position={Position.Top} id="t" isConnectable={true} />
      <Handle type="target" position={Position.Bottom} id="b" isConnectable={true} />
      <Handle type="target" position={Position.Left} id="l" isConnectable={true} />
      <Handle type="target" position={Position.Right} id="r" isConnectable={true} />

      <Handle type="source" position={Position.Top} id="st" isConnectable={true} />
      <Handle type="source" position={Position.Bottom} id="sb" isConnectable={true} />
      <Handle type="source" position={Position.Left} id="sl" isConnectable={true} />
      <Handle type="source" position={Position.Right} id="sr" isConnectable={true} />
    </div>
  );
};

export default UbiqNode;