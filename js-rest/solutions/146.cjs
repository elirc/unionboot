// 146: Bounded event buffer: reject
// Input {capacity,events}; capacity positive integer or Error('Invalid capacity'). Process primitive events in order. On capacity overflow reject with Error("Overflow"). Return final buffer, leaving events unchanged. grow ignores the cap after validation.
// Tests: node js-rest/verify.cjs --id=146 [--starters]
// Study tests/146.cjs for examples.
// Why this works:
// Validation comes first: capacity must be a whole number of at least 1, or
// Error('Invalid capacity') is thrown before any event is looked at.
// The buffer is a fresh array, so input.events is only iterated, never spliced.
// Policy reject: an event arriving at a full buffer is a hard failure, so
// Error("Overflow") is thrown. Note the two error messages are different and
// both are matched exactly by the tests.
function solve(input) {
  const capacity = input.capacity;
  if (!Number.isInteger(capacity) || capacity < 1) {
    throw new Error('Invalid capacity');
  }
  const buffer = [];
  for (const event of input.events) {
    if (buffer.length === capacity) {
      throw new Error("Overflow");
    }
    buffer.push(event);
  }
  return buffer;
}
module.exports=solve;
