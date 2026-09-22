// 412: Report policy 29: closed, min 30, rows
// Filter records by amount >=30, status closed; sort amount descending, ties id ascending (code-unit). Skip 0, take 3. Return {id,amount} rows. Never mutate input. Records are valid, amounts finite, IDs unique.
// Tests: node mixed-data/verify.cjs --id=412 [--starters]
// Study tests/412.cjs for examples.
function solve(input) {throw new Error('TODO exercise 412');}
module.exports=solve;
