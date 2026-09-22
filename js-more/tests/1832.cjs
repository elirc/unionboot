// 1832 Async semaphore queues / scenario 4 — permits=2; queue=lifo
// Prompt: ../prompts/1832.txt
'use strict';
const assert=require('node:assert/strict');
const cfg={"permits":2,"queue":"lifo"};
module.exports=async solve=>{
const eq=assert.equal,deep=assert.deepEqual;
function check(input,expected){const before=structuredClone(input);deep(solve(input),expected);deep(input,before,'Input must not mutate');}
const sem=solve();deep(sem.stats(),{active:0,waiting:0});const held=[];for(let i=0;i<cfg.permits;i++)held.push(await sem.acquire());deep(sem.stats(),{active:cfg.permits,waiting:0});const order=[],granted=[];const waiting=[0,1,2].map(i=>sem.acquire().then(release=>{order.push(i);granted.push(release);}));await Promise.resolve();deep(order,[]);deep(sem.stats(),{active:cfg.permits,waiting:3});held[0]();held[0]();await Promise.resolve();deep(order,[cfg.queue==='fifo'?0:2]);deep(sem.stats(),{active:cfg.permits,waiting:2});granted[0]();await Promise.resolve();granted[1]();await Promise.all(waiting);deep(order,cfg.queue==='fifo'?[0,1,2]:[2,1,0]);granted[2]();for(const release of held.slice(1))release();deep(sem.stats(),{active:0,waiting:0});deep(solve().stats(),{active:0,waiting:0});
};
