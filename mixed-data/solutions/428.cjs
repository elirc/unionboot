// 428: Report policy 45: open, min 40, total
// Filter records by amount >=40, status open; sort amount ascending, ties id ascending (code-unit). Skip 0, take 4. Return {count,total} for selected rows. Never mutate input. Records are valid, amounts finite, IDs unique.
// Tests: node mixed-data/verify.cjs --id=428 [--starters]
// Study tests/428.cjs for examples.
function solve(input) {
const selected=input.filter(r=>r.amount>=40&&r.status==='open').map(r=>({...r})).sort((a,b)=>a.amount-b.amount||(a.id<b.id?-1:a.id>b.id?1:0)).slice(0,4);return {count:selected.length,total:selected.reduce((s,r)=>s+r.amount,0)};
}
module.exports=solve;
