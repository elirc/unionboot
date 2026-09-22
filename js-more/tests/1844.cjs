// 1844 Lazy iterator pipelines / scenario 6 — mode=square; take=4
// Prompt: ../prompts/1844.txt
'use strict';
const assert=require('node:assert/strict');
const cfg={"mode":"square","take":4};
module.exports=async solve=>{
const eq=assert.equal,deep=assert.deepEqual;
function check(input,expected){const before=structuredClone(input);deep(solve(input),expected);deep(input,before,'Input must not mutate');}
let pulls=0,closed=0;function* source(){try{for(const n of [-2,-1,0,1,2,3,4,5,6,7,8,9]){pulls++;yield n;}}finally{closed++;}}const iterator=solve(source());eq(pulls,0);const result=[...iterator];const values=[-2,-1,0,1,2,3,4,5,6,7,8,9];const projected=values.filter(x=>cfg.mode==='even'?x%2===0:cfg.mode==='positive'?x>0:true).map(x=>cfg.mode==='square'?x*x:cfg.mode==='negate'?-x:cfg.mode==='double'?x*2:x).slice(0,cfg.take);deep(result,projected);eq(closed,1);let expectedPulls=0,kept=0;for(const x of values){expectedPulls++;if(cfg.mode==='even'?x%2===0:cfg.mode==='positive'?x>0:true)kept++;if(kept===cfg.take)break;}eq(pulls,expectedPulls);pulls=0;closed=0;for(const x of solve(source())){void x;break;}eq(closed,1);deep([...solve([])],[]);
};
