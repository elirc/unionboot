// 120: Quantize to a step: floor
// Input {values:number[],step:number}; step must be finite and >0 or throw Error('Invalid step'). Round each value/step using floor, then multiply by step. nearest-half-up means Math.floor(x+0.5), including negatives. Normalize negative zero to zero.
// Tests: node js-rest/verify.cjs --id=120 [--starters]
// Study tests/120.cjs for examples.
// Why this works:
// Validation runs first: a step that is not a finite number, or is zero or
// negative, throws Error('Invalid step') before any value is touched.
// Each value is divided by the step, rounded to a whole number of steps, and
// multiplied back, which snaps it onto the step grid.
// Policy floor: Math.floor rounds down, towards negative infinity, so -1.5
// steps becomes -2 steps.
// The trailing || 0 replaces a negative zero result with plain zero.
function solve(input) {
  const step = input.step;
  if (!Number.isFinite(step) || step <= 0) {
    throw new Error('Invalid step');
  }
  return input.values.map(value => {
    const stepsFromZero = value / step;
    const snapped = Math.floor(stepsFromZero) * step;
    return snapped || 0;
  });
}
module.exports=solve;
