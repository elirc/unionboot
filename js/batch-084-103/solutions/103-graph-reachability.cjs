// 103: Breadth-first reachable labels
// A directed graph is a Map<label,label[]> of string labels. Return all labels reachable from start in BFS discovery order, including start. Missing keys are leaves; duplicate edges and cycles must not duplicate results. Do not mutate graph arrays.
// Hint: Mark visited when enqueueing, not when dequeueing. Use a queue index rather than shift.
// Test starter: node js/batch-084-103/verify.cjs --starters --id=103
'use strict';
// Why this works:
// Breadth-first search where the queue doubles as the result. `queue` is the
// discovery order, and the index `i` walks along it; nothing is ever removed,
// so there is no O(n) shift per step and the finished queue is the answer.
// A label is added to `seen` at the moment it is enqueued, not when it is
// later visited. Marking on dequeue would allow the same label to be enqueued
// twice before either copy is processed, and the test relies on this twice
// over: 'a' lists ['b','c','b'] with 'b' repeated, and 'c' points back to 'a'
// to form a cycle. Both must still yield ['a','b','c','d'].
// The loop condition re-reads queue.length on every step, so labels appended
// during the loop are visited in turn. It terminates because a label can only
// be pushed once, which bounds the queue by the number of distinct labels.
// graph.get(label) ?? [] treats a key with no entry as a leaf, which is why
// solve(graph,'z') returns ['z'].
// The adjacency arrays are only iterated, never sorted or spliced, so the
// test's check that graph.get('a') is still ['b','c','b'] holds.
function reachable(graph, start) {
  const queue = [start];
  const seen = new Set(queue);
  for (let i = 0; i < queue.length; i++) {
    const neighbours = graph.get(queue[i]) ?? [];
    for (const next of neighbours) {
      if (!seen.has(next)) {
        seen.add(next);
        queue.push(next);
      }
    }
  }
  return queue;
}
module.exports = reachable;
