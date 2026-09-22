// 183: Compare text under alphanumeric normalization
// Input {a,b} strings. Normalize with lowercase and remove all characters except ASCII letters/digits. Return {equal,firstDifference} where index is in normalized strings, -1 if equal; shorter-prefix mismatch is at shorter length.
// Tests: node js-rest/verify.cjs --id=183 [--starters]
// Study tests/183.cjs for examples.
function solve(input) {
const norm=s=>s.toLowerCase().replace(/[^a-z0-9]/g,"");const a=norm(input.a),b=norm(input.b);let i=0;while(i<Math.min(a.length,b.length)&&a[i]===b[i])i++;const equal=a===b;return {equal,firstDifference:equal?-1:i};
}
module.exports=solve;
