// 402: Report policy 19: open, min 30, rows
// Filter records by amount >=30, status open; sort amount descending, ties id ascending (code-unit). Skip 0, take 3. Return {id,amount} rows. Never mutate input. Records are valid, amounts finite, IDs unique.
// Tests: node mixed-data/verify.cjs --id=402 [--starters]
// Study tests/402.cjs for examples.
function solve(input) {
const selected=input.filter(r=>r.amount>=30&&r.status==='open').map(r=>({...r})).sort((a,b)=>b.amount-a.amount||(a.id<b.id?-1:a.id>b.id?1:0)).slice(0,3);return selected.map(r=>({id:r.id,amount:r.amount}));
}
module.exports=solve;
