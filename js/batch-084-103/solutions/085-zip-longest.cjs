// 85: Zip uneven arrays
// Return pairs through the longer dense array. Fill missing positions with fill (default null). Preserve actual undefined entries. Do not mutate either input.
// Hint: Use index bounds rather than nullish coalescing to detect missing entries.
// Test starter: node js/batch-084-103/verify.cjs --starters --id=85
'use strict';
function zipLongest(a,b,fill=null) {
  return Array.from({length:Math.max(a.length,b.length)}, (_,i) => [i<a.length?a[i]:fill,i<b.length?b[i]:fill]);
}
module.exports = zipLongest;
