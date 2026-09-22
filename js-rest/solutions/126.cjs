// 126: Configuration diff: changed
// Input {before,after} plain objects with primitive values. Return lexically sorted keys that were changed. Use own properties and Object.is for comparing present values; no mutation.
// Tests: node js-rest/verify.cjs --id=126 [--starters]
// Study tests/126.cjs for examples.
function solve(input) {
const {before,after}=input;return [...new Set([...Object.keys(before),...Object.keys(after)])].filter(k=>{const a=Object.hasOwn(before,k),b=Object.hasOwn(after,k);return a&&b&&!Object.is(before[k],after[k]);}).sort();
}
module.exports=solve;
