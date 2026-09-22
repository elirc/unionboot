// 169: Process tagged multiply instructions
// Input {initial,steps}. Each step must have type 'multiply' or throw Error('Unknown operation'). Apply step.value multiplication left-to-right. Return {value,trace} where trace records each result. Finite valid values supplied.
// Tests: node js-rest/verify.cjs --id=169 [--starters]
// Study tests/169.cjs for examples.
function solve(input) {
let value=input.initial;const trace=[];for(const step of input.steps){if(step.type!=='multiply')throw new Error('Unknown operation');value=value*step.value;trace.push(value);}return {value,trace};
}
module.exports=solve;
