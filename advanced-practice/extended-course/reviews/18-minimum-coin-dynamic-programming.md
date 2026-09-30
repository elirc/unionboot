# Review 18. Minimum coins

Return to [the questions](../18-minimum-coin-dynamic-programming.md). A minimum state represents one objective value, not the number of constructions achieving it.

## C18-A: the optimality table

For one, three, four, the values for amounts zero through six are 0,1,2,1,1,2,2. At six, choosing a final three extends amount three's one-coin solution and yields two coins. Largest-first chooses four and needs two ones, totaling three. This counterexample disproves the greedy rule for arbitrary denomination sets without disproving greedy algorithms under more restrictive systems.

Initialize all states unreachable except zero. For each amount ascending, consider every denomination no larger than that amount and minimize predecessor count plus one. Positive denominations ensure predecessors are smaller and already resolved. Return negative one only if the requested state's marker remains unreachable.

## C18-B: BFS as an oracle

Start at amount zero with distance zero. Enqueue unseen amounts formed by adding a denomination without exceeding the target. Every edge costs one coin, so first discovery of the target gives the minimum coin count. If the queue empties without it, the target is unreachable. Amount zero returns zero immediately.

The three denomination sets and thirteen targets produce thirty-nine primary comparisons. Repeating a denomination does not change the graph's reachable amounts or minimum distances, although careless implementations can do redundant work. This makes duplicate denominations a useful extra property check, separate from event-ID deduplication or revision identity in later capstones.

## C18-C: reconstructing one optimum

When a candidate strictly improves best[a], store the chosen final coin alongside the count. If a remains unreachable, store no invented predecessor. Starting from a reachable target, repeatedly append its chosen coin and subtract that value until zero. Every predecessor is smaller because denominations are positive, so reconstruction terminates.

On equal-cost candidates, either preserve the first choice under a documented denomination order or apply another explicit tie policy. Validate that the returned coins sum exactly to the target and their length equals the independently checked minimum. Comparing one exact list without a tie requirement can reject another valid optimum.

## C18-D: application boundaries

Reject noninteger, nonpositive denominations and noninteger or negative amounts under the proposed application contract. Distinguish those malformed requests from a valid but unreachable amount such as three with only denomination two. Also distinguish both from a valid request beyond a chosen computation limit. A resource-limit response is not a mathematical proof of impossibility.

Use a copied or read-only denomination list and an explicit bound on table size. The reference does not implement this broader input and resource policy, so include it only in your extension and its tests. Report the unit represented by amount, such as integer tokens, instead of silently assuming floating currency values are safe table indices.

## Transfer review

To count combinations instead of minimizing coins, the state meaning and often loop organization must change. To limit the supply of each denomination, transitions must also track availability or use a different update discipline. The reusable reasoning is to define the subproblem, base cases, and legal final choices. The exact minimum loop is specific to unlimited positive denominations and an exact target.
