// 1756 Heap job dispatch / scenario 8 — direction=low; aging=2
// Prompt: ../prompts/1756.txt
'use strict';
const cfg={"direction":"low","aging":2};
function heapDispatch(input) {
  const waiting=input.map((job,index)=>({...job,index})); let now=0; const out=[];
  while(waiting.length){
    if(!waiting.some(x=>x.arrival<=now))now=Math.min(...waiting.map(x=>x.arrival));
    const rank=x=>(cfg.direction==='high'?-x.priority:x.priority)-cfg.aging*(now-x.arrival);
    const before=(a,b)=>rank(a)<rank(b)||(rank(a)===rank(b)&&a.index<b.index);
    const heap=[];
    for(const job of waiting.filter(x=>x.arrival<=now)){
      heap.push(job);let i=heap.length-1;while(i>0){const p=(i-1)>>1;if(!before(heap[i],heap[p]))break;[heap[i],heap[p]]=[heap[p],heap[i]];i=p;}
    }
    const job=heap[0]; waiting.splice(waiting.indexOf(job),1);
    // Heap contains copies of the same job objects placed in waiting.
    out.push({id:job.id,start:now,end:now+job.duration}); now+=job.duration;
  }
  return out;
}
module.exports=heapDispatch;
