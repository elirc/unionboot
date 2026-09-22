// 118: Nearest point: chebyshev distance
// Input {origin:[x,y],points:[[x,y],...]}. Return index of nearest point by chebyshev distance; first wins ties, -1 if empty. Coordinates are finite. Do not sort/mutate input.
// Tests: node js-rest/verify.cjs --id=118 [--starters]
// Study tests/118.cjs for examples.
function solve(input) {
let best=Infinity,index=-1;input.points.forEach((p,i)=>{const dx=Math.abs(p[0]-input.origin[0]),dy=Math.abs(p[1]-input.origin[1]);const d=Math.max(dx,dy);if(d<best){best=d;index=i;}});return index;
}
module.exports=solve;
