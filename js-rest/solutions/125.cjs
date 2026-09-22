// 125: Configuration diff: removed
// Input {before,after} plain objects with primitive values. Return lexically sorted keys that were removed. Use own properties and Object.is for comparing present values; no mutation.
// Tests: node js-rest/verify.cjs --id=125 [--starters]
// Study tests/125.cjs for examples.
// Why this works:
// The union of both key lists is built once, de-duplicated with a Set, so
// every key is classified exactly once no matter which side it came from.
// Object.hasOwn asks whether the object itself carries the key, rather than
// checking for undefined, so a key whose value really is undefined still
// counts as present.
// Policy removed: keep keys that are present in before and absent from after.
// The final sort() uses the default lexical order and runs on a fresh array.
function solve(input) {
  const { before, after } = input;
  const allKeys = [...new Set([...Object.keys(before), ...Object.keys(after)])];
  const selected = allKeys.filter(key => {
    const inBefore = Object.hasOwn(before, key);
    const inAfter = Object.hasOwn(after, key);
    return inBefore && !inAfter;
  });
  return selected.sort();
}
module.exports=solve;
