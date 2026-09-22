// 181: Compare text under ignore-case normalization
// Input {a,b} strings. Normalize with lowercase only. Return {equal,firstDifference} where index is in normalized strings, -1 if equal; shorter-prefix mismatch is at shorter length.
// Tests: node js-rest/verify.cjs --id=181 [--starters]
// Study tests/181.cjs for examples.
function solve(input) {
const norm=s=>s.toLowerCase();const a=norm(input.a),b=norm(input.b);let i=0;while(i<Math.min(a.length,b.length)&&a[i]===b[i])i++;const equal=a===b;return {equal,firstDifference:equal?-1:i};
}
module.exports=solve;
