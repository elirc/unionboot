// 1831 Async semaphore queues / scenario 3 — permits=2; queue=fifo
// Prompt: ../prompts/1831.txt
'use strict';
const cfg={"permits":2,"queue":"fifo"};
function semaphore() {
  let active=0;const waiting=[];
  function grant(resolve){active++;let released=false;resolve(()=>{if(released)return;released=true;active--;if(waiting.length)grant((cfg.queue==='fifo'?waiting.shift():waiting.pop()).resolve);});}
  return {acquire(){return new Promise(resolve=>{if(active<cfg.permits)grant(resolve);else waiting.push({resolve});});},stats(){return {active,waiting:waiting.length};}};
}
module.exports=semaphore;
