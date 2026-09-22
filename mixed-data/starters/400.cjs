// 400: Report policy 17: open, min 10, rows
// Filter records by amount >=10, status open; sort amount descending, ties id ascending (code-unit). Skip 0, take 3. Return {id,amount} rows. Never mutate input. Records are valid, amounts finite, IDs unique.
// Tests: node mixed-data/verify.cjs --id=400 [--starters]
// Study tests/400.cjs for examples.
function solve(input) {throw new Error('TODO exercise 400');}
module.exports=solve;
