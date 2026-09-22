// 1890 Injected token-bucket limiter / scenario 2 — capacity=2; refill=1
// Prompt: ../prompts/1890.txt
'use strict';
const cfg={"capacity":2,"refill":1};
function tokenBucket(input) {
  let tokens=cfg.capacity,last=input.now();
  return {take(cost=1){const time=input.now();if(time<last)throw new RangeError('Time reversed');tokens=Math.min(cfg.capacity,tokens+(time-last)*cfg.refill);last=time;
    if(!Number.isFinite(cost)||cost<=0)throw new RangeError('Invalid cost');
    if(tokens<cost)return {allowed:false,tokens};tokens-=cost;return {allowed:true,tokens};
  }};
}
module.exports=tokenBucket;
