// 103: Breadth-first reachable labels
// A directed graph is a Map<label,label[]> of string labels. Return all labels reachable from start in BFS discovery order, including start. Missing keys are leaves; duplicate edges and cycles must not duplicate results. Do not mutate graph arrays.
// Hint: Mark visited when enqueueing, not when dequeueing. Use a queue index rather than shift.
// Test starter: node js/batch-084-103/verify.cjs --starters --id=103
'use strict';
function reachable(graph,start) {
  const queue=[start],seen=new Set(queue);
  for(let i=0;i<queue.length;i++)for(const next of graph.get(queue[i])??[]){if(!seen.has(next)){seen.add(next);queue.push(next);}}
  return queue;
}
module.exports = reachable;
