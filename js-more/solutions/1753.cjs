// 1753 Heap job dispatch / scenario 5 — direction=high; aging=4
// Prompt: ../prompts/1753.txt
'use strict';
const cfg={"direction":"high","aging":4};
// Why this works:
// A non-preemptive virtual scheduler. now is a plain number, never a real clock:
// the prompt forbids timers, and every time is derived from arrivals and
// durations. Each job is copied once with its input position as index, so the
// caller's array is never touched and the input order is still available as the
// final tie-break.
// Each round: if nothing has arrived yet, jump now forward to the earliest
// arrival. Then score the ready jobs. rank is
//   (direction === 'high' ? -priority : priority) - aging * (now - arrival)
// so lower rank means dispatched sooner. Negating priority for 'high' turns
// "largest priority first" into the same ascending comparison used by 'low'.
// The aging term subtracts a bonus that grows with how long a job has waited,
// which is why the heap has to be rebuilt every round: now changes, so the
// scores change, and a heap built last round would be ordered by stale keys.
// The heap is a real binary heap held in an array: each job is pushed and then
// sifted up while it beats its parent, which leaves the minimum at heap[0].
// heap entries are the same objects that sit in waiting, so indexOf finds the
// dispatched job and splice removes it.
function heapDispatch(input) {
  const waiting = input.map((job, index) => ({...job, index}));
  const out = [];
  let now = 0;
  while (waiting.length) {
    if (!waiting.some(job => job.arrival <= now)) {
      now = Math.min(...waiting.map(job => job.arrival));
    }
    const rank = job => (cfg.direction === 'high' ? -job.priority : job.priority) - cfg.aging * (now - job.arrival);
    const beats = (child, parent) =>
      rank(child) < rank(parent) || (rank(child) === rank(parent) && child.index < parent.index);
    const heap = [];
    for (const job of waiting.filter(candidate => candidate.arrival <= now)) {
      heap.push(job);
      let i = heap.length - 1;
      while (i > 0) {
        const parent = (i - 1) >> 1;
        if (!beats(heap[i], heap[parent])) break;
        [heap[i], heap[parent]] = [heap[parent], heap[i]];
        i = parent;
      }
    }
    const job = heap[0];
    // Heap contains the same job objects that sit in waiting, so indexOf works.
    waiting.splice(waiting.indexOf(job), 1);
    out.push({id: job.id, start: now, end: now + job.duration});
    now += job.duration;
  }
  return out;
}
module.exports=heapDispatch;
