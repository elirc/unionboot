// 91: Decode explicit run records
// Input is an array of [text,count] pairs. Text must be a string, count a nonnegative safe integer, otherwise throw TypeError. Return their repeated concatenation. Before allocating output, reject a total UTF-16 length over maxLength (default 10000) with RangeError. maxLength must be a nonnegative safe integer.
// Hint: Validate the complete output length first, then allocate repetitions.
// Test starter: node js/batch-084-103/verify.cjs --starters --id=91
'use strict';
function decodeRuns(runs,maxLength=10000) {
  if(!Number.isSafeInteger(maxLength)||maxLength<0)throw new RangeError('Invalid limit');
  let total=0;
  for(const [text,count] of runs){
    if(typeof text!=='string'||!Number.isSafeInteger(count)||count<0)throw new TypeError('Invalid run');
    total+=text.length*count; if(total>maxLength)throw new RangeError('Output too long');
  }
  return runs.map(([text,count])=>text.repeat(count)).join('');
}
module.exports = decodeRuns;
