// 168: Process tagged add instructions
// Input {initial,steps}. Each step must have type 'add' or throw Error('Unknown operation'). Apply step.value addition left-to-right. Return {value,trace} where trace records each result. Finite valid values supplied.
// Tests: node js-rest/verify.cjs --id=168 [--starters]
// Study tests/168.cjs for examples.
// Why this works:
// The running value starts at input.initial and each step updates it in
// order, so this is a left fold over the steps.
// Every step is checked before it is applied: a step.type this variant does
// not recognise throws Error('Unknown operation') immediately, which is why
// a bad step stops the run rather than being skipped.
// trace records the value AFTER each step, so trace has one entry per step
// and never contains the initial value.
// Policy add: the step contributes value = value + step.value.
function solve(input) {
  let value = input.initial;
  const trace = [];
  for (const step of input.steps) {
    if (step.type !== 'add') {
      throw new Error('Unknown operation');
    }
    value = value + step.value;
    trace.push(value);
  }
  return { value, trace };
}
module.exports=solve;
