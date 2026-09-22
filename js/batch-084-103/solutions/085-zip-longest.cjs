// 85: Zip uneven arrays
// Return pairs through the longer dense array. Fill missing positions with fill (default null). Preserve actual undefined entries. Do not mutate either input.
// Hint: Use index bounds rather than nullish coalescing to detect missing entries.
// Test starter: node js/batch-084-103/verify.cjs --starters --id=85
'use strict';
// Why this works:
// The result has one pair per index of the longer array, so its length is
// Math.max(a.length, b.length) and Array.from can build it in a single pass.
// Each side is read only when the index is within range for that array. That
// is what the hint means by using index bounds: an entry is "missing" when the
// index is past the end, not when the value stored there looks empty.
// The test calls solve([undefined],[2,3],'?') and expects
// [[undefined,2],['?',3]]. Index 0 of `a` exists and holds undefined, so that
// undefined is kept; index 1 is past the end of `a`, so it becomes '?'. A
// check written as (a[index] ?? fill) would replace both and fail that case.
// Neither input array is written to, so both survive the call unchanged.
function zipLongest(a, b, fill = null) {
  const length = Math.max(a.length, b.length);
  return Array.from({ length }, (_, index) => [
    index < a.length ? a[index] : fill,
    index < b.length ? b[index] : fill,
  ]);
}
module.exports = zipLongest;
