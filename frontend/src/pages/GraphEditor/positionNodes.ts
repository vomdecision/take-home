import { Edge, Node, XYPosition } from "reactflow";

// Settings for positionNodes. Changing values is mostly for testing.
export type ExtraParams = {
  // Minimal horizontal space in pixels between two nodes in the same row, even
  // if they come from different subtrees.
  minHorizontalGap?: number;

  // Vertical space in pixels between a parent and its children. Notice this is
  // not a minimum, since all blocks have fixed height.
  verticalGap?: number;

  // Vertical space in pixels between a conditional and its children. It is in a
  // separate field since conditionals need a bigger gap to make space for the labels.
  verticalGapAfterConditional?: number;
};

export const positionNodes = (
  originalNodes: Node[],
  originalEdges: Edge[],
  extraParams?: ExtraParams
): [Node[], Edge[]] => {
  // Params will be easier to use later since all fields will be required with
  // packed in defaults.
  // Values were chosen to make the graph look good aesthetically and are all
  // multiples of 20 to snap to a 20px grid, thus making debugging easier.
  const params: Required<ExtraParams> = {
    // Values were chosen to make the graph look good aesthetically.
    minHorizontalGap: 60,

    // Makes space for add edge (+) button.
    verticalGap: 60,

    // This is bigger than verticalGap since conditionals need more space for
    // the labels. It is 130 because a bigger value seemed too different from
    // the other verticalGaps, but it is arbitrary.
    verticalGapAfterConditional: 130,
    ...extraParams,
  };

  const tree = toTree(originalNodes, originalEdges);

  const root: TreeNode = findRoot(tree);
  computeTotalWidthRecursively(root, params);

  tree.forEach((node) => {
    positionNodeRelatively(node, params);
  });

  positionNodeAbsolutelyAndRecursively(root);

  // This is optional since the graph zero position is irrelevant, but it makes
  // testing easier.
  putRootAtZero(root);

  // originalNodes's positions were mutated in place by
  // positionNodeAbsolutelyAndRecursively.
  return [originalNodes, originalEdges];
};

export function changeEdgeOrder({
  edgeToBeReordered,
  newOrder,
  edges,
}: {
  edges: Edge[];
  edgeToBeReordered: Edge;
  newOrder: number;
}): Edge[] {
  const oldOrder = edgeToBeReordered?.data?.orderWithinParent;
  const minimumOrder = 0;
  const edgeIsElse = edgeToBeReordered?.data?.conditionFormula === null;

  if (newOrder < minimumOrder || newOrder === oldOrder || edgeIsElse) {
    return edges;
  }

  const edgeInTargetOrder = edges.find((edge) => {
    const isSiblingOfPassedEdge = edge.source === edgeToBeReordered.source;
    const occupiesWantedOrder = edge.data?.orderWithinParent === newOrder;

    return isSiblingOfPassedEdge && occupiesWantedOrder;
  });

  const reorderedEdges = [...edges].map((edge) => {
    if (edge.id === edgeToBeReordered.id) {
      edge.data.orderWithinParent = newOrder;
    } else if (edge.id === edgeInTargetOrder?.id) {
      edge.data.orderWithinParent = oldOrder;
    }
    return edge;
  });

  return reorderedEdges;
}

// React-flow's Node plus what we need to position a set of nodes, including
// building a tree out of them.
type TreeNode = {
  graphNode: Node;

  parent: TreeNode | null;

  // The edge that connects the parent to the current node.
  edge: Edge | null;

  // The order the children appear here is also the order they should be drawn
  // in, left to right.
  children: TreeNode[];

  // Position relative to parent.
  relativePosition: XYPosition;

  // Total horizontal space in pixels this node should take, including space to
  // cover its children, grandchildren, etc.
  totalWidth: number;
};

function toTree(nodes: Node[], edges: Edge[]): Map<string, TreeNode> {
  const nodeMap = new Map<string, TreeNode>();
  nodes.forEach((node) => {
    nodeMap.set(node.id, {
      graphNode: node,
      parent: null,
      children: [],
      edge: null,
      relativePosition: { x: 0, y: 0 },
      totalWidth: 0,
    });
  });

  edges.forEach((edge) => {
    const sourceNode = nodeMap.get(edge.source)!;
    const targetNode = nodeMap.get(edge.target)!;
    if (!sourceNode || !targetNode) {
      throw new Error(
        `Edge ${edge.source} -> ${edge.target} has an invalid node`
      );
    }
    targetNode.parent = sourceNode;
    targetNode.edge = edge;
    sourceNode.children.push(targetNode);
  });

  nodeMap.forEach((node) => {
    node.parent?.children.sort((a, b) =>
      a.edge?.data?.orderWithinParent > b.edge?.data?.orderWithinParent ? -1 : 1
    );
  });

  return nodeMap;
}

function findRoot(nodeMap: Map<string, TreeNode>): TreeNode {
  for (const node of nodeMap.values()) {
    if (!node.parent) {
      return node;
    }
  }
  throw new Error("Could not find root node");
}

function computeTotalWidthRecursively(
  node: TreeNode,
  extraParams: Required<ExtraParams>
): number {
  if (node.children.length === 0) {
    node.totalWidth = node.graphNode.data.width;
    return node.totalWidth;
  }

  let childrenTotalWidth = node.children.reduce((total, child) => {
    return total + computeTotalWidthRecursively(child, extraParams);
  }, 0);
  childrenTotalWidth +=
    extraParams.minHorizontalGap * (node.children.length - 1);

  node.totalWidth = Math.max(node.graphNode.data.width, childrenTotalWidth);
  return node.totalWidth;
}

// Set node.relativePosition.
function positionNodeRelatively(
  node: TreeNode,
  {
    minHorizontalGap,
    verticalGap,
    verticalGapAfterConditional,
  }: Required<ExtraParams>
) {
  const parent = node.parent;
  if (parent == null) {
    // Root.
    return;
  }

  const afterConditional = parent.graphNode.type === "conditional";
  node.relativePosition.y =
    parent.graphNode.data.height +
    (afterConditional ? verticalGapAfterConditional : verticalGap);

  // Divide the totalWidth of the parent in parts given by each child's
  // totalWidth and center this node on the part allocated to it.
  const siblings = parent.children;
  const parentAreaStart =
    parent.graphNode.data.width / 2 - parent.totalWidth / 2;
  const indexWithinSiblings = siblings.indexOf(node);
  let nodeAreaStart = parentAreaStart;
  nodeAreaStart += siblings
    .slice(0, indexWithinSiblings)
    .reduce((total, sibling) => total + sibling.totalWidth, 0);
  if (indexWithinSiblings > 0) {
    nodeAreaStart += minHorizontalGap * indexWithinSiblings;
  }
  // If there is only a single child, it needs to be centered using all the
  // width available from the parent, else it should use their own width.
  const widthAvailable =
    siblings.length === 1 ? parent.totalWidth : node.totalWidth;
  const nodeAreaCenter = nodeAreaStart + widthAvailable / 2;
  node.relativePosition.x = nodeAreaCenter - node.graphNode.data.width / 2;
}

// Set node.graphNode.position by doing a DFS on the tree.
function positionNodeAbsolutelyAndRecursively(node: TreeNode) {
  const parent = node.parent;
  if (parent != null) {
    node.graphNode.position = {
      x: parent.graphNode.position.x + node.relativePosition.x,
      y: parent.graphNode.position.y + node.relativePosition.y,
    };
  }

  for (const child of node.children) {
    positionNodeAbsolutelyAndRecursively(child);
  }

  // Do this so that the graph is more symmetric and aesthetically pleasing.
  centerNodeBetweenChildren(node);
}

function centerNodeBetweenChildren(node: TreeNode) {
  if (node.children.length == 0) {
    return;
  }
  const leftNode = node.children[0].graphNode;
  const leftCenter = leftNode.position.x + leftNode.data.width / 2;
  const rightNode = node.children[node.children.length - 1].graphNode;
  const rightCenter = rightNode.position.x + rightNode.data.width / 2;
  const center = (leftCenter + rightCenter) / 2;
  node.graphNode.position.x = center - node.graphNode.data.width / 2;
}

function putRootAtZero(root: TreeNode) {
  moveNodeBy(root, {
    x: -root.graphNode.position.x,
    y: -root.graphNode.position.y,
  });
}

function moveNodeBy(node: TreeNode, moveBy: XYPosition) {
  node.graphNode.position.x += moveBy.x;
  node.graphNode.position.y += moveBy.y;

  node.children.forEach((child) => {
    moveNodeBy(child, moveBy);
  });
}
