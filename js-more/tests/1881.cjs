// 1881 Sudoku candidate validation / scenario 3 — box=2; diagonal=false
// Prompt: ../prompts/1881.txt
'use strict';
const assert=require('node:assert/strict');
const cfg={"box":2,"diagonal":false};
module.exports=async solve=>{
const eq=assert.equal,deep=assert.deepEqual;
function check(input,expected){const before=structuredClone(input);deep(solve(input),expected);deep(input,before,'Input must not mutate');}
const n=cfg.box*cfg.box,empty=()=>Array.from({length:n},()=>Array(n).fill(0));const board=empty();check({board,row:0,col:0},{valid:true,candidates:Array.from({length:n},(_,i)=>i+1)});board[0][0]=1;check({board,row:0,col:0},{valid:true,candidates:[]});if(n>1){check({board,row:0,col:1},{valid:true,candidates:Array.from({length:n-1},(_,i)=>i+2)});const dup=empty();dup[0][0]=1;dup[0][1]=1;check({board:dup,row:0,col:0},{valid:false,candidates:[]});const diagonal=empty();diagonal[0][0]=1;const r=cfg.box,c=cfg.box;check({board:diagonal,row:r,col:c},{valid:true,candidates:Array.from({length:n},(_,i)=>i+1).filter(x=>!cfg.diagonal||x!==1)});}assert.throws(()=>solve({board:[],row:0,col:0}),/Invalid board/);
};
