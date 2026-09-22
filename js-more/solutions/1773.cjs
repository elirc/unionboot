// 1773 Dijkstra route policies / scenario 5 — toll=2; tie=lexical
// Prompt: ../prompts/1773.txt
'use strict';
const cfg={"toll":2,"tie":"lexical"};
// Why this works:
// Dijkstra's algorithm: repeatedly settle the unsettled node with the smallest
// known cost, then relax every edge leaving it. dist and paths are Maps keyed by
// node label, done is the settled set. The `available` list rebuilt at the top of
// each round is the priority queue: it holds exactly the reachable, unsettled
// nodes, ordered by cost, so available[0] is the queue's minimum. When it is
// empty every reachable node has been settled and the loop stops.
// Settling the cheapest node first is what makes the algorithm correct, and it is
// why the edge weights must be strictly positive: a later, more expensive route
// can never improve a node that has already been settled.
// Each edge costs weight + cfg.toll, so the toll is a per-hop surcharge that
// makes longer paths lose to shorter ones as it grows.
// compare() is the tie-break between two equal-cost routes. cfg.tie 'fewest'
// prefers the route with fewer nodes and only then compares the JSON form;
// 'lexical' compares the JSON form directly.
// Nothing is written back into input: routes are rebuilt with [...paths.get(u), to],
// and the result is a fresh array in input.nodes order, with cost null and path []
// for anything never reached.
function dijkstra(input) {
  const dist = new Map(input.nodes.map(node => [node, Infinity]));
  dist.set(input.start, 0);
  const paths = new Map([[input.start, [input.start]]]);
  const done = new Set();
  const compare = (left, right) => {
    if (cfg.tie === 'fewest' && left.length !== right.length) return left.length - right.length;
    const leftJson = JSON.stringify(left);
    const rightJson = JSON.stringify(right);
    return leftJson < rightJson ? -1 : leftJson > rightJson ? 1 : 0;
  };
  while (true) {
    const available = input.nodes.filter(node => !done.has(node) && dist.get(node) !== Infinity);
    available.sort((left, right) =>
      dist.get(left) - dist.get(right) || compare(paths.get(left), paths.get(right)));
    if (!available.length) break;
    const settled = available[0];
    done.add(settled);
    for (const [from, to, weight] of input.edges) {
      if (from !== settled) continue;
      const candidate = dist.get(settled) + weight + cfg.toll;
      const route = [...paths.get(settled), to];
      const improves = candidate < dist.get(to);
      const tiesButSorts = candidate === dist.get(to) && compare(route, paths.get(to)) < 0;
      if (improves || tiesButSorts) {
        dist.set(to, candidate);
        paths.set(to, route);
      }
    }
  }
  return input.nodes.map(node => ({
    node,
    cost: dist.get(node) === Infinity ? null : dist.get(node),
    path: paths.get(node) || [],
  }));
}
module.exports=dijkstra;
