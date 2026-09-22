// 91: Decode explicit run records
// Input is an array of [text,count] pairs. Text must be a string, count a nonnegative safe integer, otherwise throw TypeError. Return their repeated concatenation. Before allocating output, reject a total UTF-16 length over maxLength (default 10000) with RangeError. maxLength must be a nonnegative safe integer.
// Hint: Validate the complete output length first, then allocate repetitions.
// Test starter: node js/batch-084-103/verify.cjs --starters --id=91
'use strict';
// Why this works:
// Two passes, and the split between them is the point of the exercise. The
// first pass validates every run and accumulates the total output length; only
// the second pass builds any string. The run ['ab',3] against a maxLength of 5
// must be rejected before six characters are allocated, so a hostile count
// cannot exhaust memory before the limit is consulted.
// maxLength itself is checked before anything else, and is a RangeError.
// Inside a run, a non-string text or a count that is not a nonnegative safe
// integer is a TypeError, while exceeding the length budget is a RangeError.
// The test asserts the two error types separately, so they must not be merged.
// The running total is compared inside the loop, so the check trips as soon as
// the accumulated length passes the limit rather than after the whole scan.
function decodeRuns(runs, maxLength = 10000) {
  if (!Number.isSafeInteger(maxLength) || maxLength < 0) {
    throw new RangeError('Invalid limit');
  }
  let totalLength = 0;
  for (const [text, count] of runs) {
    if (typeof text !== 'string' || !Number.isSafeInteger(count) || count < 0) {
      throw new TypeError('Invalid run');
    }
    totalLength += text.length * count;
    if (totalLength > maxLength) {
      throw new RangeError('Output too long');
    }
  }
  return runs.map(([text, count]) => text.repeat(count)).join('');
}
module.exports = decodeRuns;
