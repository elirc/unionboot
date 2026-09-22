// 145: Bounded event buffer: drop-newest
// Input {capacity,events}; capacity positive integer or Error('Invalid capacity'). Process primitive events in order. On capacity overflow drop-newest . Return final buffer, leaving events unchanged. grow ignores the cap after validation.
// Tests: node js-rest/verify.cjs --id=145 [--starters]
// Study tests/145.cjs for examples.
// Why this works:
// Validation comes first: capacity must be a whole number of at least 1, or
// Error('Invalid capacity') is thrown before any event is looked at.
// The buffer is a fresh array, so input.events is only iterated, never spliced.
// Policy drop-newest: when the buffer is already full, the incoming event is
// skipped with continue and the buffer keeps the events that arrived first.
function solve(input) {
  const capacity = input.capacity;
  if (!Number.isInteger(capacity) || capacity < 1) {
    throw new Error('Invalid capacity');
  }
  const buffer = [];
  for (const event of input.events) {
    if (buffer.length === capacity) {
      continue;
    }
    buffer.push(event);
  }
  return buffer;
}
module.exports=solve;
