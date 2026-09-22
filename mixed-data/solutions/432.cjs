// 432: Report policy 49: open, min 30, total
// Filter records by amount >=30, status open; sort amount descending, ties id ascending (code-unit). Skip 0, take 2. Return {count,total} for selected rows. Never mutate input. Records are valid, amounts finite, IDs unique.
// Tests: node mixed-data/verify.cjs --id=432 [--starters]
// Study tests/432.cjs for examples.
function solve(input) {
const selected=input.filter(r=>r.amount>=30&&r.status==='open').map(r=>({...r})).sort((a,b)=>b.amount-a.amount||(a.id<b.id?-1:a.id>b.id?1:0)).slice(0,2);return {count:selected.length,total:selected.reduce((s,r)=>s+r.amount,0)};
}
module.exports=solve;
