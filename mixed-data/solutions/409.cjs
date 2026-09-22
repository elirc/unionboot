// 409: Report policy 26: closed, min 0, rows
// Filter records by amount >=0, status closed; sort amount descending, ties id ascending (code-unit). Skip 0, take 3. Return {id,amount} rows. Never mutate input. Records are valid, amounts finite, IDs unique.
// Tests: node mixed-data/verify.cjs --id=409 [--starters]
// Study tests/409.cjs for examples.
function solve(input) {
const selected=input.filter(r=>r.amount>=0&&r.status==='closed').map(r=>({...r})).sort((a,b)=>b.amount-a.amount||(a.id<b.id?-1:a.id>b.id?1:0)).slice(0,3);return selected.map(r=>({id:r.id,amount:r.amount}));
}
module.exports=solve;
