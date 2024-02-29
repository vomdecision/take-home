import { Handle, NodeProps, Position } from "reactflow";
import { NodeWrapper } from "./NodeWrapper";

type StartNodeData = {
  width: number;
  height: number;
};

export function StartNode({ data }: NodeProps<StartNodeData>) {
  return (
    <NodeWrapper>
      <div
        className={`rounded-full aspect-square flex items-center justify-center border-4 border-N-400 bg-white text-[12px] h-full cursor-pointer`}
        style={{
          width: data.width,
          height: data.height,
        }}
      >
        <p className="font-medium">{"Start"}</p>
        <Handle
          type="source"
          id="source"
          className="invisible"
          position={Position.Bottom}
          isConnectable={false}
        />
      </div>
    </NodeWrapper>
  );
}
