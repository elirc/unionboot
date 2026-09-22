// 91: Decode explicit run records
// Input is an array of [text,count] pairs. Text must be a string, count a nonnegative safe integer, otherwise throw TypeError. Return their repeated concatenation. Before allocating output, reject a total UTF-16 length over maxLength (default 10000) with RangeError. maxLength must be a nonnegative safe integer.
// Hint: Validate the complete output length first, then allocate repetitions.
// Test starter: node js/batch-084-103/verify.cjs --starters --id=91
'use strict';
function decodeRuns(runs, maxLength = 10000) {
  throw new Error('TODO: decodeRuns');
}
module.exports = decodeRuns;
