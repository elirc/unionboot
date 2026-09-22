// 97: Encode BigInt without toString(radix)
// Return the base-2-through-36 lowercase representation of a nonnegative BigInt. Reject invalid bases with RangeError and negative values with RangeError. Do not use toString(radix). Zero returns "0".
// Hint: Collect remainder digits in reverse order.
// Test starter: node js/batch-084-103/verify.cjs --starters --id=97
'use strict';
function encodeBase(value,base) {
  if(!Number.isInteger(base)||base<2||base>36||value<0n)throw new RangeError('Invalid input');
  if(value===0n)return '0';
  const digits='0123456789abcdefghijklmnopqrstuvwxyz',radix=BigInt(base);let out='';
  while(value>0n){out=digits[Number(value%radix)]+out;value/=radix;}return out;
}
module.exports = encodeBase;
