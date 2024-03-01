# Frontend

## Tech used

- React (vite)
- TypeScript
- ReactFlow
- Tailwind
- Framer-Motion

**There is no package manager set, feel free to use your personal preference.**

## How to run

```shell
# npm is just an example, use your package manager
npm run dev
```

## Docs

### Nodes + Edges

On `pages/GraphEditor/Nodes` you can see we currently have 3 node types: Start,
End and Conditional. All of them have no functionality implemented, only visuals
(which can also be changed if you want).

Between two nodes, there is an edge of the type `add-node`, which has a button
that when clicked, opens a Drawer to add a new node between the two.

### Contexts

In the root page we have 2 contexts:

- editor: For UI stuff, for example the Drawer state.
- graph: ReactFlow-related states and functions, to add nodes, zoom graph and
  more.

### Utility

We already have pre-existing functions to help you with the graph, for
positioning and also nodes/edges. They are the files: `nodeGeneration.ts` and
`positionNodes.ts`.
