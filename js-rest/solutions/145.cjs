// 145: Bounded event buffer: drop-newest
// Input {capacity,events}; capacity positive integer or Error('Invalid capacity'). Process primitive events in order. On capacity overflow drop-newest . Return final buffer, leaving events unchanged. grow ignores the cap after validation.
// Tests: node js-rest/verify.cjs --id=145 [--starters]
// Study tests/145.cjs for examples.
function solve(input) {
if(!Number.isInteger(input.capacity)||input.capacity<1)throw new Error('Invalid capacity');const out=[];for(const e of input.events){if(out.length===input.capacity){continue;}out.push(e);}return out;
}
module.exports=solve;
