// 157: Positive streak: shortest
// Input finite-number array. Return {start,length} for shortest contiguous run of strictly positive numbers, or null. First run wins equal lengths. Zero/negative breaks a streak.
// Tests: node js-rest/verify.cjs --id=157 [--starters]
// Study tests/157.cjs for examples.
// Why this works:
// The array is scanned once and every maximal run of strictly positive
// numbers is recorded as { start, length }. A zero or a negative number is
// not part of any run, so the scanner simply steps over it.
// The inner while loop runs to the end of the current run, which is why the
// outer loop does not advance the index itself.
// Policy shortest: reduce replaces the best only when a later run is strictly
// shorter, so the first of two equal lengths wins.
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
  return runs.reduce((best, run) => (run.length < best.length ? run : best));
}
module.exports=solve;
