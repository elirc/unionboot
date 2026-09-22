// 1939 Zero-one knapsack policies / scenario 1 — capacity=4; tie=lighter
// Prompt: ../prompts/1939.txt
'use strict';
const cfg={"capacity":4,"tie":"lighter"};
function knapsack(input) {
  const dp=Array.from({length:cfg.capacity+1},()=>({value:0,ids:[],weight:0}));
  const better=(a,b)=>{
    if(a.value!==b.value)return a.value>b.value?a:b;
    if(a.weight!==b.weight)return (cfg.tie==='lighter'?a.weight<b.weight:a.weight>b.weight)?a:b;
    return JSON.stringify(a.ids)<JSON.stringify(b.ids)?a:b;
  };
  for(const item of input){
    if(!Number.isInteger(item.weight)||item.weight<=0)throw new RangeError('Weight');
    for(let w=cfg.capacity;w>=item.weight;w--){const p=dp[w-item.weight];dp[w]=better(dp[w],{value:p.value+item.value,ids:[...p.ids,item.id],weight:p.weight+item.weight});}
  }
  return dp[cfg.capacity];
}
module.exports=knapsack;
