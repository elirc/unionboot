// 404: Report policy 21: closed, min 0, rows
// Filter records by amount >=0, status closed; sort amount ascending, ties id ascending (code-unit). Skip 0, take 3. Return {id,amount} rows. Never mutate input. Records are valid, amounts finite, IDs unique.
// Tests: node mixed-data/verify.cjs --id=404 [--starters]
// Study tests/404.cjs for examples.
function solve(input) {throw new Error('TODO exercise 404');}
module.exports=solve;
