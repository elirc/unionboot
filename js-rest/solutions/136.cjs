// 136: Robot navigation starting north
// Input string of L,R,F commands; invalid character throws Error('Invalid command'). Start at (0,0) facing north. L/R turn90 degrees; F moves one unit; north increases y, east increases x. Return {x,y,direction} using N/E/S/W.
// Tests: node js-rest/verify.cjs --id=136 [--starters]
// Study tests/136.cjs for examples.
function solve(input) {
let x=0,y=0,d=0;const steps=[[0,1],[1,0],[0,-1],[-1,0]];for(const c of input){if(c==='L')d=(d+3)%4;else if(c==='R')d=(d+1)%4;else if(c==='F'){x+=steps[d][0];y+=steps[d][1];}else throw new Error('Invalid command');}return {x,y,direction:'NESW'[d]};
}
module.exports=solve;
