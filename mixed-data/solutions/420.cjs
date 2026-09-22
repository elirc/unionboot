// 420: Report policy 37: any, min 10, total
// Filter records by amount >=10, status any; sort amount descending, ties id ascending (code-unit). Skip 0, take 4. Return {count,total} for selected rows. Never mutate input. Records are valid, amounts finite, IDs unique.
// Tests: node mixed-data/verify.cjs --id=420 [--starters]
// Study tests/420.cjs for examples.
function solve(input) {
const selected=input.filter(r=>r.amount>=10).map(r=>({...r})).sort((a,b)=>b.amount-a.amount||(a.id<b.id?-1:a.id>b.id?1:0)).slice(0,4);return {count:selected.length,total:selected.reduce((s,r)=>s+r.amount,0)};
}
module.exports=solve;
