import { useContext } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getSmoothStepPath,
} from "reactflow";
import { DrawerName, editor } from "./Editor";
import { PlusCircleIcon } from "@heroicons/react/20/solid";

export function AddNodeEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  label,
  source,
  target,
}: EdgeProps) {
  const { showDrawer } = useContext(editor);
  const [edgePath, centerX, centerY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const onEdgeClick = (
    event: Record<"stopPropagation", () => void>,
    id: string
  ) => {
    event.stopPropagation();
    showDrawer(DrawerName.newNode, {
      id,
      sourceNodeId: source,
      targetNodeId: target,
      sourceEdgeLabel: label,
    });
  };

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{ pointerEvents: "none", strokeWidth: 2 }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            transform: `translate(-50%, -50%) translate(${centerX}px,${centerY}px)`,
            pointerEvents: "all",
          }}
          className="absolute rounded-full w-4 h-4 text-black"
        >
          <button
            onClick={(event) => onEdgeClick(event, id)}
            className={`w-full h-full hover-focus:bg-black rounded-full absolute overflow-hidden flex items-center justify-center border border-teal-400 shadow-sm-light shadow-gray-300 group hover-focus:border-slate-900 transition-colors duration-300`}
          >
            <PlusCircleIcon className="w-[130%] absolute text-teal-500 group-hover-focus:text-teal-300 transition-colors bg-white group-hover-focus:bg-slate-900 duration-300" />
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
