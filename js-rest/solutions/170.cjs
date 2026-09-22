// 170: Process tagged power instructions
// Input {initial,steps}. Each step must have type 'power' or throw Error('Unknown operation'). Apply raise current to step.value left-to-right. Return {value,trace} where trace records each result. Finite valid values supplied.
// Tests: node js-rest/verify.cjs --id=170 [--starters]
// Study tests/170.cjs for examples.
function solve(input) {
let value=input.initial;const trace=[];for(const step of input.steps){if(step.type!=='power')throw new Error('Unknown operation');value=value**step.value;trace.push(value);}return {value,trace};
}
module.exports=solve;
