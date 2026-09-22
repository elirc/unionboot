// 181: Compare text under ignore-case normalization
// Input {a,b} strings. Normalize with lowercase only. Return {equal,firstDifference} where index is in normalized strings, -1 if equal; shorter-prefix mismatch is at shorter length.
// Tests: node js-rest/verify.cjs --id=181 [--starters]
// Study tests/181.cjs for examples.
// Why this works:
// Both strings are put through the same normalizer first, so every later
// decision is made on the normalized text. That is what makes the reported
// index an index into the normalized strings, not the originals.
// The scan walks forward while the characters agree, stopping at the length
// of the shorter string, so when one string is a prefix of the other the
// mismatch is reported at the shorter length.
// equal compares the whole normalized strings, which is why a pure prefix is
// still unequal, and -1 is only reported when they match exactly.
// Policy ignore-case: the normalizer lowercases, so case alone never counts
// as a difference. Lengths are unchanged, so indices still line up with the
// original strings.
function solve(input) {
  const normalize = text => text.toLowerCase();
  const a = normalize(input.a);
  const b = normalize(input.b);
  let index = 0;
  while (index < Math.min(a.length, b.length) && a[index] === b[index]) {
    index++;
  }
  const equal = a === b;
  return { equal, firstDifference: equal ? -1 : index };
}
module.exports=solve;
