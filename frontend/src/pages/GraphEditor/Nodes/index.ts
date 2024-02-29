import { ConditionalNode } from './Conditional';
import { EndNode } from './End';
import { StartNode } from './Start';

// Nodes that can manually added by the user to a graph.
const userAddableNodes = {
  conditional: ConditionalNode,
};
export type UserAddableNodeName = keyof typeof userAddableNodes;

// Nodes cannot be added by the user to a graph. That is, their placement is
// automatic as the user adds other nodes.
const automaticNodes = {
  start: StartNode,
  end: EndNode,
};
export type AutomaticNodeName = keyof typeof automaticNodes;

export const allNodes = {
  ...automaticNodes,
  ...userAddableNodes,
};

export type NodeName = keyof typeof allNodes;

type NodeConstructorParams<SelectedNodeName extends NodeName> = Parameters<
  (typeof allNodes)[SelectedNodeName]
>;

export type NodeProps<SelectedNodeName extends NodeName> =
  NodeConstructorParams<SelectedNodeName>[0];

export type NodeData<SelectedNodeName extends NodeName> =
  NodeProps<SelectedNodeName>['data'];
