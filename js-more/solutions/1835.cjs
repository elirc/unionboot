// 1835 Async semaphore queues / scenario 7 — permits=4; queue=fifo
// Prompt: ../prompts/1835.txt
'use strict';
const cfg={"permits":4,"queue":"fifo"};
// Why this works:
// A counting semaphore with no timers and no polling. active is how many permits
// are out; waiting is the queue of acquisitions that have not been granted yet,
// each stored as {resolve} -- the resolve function of the Promise that acquire()
// handed back, parked until a permit frees up.
// grant(resolve) takes a permit and settles that promise with the release
// function. release is idempotent through the released flag: calling it twice
// must not return the permit twice.
// The critical line is the hand-off. When a permit is released and someone is
// waiting, grant() is called on that waiter's resolve immediately, inside the
// release call. The permit passes directly from holder to waiter, so a later
// acquire() cannot slip in front, and active never dips below the number of
// permits that are actually in use. cfg.queue picks the waiter: shift for fifo,
// pop for lifo.
// Nothing here schedules anything. Resolving a promise queues the waiter's
// continuation as a microtask, so the observable order is fixed by where resolve
// is called, and the tests assert it by stepping with await Promise.resolve().
// acquire() resolves synchronously inside the executor when a permit is free,
// which is why the first cfg.permits acquisitions settle on the first microtask
// turn.
function semaphore() {
  let active = 0;
  const waiting = [];
  function grant(resolve) {
    active++;
    let released = false;
    resolve(() => {
      if (released) return;
      released = true;
      active--;
      if (waiting.length) {
        const next = cfg.queue === 'fifo' ? waiting.shift() : waiting.pop();
        grant(next.resolve);
      }
    });
  }
  return {
    acquire() {
      return new Promise(resolve => {
        if (active < cfg.permits) grant(resolve);
        else waiting.push({resolve});
      });
    },
    stats() {
      return {active, waiting: waiting.length};
    },
  };
}
module.exports=semaphore;
