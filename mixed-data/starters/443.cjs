// 443: Report policy 60: closed, min 40, total
// Filter records by amount >=40, status closed; sort amount descending, ties id ascending (code-unit). Skip 0, take 2. Return {count,total} for selected rows. Never mutate input. Records are valid, amounts finite, IDs unique.
// Tests: node mixed-data/verify.cjs --id=443 [--starters]
// Study tests/443.cjs for examples.
function solve(input) {throw new Error('TODO exercise 443');}
module.exports=solve;
