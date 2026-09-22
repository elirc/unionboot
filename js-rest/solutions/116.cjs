// 116: Nearest point: euclidean distance
// Input {origin:[x,y],points:[[x,y],...]}. Return index of nearest point by euclidean distance; first wins ties, -1 if empty. Coordinates are finite. Do not sort/mutate input.
// Tests: node js-rest/verify.cjs --id=116 [--starters]
// Study tests/116.cjs for examples.
function solve(input) {
let best=Infinity,index=-1;input.points.forEach((p,i)=>{const dx=Math.abs(p[0]-input.origin[0]),dy=Math.abs(p[1]-input.origin[1]);const d=Math.hypot(dx,dy);if(d<best){best=d;index=i;}});return index;
}
module.exports=solve;
