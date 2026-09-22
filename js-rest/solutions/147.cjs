// 147: Bounded event buffer: grow
// Input {capacity,events}; capacity positive integer or Error('Invalid capacity'). Process primitive events in order. On capacity overflow grow . Return final buffer, leaving events unchanged. grow ignores the cap after validation.
// Tests: node js-rest/verify.cjs --id=147 [--starters]
// Study tests/147.cjs for examples.
// Why this works:
// Validation comes first: capacity must be a whole number of at least 1, or
// Error('Invalid capacity') is thrown before any event is looked at.
// The buffer is a fresh array, so input.events is only iterated, never spliced.
// Policy grow: the capacity is still validated but never enforced, so there
// is no overflow branch at all and every event is appended.
function solve(input) {
  const capacity = input.capacity;
  if (!Number.isInteger(capacity) || capacity < 1) {
    throw new Error('Invalid capacity');
  }
  const buffer = [];
  for (const event of input.events) {
    buffer.push(event);
  }
  return buffer;
}
module.exports=solve;
