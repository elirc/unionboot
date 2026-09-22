// 1893 Injected token-bucket limiter / scenario 5 — capacity=4; refill=0.5
// Prompt: ../prompts/1893.txt
'use strict';
const cfg={"capacity":4,"refill":0.5};
// Why this works:
// The bucket keeps two numbers in a closure: how many tokens it holds and the
// virtual time it last settled at. There is no timer and no clock of its own -
// time only ever arrives through the injected input.now(), which the prompt
// requires and only a source review can check.
// Every take() does the same four things in this order: read the clock, reject
// time that went backwards, refill for the elapsed span and cap at capacity,
// then validate the cost and spend it. Refilling before validating the cost is
// deliberate: a rejected call still leaves the bucket settled at the new time.
// A denial returns the balance untouched, so allowed:false and the current
// token count are reported together.
// Policy capacity=cfg.capacity is both the starting balance and the cap;
// policy refill=cfg.refill is how many tokens one unit of virtual time earns.
function tokenBucket(input) {
  let tokens = cfg.capacity;
  let last = input.now();
  return {
    take(cost = 1) {
      const time = input.now();
      if (time < last) {
        throw new RangeError('Time reversed');
      }
      tokens = Math.min(cfg.capacity, tokens + (time - last) * cfg.refill);
      last = time;
      if (!Number.isFinite(cost) || cost <= 0) {
        throw new RangeError('Invalid cost');
      }
      if (tokens < cost) {
        return { allowed: false, tokens };
      }
      tokens -= cost;
      return { allowed: true, tokens };
    }
  };
}
module.exports=tokenBucket;
