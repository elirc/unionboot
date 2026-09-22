// 429: Report policy 46: open, min 0, total
// Filter records by amount >=0, status open; sort amount descending, ties id ascending (code-unit). Skip 0, take 2. Return {count,total} for selected rows. Never mutate input. Records are valid, amounts finite, IDs unique.
// Tests: node mixed-data/verify.cjs --id=429 [--starters]
// Study tests/429.cjs for examples.
function solve(input) {throw new Error('TODO exercise 429');}
module.exports=solve;
