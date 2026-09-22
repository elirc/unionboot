// 1742 Weighted interval scheduling / scenario 4 — gap=1; tie=more
// Prompt: ../prompts/1742.txt
'use strict';
const cfg={"gap":1,"tie":"more"};
function weightedIntervals(input) {
  const jobs=[...input].sort((a,b)=>a.end-b.end || (a.id<b.id?-1:1));
  const best=[{value:0, ids:[]}];
  const better=(a,b)=>{
    if(a.value!==b.value)return a.value>b.value?a:b;
    if(a.ids.length!==b.ids.length)return (cfg.tie==='fewer'?a.ids.length<b.ids.length:a.ids.length>b.ids.length)?a:b;
    return JSON.stringify(a.ids)<JSON.stringify(b.ids)?a:b;
  };
  for(let i=0;i<jobs.length;i++) {
    let lo=0,hi=i;
    while(lo<hi){const mid=(lo+hi)>>1;if(jobs[mid].end+cfg.gap<=jobs[i].start)lo=mid+1;else hi=mid;}
    const prior=best[lo];
    best.push(better(best[i],{value:prior.value+jobs[i].value,ids:[...prior.ids,jobs[i].id]}));
  }
  return best.at(-1);
}
module.exports=weightedIntervals;
