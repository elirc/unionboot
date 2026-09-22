// 107: Index records: collect
// Input {rows:[{id,value}]} with string ids and primitive values. Return sorted [id,value] pairs. Duplicate policy: collect; collect returns arrays even for a single value. reject throws Error for duplicates. Use Map so all string keys work. Preserve input.
// Tests: node js-rest/verify.cjs --id=107 [--starters]
// Study tests/107.cjs for examples.
function solve(input) {
const m=new Map();for(const row of input.rows){if(!m.has(row.id))m.set(row.id,[]);m.get(row.id).push(row.value);}return [...m].sort((a,b)=>a[0]<b[0]?-1:a[0]>b[0]?1:0);
}
module.exports=solve;
