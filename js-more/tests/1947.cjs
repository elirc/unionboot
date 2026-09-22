// 1947 Zero-one knapsack policies / scenario 9 — capacity=8; tie=lighter
// Prompt: ../prompts/1947.txt
'use strict';
const assert=require('node:assert/strict');
const cfg={"capacity":8,"tie":"lighter"};
module.exports=async solve=>{
const eq=assert.equal,deep=assert.deepEqual;
function check(input,expected){const before=structuredClone(input);deep(solve(input),expected);deep(input,before,'Input must not mutate');}
check([],{value:0,ids:[],weight:0});function oracle(items){let best=null;for(let mask=0;mask<2**items.length;mask++){const selected=items.filter((_,i)=>mask&(1<<i)),weight=selected.reduce((s,x)=>s+x.weight,0);if(weight>cfg.capacity)continue;const candidate={value:selected.reduce((s,x)=>s+x.value,0),ids:selected.map(x=>x.id),weight};if(!best||candidate.value>best.value||(candidate.value===best.value&&(weight!==best.weight?(cfg.tie==='lighter'?weight<best.weight:weight>best.weight):JSON.stringify(candidate.ids)<JSON.stringify(best.ids))))best=candidate;}return best;}const items=[{id:'a',weight:2,value:4},{id:'b',weight:3,value:4},{id:'c',weight:4,value:8},{id:'d',weight:1,value:0},{id:'e',weight:5,value:9}];check(items,oracle(items));check([...items].reverse(),oracle([...items].reverse()));assert.throws(()=>solve([{id:'a',weight:0,value:9}]),/Weight/);
};
