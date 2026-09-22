// 1837 Async semaphore queues / scenario 9 — permits=5; queue=fifo
// Prompt: ../prompts/1837.txt
'use strict';
const cfg={"permits":5,"queue":"fifo"};
function semaphore() {
  let active=0;const waiting=[];
  function grant(resolve){active++;let released=false;resolve(()=>{if(released)return;released=true;active--;if(waiting.length)grant((cfg.queue==='fifo'?waiting.shift():waiting.pop()).resolve);});}
  return {acquire(){return new Promise(resolve=>{if(active<cfg.permits)grant(resolve);else waiting.push({resolve});});},stats(){return {active,waiting:waiting.length};}};
}
module.exports=semaphore;
