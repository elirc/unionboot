// 386: Report policy 3: any, min 20, rows
// Filter records by amount >=20, status any; sort amount ascending, ties id ascending (code-unit). Skip 0, take 2. Return {id,amount} rows. Never mutate input. Records are valid, amounts finite, IDs unique.
// Tests: node mixed-data/verify.cjs --id=386 [--starters]
// Study tests/386.cjs for examples.
function solve(input) {
const selected=input.filter(r=>r.amount>=20).map(r=>({...r})).sort((a,b)=>a.amount-b.amount||(a.id<b.id?-1:a.id>b.id?1:0)).slice(0,2);return selected.map(r=>({id:r.id,amount:r.amount}));
}
module.exports=solve;
