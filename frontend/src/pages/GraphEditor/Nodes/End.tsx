import { Handle, NodeProps, Position } from "reactflow";

import { NodeWrapper } from "./NodeWrapper";

type EndNodeData = {
  width: number;
  height: number;
};

export function EndNode({ data }: NodeProps<EndNodeData>) {
  return (
    <NodeWrapper>
      <div
        className={`rounded-full aspect-square flex items-center justify-center border-4 border-N-400 h-full bg-white text-[12px] cursor-pointer`}
        style={{
          width: data.width,
          height: data.height,
        }}
      >
        <Handle
          type="target"
          id="target"
          className="invisible"
          position={Position.Top}
          isConnectable={false}
        />
        <p className="font-medium">{"End"}</p>
      </div>
    </NodeWrapper>
  );
}
