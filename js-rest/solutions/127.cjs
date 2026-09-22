// 127: Configuration diff: unchanged
// Input {before,after} plain objects with primitive values. Return lexically sorted keys that were unchanged. Use own properties and Object.is for comparing present values; no mutation.
// Tests: node js-rest/verify.cjs --id=127 [--starters]
// Study tests/127.cjs for examples.
// Why this works:
// The union of both key lists is built once, de-duplicated with a Set, so
// every key is classified exactly once no matter which side it came from.
// Object.hasOwn asks whether the object itself carries the key, rather than
// checking for undefined, so a key whose value really is undefined still
// counts as present.
// Policy unchanged: the key must be on BOTH sides and the two values must be
// the same value. Object.is is used rather than ===, so NaN counts as
// unchanged and 0 and -0 count as changed.
// The final sort() uses the default lexical order and runs on a fresh array.
function solve(input) {
  const { before, after } = input;
  const allKeys = [...new Set([...Object.keys(before), ...Object.keys(after)])];
  const selected = allKeys.filter(key => {
    const inBefore = Object.hasOwn(before, key);
    const inAfter = Object.hasOwn(after, key);
    return inBefore && inAfter && Object.is(before[key], after[key]);
  });
  return selected.sort();
}
module.exports=solve;
