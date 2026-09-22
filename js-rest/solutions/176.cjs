// 176: Graph classification: sources
// Input {nodes:string[],edges:[from,to][]}. Nodes unique, edges reference nodes; duplicate edges permitted. Return sorted labels of nodes with no incoming edges.
// Tests: node js-rest/verify.cjs --id=176 [--starters]
// Study tests/176.cjs for examples.
// Why this works:
// The edge list is summarised into a Set of node labels before any node is
// classified. A Set answers "does this label appear" in constant time and
// collapses duplicate edges automatically, which is why the prompt can allow
// the same edge to be listed twice without changing the answer.
// Policy sources: a node is a source when no edge ends at it, so the test is
// membership in the set of edge targets, e[1].
// The filtered array is new, so sorting it does not touch input.nodes.
function solve(input) {
  const hasIncoming = new Set(input.edges.map(edge => edge[1]));
  const sources = input.nodes.filter(node => !hasIncoming.has(node));
  return sources.sort();
}
module.exports=solve;
