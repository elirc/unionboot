// 1747 Weighted interval scheduling / scenario 9 — gap=4; tie=fewer
// Prompt: ../prompts/1747.txt
'use strict';
const assert=require('node:assert/strict');
const cfg={"gap":4,"tie":"fewer"};
module.exports=async solve=>{
const eq=assert.equal,deep=assert.deepEqual;
function check(input,expected){const before=structuredClone(input);deep(solve(input),expected);deep(input,before,'Input must not mutate');}
check([],{value:0,ids:[]});function oracle(jobs){let best=null;for(let mask=0;mask<2**jobs.length;mask++){const selected=jobs.filter((_,i)=>mask&(1<<i)).sort((a,b)=>a.end-b.end||(a.id<b.id?-1:1));if(selected.some((x,i)=>i&&selected[i-1].end+cfg.gap>x.start))continue;const candidate={value:selected.reduce((s,x)=>s+x.value,0),ids:selected.map(x=>x.id)};if(!best||candidate.value>best.value||(candidate.value===best.value&&(candidate.ids.length!==best.ids.length?(cfg.tie==='fewer'?candidate.ids.length<best.ids.length:candidate.ids.length>best.ids.length):JSON.stringify(candidate.ids)<JSON.stringify(best.ids))))best=candidate;}return best;}
 const jobs=[{id:'c',start:0,end:8,value:10},{id:'a',start:0,end:2,value:5},{id:'b',start:2,end:4,value:5},{id:'d',start:5,end:6,value:0},{id:'e',start:9,end:11,value:6},{id:'f',start:13,end:15,value:6}];check(jobs,oracle(jobs));
 for(let gap=0;gap<=5;gap++){const rows=[{id:'a',start:0,end:1,value:2},{id:'b',start:1+gap,end:2+gap,value:2},{id:'c',start:0,end:2+gap,value:4}];check(rows,oracle(rows));}
};
