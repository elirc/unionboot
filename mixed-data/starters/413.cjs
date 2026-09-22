// 413: Report policy 30: closed, min 40, rows
// Filter records by amount >=40, status closed; sort amount descending, ties id ascending (code-unit). Skip 0, take 3. Return {id,amount} rows. Never mutate input. Records are valid, amounts finite, IDs unique.
// Tests: node mixed-data/verify.cjs --id=413 [--starters]
// Study tests/413.cjs for examples.
function solve(input) {throw new Error('TODO exercise 413');}
module.exports=solve;
