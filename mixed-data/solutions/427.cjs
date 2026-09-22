// 427: Report policy 44: open, min 30, total
// Filter records by amount >=30, status open; sort amount ascending, ties id ascending (code-unit). Skip 0, take 4. Return {count,total} for selected rows. Never mutate input. Records are valid, amounts finite, IDs unique.
// Tests: node mixed-data/verify.cjs --id=427 [--starters]
// Study tests/427.cjs for examples.
function solve(input) {
const selected=input.filter(r=>r.amount>=30&&r.status==='open').map(r=>({...r})).sort((a,b)=>a.amount-b.amount||(a.id<b.id?-1:a.id>b.id?1:0)).slice(0,4);return {count:selected.length,total:selected.reduce((s,r)=>s+r.amount,0)};
}
module.exports=solve;
