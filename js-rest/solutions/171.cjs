// 171: Process tagged clamp instructions
// Input {initial,steps}. Each step must have type 'clamp' or throw Error('Unknown operation'). Apply clamp current between step.min and step.max left-to-right. Return {value,trace} where trace records each result. Finite valid values supplied.
// Tests: node js-rest/verify.cjs --id=171 [--starters]
// Study tests/171.cjs for examples.
// Why this works:
// The running value starts at input.initial and each step updates it in
// order, so this is a left fold over the steps.
// Every step is checked before it is applied: a step.type this variant does
// not recognise throws Error('Unknown operation') immediately, which is why
// a bad step stops the run rather than being skipped.
// trace records the value AFTER each step, so trace has one entry per step
// and never contains the initial value.
// Policy clamp: this is the one variant whose step carries min and max rather
// than value. Math.max pulls the value up to min first, then Math.min pushes
// it down to max, so the result always lies inside [min, max].
function solve(input) {
  let value = input.initial;
  const trace = [];
  for (const step of input.steps) {
    if (step.type !== 'clamp') {
      throw new Error('Unknown operation');
    }
    value = Math.min(step.max, Math.max(step.min, value));
    trace.push(value);
  }
  return { value, trace };
}
module.exports=solve;
