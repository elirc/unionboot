// 179: Graph classification: self-looped
// Input {nodes:string[],edges:[from,to][]}. Nodes unique, edges reference nodes; duplicate edges permitted. Return sorted labels of nodes with an edge to themselves.
// Tests: node js-rest/verify.cjs --id=179 [--starters]
// Study tests/179.cjs for examples.
// Why this works:
// The edge list is summarised into a Set of node labels before any node is
// classified. A Set answers "does this label appear" in constant time and
// collapses duplicate edges automatically, which is why the prompt can allow
// the same edge to be listed twice without changing the answer.
// Policy self-looped: only edges whose two ends are the same label count, so
// the edges are filtered before their label is collected. This is the one
// variant that keeps nodes because of an edge rather than despite one.
// The filtered array is new, so sorting it does not touch input.nodes.
function solve(input) {
  const hasSelfLoop = new Set(
    input.edges.filter(edge => edge[0] === edge[1]).map(edge => edge[0])
  );
  const selfLooped = input.nodes.filter(node => hasSelfLoop.has(node));
  return selfLooped.sort();
}
module.exports=solve;
