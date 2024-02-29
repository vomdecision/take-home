import { nanoid } from "nanoid";
import { Edge, MarkerType, Node } from "reactflow";
import { NodeData, NodeName, NodeProps } from "./Nodes";

type PrefilledEdgeFields = "id" | "type" | "markerEnd";
export type EditableEdge = Omit<Edge, PrefilledEdgeFields>;

export type PrefilledNodeDataFields = "width" | "height";

export function generateUniqueNodeId() {
  const arbitraryButShortIdLength = 10;
  return nanoid(arbitraryButShortIdLength);
}

export function insertNodeAfterEdge<SelectedNodeName extends NodeName>({
  edge,
  nodeName,
  edges,
  nodes,
}: {
  edge: Edge;
  nodeName: SelectedNodeName;
  edges: Edge[];
  nodes: Node[];
}): { addedNode: NodeProps<SelectedNodeName>; nodes: Node[]; edges: Edge[] } {
  let addedNode = {};
  let returnNodes = null;
  let returnEdges = null;

  switch (nodeName) {
    // End nodes can't be added by Users, so they are never placed between two
    // nodes, they're always at the end. Their edge is always a new edge.
    case "end": {
      const newEndNode = generateNode({
        nodeName: "end",
      });
      const newEdge = generateEdge({
        source: edge.source,
        target: newEndNode.id,
      });

      addedNode = newEndNode;
      returnNodes = [...nodes, newEndNode];
      returnEdges = [...edges, newEdge];
      break;
    }
    case "conditional": {
      const newConditionalNode = generateNode({
        nodeName: "conditional",
        data: {
          label: "",
        },
      });

      const newEndNodes = {
        branch: generateNode({ nodeName: "end" }),
      };

      const newEdges = [
        generateEdge({
          source: newConditionalNode.id,
          target: newEndNodes.branch.id,
          label: "True",
        }),
        generateEdge({
          source: newConditionalNode.id,
          target: edge.target,
          label: "False",
        }),
      ];

      const updatedExistingEdges = edges.map((e) => {
        if (e.id === edge.id) {
          return { ...e, target: newConditionalNode.id };
        }
        return e;
      });

      const newNodes = [newEndNodes.branch, newConditionalNode];
      addedNode = newConditionalNode;
      returnNodes = [...nodes, ...newNodes];
      returnEdges = [...updatedExistingEdges, ...newEdges];
      break;
    }
  }

  return {
    addedNode: addedNode as NodeProps<SelectedNodeName>,
    nodes: returnNodes as Node[],
    edges: returnEdges as Edge[],
  };
}

/**
 * Generates an edge with pre-filled properties such id, type, and the
 * properties passed.
 * @param params Editable parameters of the edge, including data.
 * @returns Edge
 */
export function generateEdge(params: EditableEdge): Edge {
  const prefilledParams = {
    id: generateUniqueNodeId(),
    type: "add-node",
    markerEnd: {
      type: MarkerType.Arrow,
      height: 30,
      width: 20,
    },
  } satisfies Record<PrefilledEdgeFields, unknown>;

  return {
    ...params,
    ...prefilledParams,
  };
}

/**
 * Generates a node object with the type and data passed.
 * @returns Node
 */
export function generateNode<SelectedNodeName extends NodeName>({
  nodeName,
  data,
  id,
}: {
  nodeName: SelectedNodeName;
  data?: Partial<Omit<NodeData<SelectedNodeName>, PrefilledNodeDataFields>>;
  id?: SelectedNodeName extends "start" ? string : never;
}): Node<NodeData<SelectedNodeName>> {
  const willBePositionedLater = { x: 0, y: 0 };

  return {
    id: id ?? generateUniqueNodeId(),
    type: nodeName,
    position: willBePositionedLater,
    data: {
      ...data,
      ...getNodeDimensions(nodeName),
    },
  };
}

/**
 * Returns the width and height of the node based on its type.
 */
export function getNodeDimensions(nodeName: NodeName) {
  // Make node dimensions a multiple of this size in order to make nodes align
  // with the grid and thus make debugging easier.
  const gridUnitSize = 20;

  switch (nodeName) {
    case "conditional":
      return {
        width: 8 * gridUnitSize,
        height: 5 * gridUnitSize,
      };
    default:
      return {
        width: 4 * gridUnitSize,
        height: 4 * gridUnitSize,
      };
  }
}
