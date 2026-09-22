// 123: Quantize to a step: toward-zero
// Input {values:number[],step:number}; step must be finite and >0 or throw Error('Invalid step'). Round each value/step using toward-zero, then multiply by step. nearest-half-up means Math.floor(x+0.5), including negatives. Normalize negative zero to zero.
// Tests: node js-rest/verify.cjs --id=123 [--starters]
// Study tests/123.cjs for examples.
function solve(input) {
if(!Number.isFinite(input.step)||input.step<=0)throw new Error('Invalid step');return input.values.map(n=>{const x=n/input.step;return Math.trunc(x)*input.step||0;});
}
module.exports=solve;
