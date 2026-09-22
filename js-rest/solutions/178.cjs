// 178: Graph classification: isolated
// Input {nodes:string[],edges:[from,to][]}. Nodes unique, edges reference nodes; duplicate edges permitted. Return sorted labels of nodes with neither incoming nor outgoing edges.
// Tests: node js-rest/verify.cjs --id=178 [--starters]
// Study tests/178.cjs for examples.
// Why this works:
// The edge list is summarised into two Sets of node labels before any node is
// classified. A Set answers "does this label appear" in constant time and
// collapses duplicate edges automatically, which is why the prompt can allow
// the same edge to be listed twice without changing the answer.
// Policy isolated: a node is isolated when it is neither an edge target nor
// an edge source, so it is in the sources list and the sinks list at once.
// The filtered array is new, so sorting it does not touch input.nodes.
function solve(input) {
  const hasIncoming = new Set(input.edges.map(edge => edge[1]));
  const hasOutgoing = new Set(input.edges.map(edge => edge[0]));
  const isolated = input.nodes.filter(node => !hasIncoming.has(node) && !hasOutgoing.has(node));
  return isolated.sort();
}
module.exports=solve;
