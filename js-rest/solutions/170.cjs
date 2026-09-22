// 170: Process tagged power instructions
// Input {initial,steps}. Each step must have type 'power' or throw Error('Unknown operation'). Apply raise current to step.value left-to-right. Return {value,trace} where trace records each result. Finite valid values supplied.
// Tests: node js-rest/verify.cjs --id=170 [--starters]
// Study tests/170.cjs for examples.
// Why this works:
// The running value starts at input.initial and each step updates it in
// order, so this is a left fold over the steps.
// Every step is checked before it is applied: a step.type this variant does
// not recognise throws Error('Unknown operation') immediately, which is why
// a bad step stops the run rather than being skipped.
// trace records the value AFTER each step, so trace has one entry per step
// and never contains the initial value.
// Policy power: the running value is the BASE and step.value the exponent,
// so the step contributes value = value ** step.value. Getting the two the
// wrong way round changes the answer for every non-symmetric pair.
function solve(input) {
  let value = input.initial;
  const trace = [];
  for (const step of input.steps) {
    if (step.type !== 'power') {
      throw new Error('Unknown operation');
    }
    value = value ** step.value;
    trace.push(value);
  }
  return { value, trace };
}
module.exports=solve;
