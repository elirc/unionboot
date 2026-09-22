// 403: Report policy 20: open, min 40, rows
// Filter records by amount >=40, status open; sort amount descending, ties id ascending (code-unit). Skip 0, take 3. Return {id,amount} rows. Never mutate input. Records are valid, amounts finite, IDs unique.
// Tests: node mixed-data/verify.cjs --id=403 [--starters]
// Study tests/403.cjs for examples.
function solve(input) {throw new Error('TODO exercise 403');}
module.exports=solve;
