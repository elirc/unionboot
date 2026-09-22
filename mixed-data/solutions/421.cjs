// 421: Report policy 38: any, min 20, total
// Filter records by amount >=20, status any; sort amount descending, ties id ascending (code-unit). Skip 0, take 4. Return {count,total} for selected rows. Never mutate input. Records are valid, amounts finite, IDs unique.
// Tests: node mixed-data/verify.cjs --id=421 [--starters]
// Study tests/421.cjs for examples.
function solve(input) {
const selected=input.filter(r=>r.amount>=20).map(r=>({...r})).sort((a,b)=>b.amount-a.amount||(a.id<b.id?-1:a.id>b.id?1:0)).slice(0,4);return {count:selected.length,total:selected.reduce((s,r)=>s+r.amount,0)};
}
module.exports=solve;
