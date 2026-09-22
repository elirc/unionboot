// 158: Positive streak: first
// Input finite-number array. Return {start,length} for first contiguous run of strictly positive numbers, or null.  Zero/negative breaks a streak.
// Tests: node js-rest/verify.cjs --id=158 [--starters]
// Study tests/158.cjs for examples.
// Why this works:
// The array is scanned once and every maximal run of strictly positive
// numbers is recorded as { start, length }. A zero or a negative number is
// not part of any run, so the scanner simply steps over it.
// The inner while loop runs to the end of the current run, which is why the
// outer loop does not advance the index itself.
// Policy first: runs are collected left to right, so the answer is simply
// the first element; no length comparison happens at all.
// No run at all returns null rather than a zero-length record.
function solve(input) {
  const runs = [];
  let index = 0;
  while (index < input.length) {
    if (input[index] <= 0) {
      index++;
      continue;
    }
    const start = index;
    while (index < input.length && input[index] > 0) {
      index++;
    }
    runs.push({ start, length: index - start });
  }
  if (runs.length === 0) {
    return null;
  }
  return runs[0];
}
module.exports=solve;
