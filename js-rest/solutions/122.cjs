// 122: Quantize to a step: nearest-half-up
// Input {values:number[],step:number}; step must be finite and >0 or throw Error('Invalid step'). Round each value/step using nearest-half-up, then multiply by step. nearest-half-up means Math.floor(x+0.5), including negatives. Normalize negative zero to zero.
// Tests: node js-rest/verify.cjs --id=122 [--starters]
// Study tests/122.cjs for examples.
// Why this works:
// Validation runs first: a step that is not a finite number, or is zero or
// negative, throws Error('Invalid step') before any value is touched.
// Each value is divided by the step, rounded to a whole number of steps, and
// multiplied back, which snaps it onto the step grid.
// Policy nearest-half-up: the prompt defines it as Math.floor(x + 0.5), which
// sends an exact half upwards even for negatives, so -0.5 steps becomes 0.
// Math.round would agree here, but the prompt names the floor form, so that
// is what the code spells out.
// The trailing || 0 replaces a negative zero result with plain zero.
function solve(input) {
  const step = input.step;
  if (!Number.isFinite(step) || step <= 0) {
    throw new Error('Invalid step');
  }
  return input.values.map(value => {
    const stepsFromZero = value / step;
    const snapped = Math.floor(stepsFromZero + 0.5) * step;
    return snapped || 0;
  });
}
module.exports=solve;
