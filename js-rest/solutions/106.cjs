// 106: Index records: reject
// Input {rows:[{id,value}]} with string ids and primitive values. Return sorted [id,value] pairs. Duplicate policy: reject; collect returns arrays even for a single value. reject throws Error for duplicates. Use Map so all string keys work. Preserve input.
// Tests: node js-rest/verify.cjs --id=106 [--starters]
// Study tests/106.cjs for examples.
function solve(input) {
const m=new Map();for(const row of input.rows){if(m.has(row.id))throw new Error("Duplicate id");m.set(row.id,row.value);}return [...m].sort((a,b)=>a[0]<b[0]?-1:a[0]>b[0]?1:0);
}
module.exports=solve;
