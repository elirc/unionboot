// 1891 Injected token-bucket limiter / scenario 3 — capacity=3; refill=0.5
// Prompt: ../prompts/1891.txt
'use strict';
const cfg={"capacity":3,"refill":0.5};
function tokenBucket(input) {
  let tokens=cfg.capacity,last=input.now();
  return {take(cost=1){const time=input.now();if(time<last)throw new RangeError('Time reversed');tokens=Math.min(cfg.capacity,tokens+(time-last)*cfg.refill);last=time;
    if(!Number.isFinite(cost)||cost<=0)throw new RangeError('Invalid cost');
    if(tokens<cost)return {allowed:false,tokens};tokens-=cost;return {allowed:true,tokens};
  }};
}
module.exports=tokenBucket;
