// 123: Quantize to a step: toward-zero
// Input {values:number[],step:number}; step must be finite and >0 or throw Error('Invalid step'). Round each value/step using toward-zero, then multiply by step. nearest-half-up means Math.floor(x+0.5), including negatives. Normalize negative zero to zero.
// Tests: node js-rest/verify.cjs --id=123 [--starters]
// Study tests/123.cjs for examples.
// Why this works:
// Validation runs first: a step that is not a finite number, or is zero or
// negative, throws Error('Invalid step') before any value is touched.
// Each value is divided by the step, rounded to a whole number of steps, and
// multiplied back, which snaps it onto the step grid.
// Policy toward-zero: Math.trunc drops the fractional part, so it rounds down
// for positives and up for negatives. This is the only variant of the four
// that is not monotonic in one direction.
// The trailing || 0 replaces a negative zero result with plain zero, which
// matters here because Math.trunc(-0.5) is -0.
function solve(input) {
  const step = input.step;
  if (!Number.isFinite(step) || step <= 0) {
    throw new Error('Invalid step');
  }
  return input.values.map(value => {
    const stepsFromZero = value / step;
    const snapped = Math.trunc(stepsFromZero) * step;
    return snapped || 0;
  });
}
module.exports=solve;
