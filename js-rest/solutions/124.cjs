// 124: Configuration diff: added
// Input {before,after} plain objects with primitive values. Return lexically sorted keys that were added. Use own properties and Object.is for comparing present values; no mutation.
// Tests: node js-rest/verify.cjs --id=124 [--starters]
// Study tests/124.cjs for examples.
function solve(input) {
const {before,after}=input;return [...new Set([...Object.keys(before),...Object.keys(after)])].filter(k=>{const a=Object.hasOwn(before,k),b=Object.hasOwn(after,k);return !a&&b;}).sort();
}
module.exports=solve;
