// 125: Configuration diff: removed
// Input {before,after} plain objects with primitive values. Return lexically sorted keys that were removed. Use own properties and Object.is for comparing present values; no mutation.
// Tests: node js-rest/verify.cjs --id=125 [--starters]
// Study tests/125.cjs for examples.
function solve(input) {
const {before,after}=input;return [...new Set([...Object.keys(before),...Object.keys(after)])].filter(k=>{const a=Object.hasOwn(before,k),b=Object.hasOwn(after,k);return a&&!b;}).sort();
}
module.exports=solve;
