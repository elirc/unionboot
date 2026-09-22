// 177: Graph classification: sinks
// Input {nodes:string[],edges:[from,to][]}. Nodes unique, edges reference nodes; duplicate edges permitted. Return sorted labels of nodes with no outgoing edges.
// Tests: node js-rest/verify.cjs --id=177 [--starters]
// Study tests/177.cjs for examples.
// Why this works:
// The edge list is summarised into a Set of node labels before any node is
// classified. A Set answers "does this label appear" in constant time and
// collapses duplicate edges automatically, which is why the prompt can allow
// the same edge to be listed twice without changing the answer.
// Policy sinks: a node is a sink when no edge starts at it, so the test is
// membership in the set of edge sources, e[0].
// The filtered array is new, so sorting it does not touch input.nodes.
function solve(input) {
  const hasOutgoing = new Set(input.edges.map(edge => edge[0]));
  const sinks = input.nodes.filter(node => !hasOutgoing.has(node));
  return sinks.sort();
}
module.exports=solve;
