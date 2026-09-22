// 171: Process tagged clamp instructions
// Input {initial,steps}. Each step must have type 'clamp' or throw Error('Unknown operation'). Apply clamp current between step.min and step.max left-to-right. Return {value,trace} where trace records each result. Finite valid values supplied.
// Tests: node js-rest/verify.cjs --id=171 [--starters]
// Study tests/171.cjs for examples.
function solve(input) {
let value=input.initial;const trace=[];for(const step of input.steps){if(step.type!=='clamp')throw new Error('Unknown operation');value=Math.min(step.max,Math.max(step.min,value));trace.push(value);}return {value,trace};
}
module.exports=solve;
