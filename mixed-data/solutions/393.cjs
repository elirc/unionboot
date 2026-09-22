// 393: Report policy 10: any, min 40, rows
// Filter records by amount >=40, status any; sort amount descending, ties id ascending (code-unit). Skip 0, take 2. Return {id,amount} rows. Never mutate input. Records are valid, amounts finite, IDs unique.
// Tests: node mixed-data/verify.cjs --id=393 [--starters]
// Study tests/393.cjs for examples.
function solve(input) {
const selected=input.filter(r=>r.amount>=40).map(r=>({...r})).sort((a,b)=>b.amount-a.amount||(a.id<b.id?-1:a.id>b.id?1:0)).slice(0,2);return selected.map(r=>({id:r.id,amount:r.amount}));
}
module.exports=solve;
