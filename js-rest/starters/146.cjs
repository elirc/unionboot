// 146: Bounded event buffer: reject
// Input {capacity,events}; capacity positive integer or Error('Invalid capacity'). Process primitive events in order. On capacity overflow reject with Error("Overflow"). Return final buffer, leaving events unchanged. grow ignores the cap after validation.
// Tests: node js-rest/verify.cjs --id=146 [--starters]
// Study tests/146.cjs for examples.
function solve(input) {throw new Error('TODO exercise 146');}
module.exports=solve;
