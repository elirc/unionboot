// 162: Square matrix above sum
// Input square matrix of finite numbers; [] returns0. Reject non-square rows with Error('Not square'). Sum strictly above main diagonal cells, no mutation.
// Tests: node js-rest/verify.cjs --id=162 [--starters]
// Study tests/162.cjs for examples.
function solve(input) {
const n=input.length;if(input.some(r=>r.length!==n))throw new Error('Not square');let sum=0;for(let r=0;r<n;r++)for(let c=0;c<n;c++)if(c>r)sum+=input[r][c];return sum;
}
module.exports=solve;
