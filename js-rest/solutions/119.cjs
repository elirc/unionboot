// 119: Nearest point: squared distance
// Input {origin:[x,y],points:[[x,y],...]}. Return index of nearest point by squared distance; first wins ties, -1 if empty. Coordinates are finite. Do not sort/mutate input.
// Tests: node js-rest/verify.cjs --id=119 [--starters]
// Study tests/119.cjs for examples.
function solve(input) {
let best=Infinity,index=-1;input.points.forEach((p,i)=>{const dx=Math.abs(p[0]-input.origin[0]),dy=Math.abs(p[1]-input.origin[1]);const d=dx*dx+dy*dy;if(d<best){best=d;index=i;}});return index;
}
module.exports=solve;
