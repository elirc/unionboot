// 147: Bounded event buffer: grow
// Input {capacity,events}; capacity positive integer or Error('Invalid capacity'). Process primitive events in order. On capacity overflow grow . Return final buffer, leaving events unchanged. grow ignores the cap after validation.
// Tests: node js-rest/verify.cjs --id=147 [--starters]
// Study tests/147.cjs for examples.
function solve(input) {
if(!Number.isInteger(input.capacity)||input.capacity<1)throw new Error('Invalid capacity');const out=[];for(const e of input.events){if(out.length===input.capacity){}out.push(e);}return out;
}
module.exports=solve;
