// 160: Square matrix main sum
// Input square matrix of finite numbers; [] returns0. Reject non-square rows with Error('Not square'). Sum main diagonal cells, no mutation.
// Tests: node js-rest/verify.cjs --id=160 [--starters]
// Study tests/160.cjs for examples.
function solve(input) {
const n=input.length;if(input.some(r=>r.length!==n))throw new Error('Not square');let sum=0;for(let r=0;r<n;r++)for(let c=0;c<n;c++)if(r===c)sum+=input[r][c];return sum;
}
module.exports=solve;
