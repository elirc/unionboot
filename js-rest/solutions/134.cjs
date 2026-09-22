// 134: Locate whitespace runs
// Input ASCII string. Return {start,end,text} for maximal runs of whitespace, with end exclusive. Letters A–Z/a–z; digits 0–9; whitespace JS \s; punctuation means non-alphanumeric, non-whitespace. Indices are UTF-16 offsets.
// Tests: node js-rest/verify.cjs --id=134 [--starters]
// Study tests/134.cjs for examples.
function solve(input) {
const out=[];const regex=/\s+/g;for(const match of input.matchAll(regex))out.push({start:match.index,end:match.index+match[0].length,text:match[0]});return out;
}
module.exports=solve;
