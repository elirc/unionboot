// 395: Report policy 12: open, min 10, rows
// Filter records by amount >=10, status open; sort amount ascending, ties id ascending (code-unit). Skip 0, take 2. Return {id,amount} rows. Never mutate input. Records are valid, amounts finite, IDs unique.
// Tests: node mixed-data/verify.cjs --id=395 [--starters]
// Study tests/395.cjs for examples.
function solve(input) {
const selected=input.filter(r=>r.amount>=10&&r.status==='open').map(r=>({...r})).sort((a,b)=>a.amount-b.amount||(a.id<b.id?-1:a.id>b.id?1:0)).slice(0,2);return selected.map(r=>({id:r.id,amount:r.amount}));
}
module.exports=solve;
