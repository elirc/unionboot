// 144: Bounded event buffer: drop-oldest
// Input {capacity,events}; capacity positive integer or Error('Invalid capacity'). Process primitive events in order. On capacity overflow drop-oldest . Return final buffer, leaving events unchanged. grow ignores the cap after validation.
// Tests: node js-rest/verify.cjs --id=144 [--starters]
// Study tests/144.cjs for examples.
// Why this works:
// Validation comes first: capacity must be a whole number of at least 1, or
// Error('Invalid capacity') is thrown before any event is looked at.
// The buffer is a fresh array, so input.events is only iterated, never spliced.
// Policy drop-oldest: when the buffer is already full, shift() removes the
// element at the front before the new event is pushed on the end, so the
// buffer always holds the most recent capacity events.
function solve(input) {
  const capacity = input.capacity;
  if (!Number.isInteger(capacity) || capacity < 1) {
    throw new Error('Invalid capacity');
  }
  const buffer = [];
  for (const event of input.events) {
    if (buffer.length === capacity) {
      buffer.shift();
    }
    buffer.push(event);
  }
  return buffer;
}
module.exports=solve;
