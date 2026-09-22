// 178: Graph classification: isolated
// Input {nodes:string[],edges:[from,to][]}. Nodes unique, edges reference nodes; duplicate edges permitted. Return sorted labels of nodes with neither incoming nor outgoing edges.
// Tests: node js-rest/verify.cjs --id=178 [--starters]
// Study tests/178.cjs for examples.
function solve(input) {
const incoming=new Set(input.edges.map(e=>e[1])),outgoing=new Set(input.edges.map(e=>e[0])),self=new Set(input.edges.filter(e=>e[0]===e[1]).map(e=>e[0]));return input.nodes.filter(n=>!incoming.has(n)&&!outgoing.has(n)).sort();
}
module.exports=solve;
