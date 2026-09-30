# Review 14. Deterministic dependency order

Return to [the questions](../14-deterministic-topological-order.md). Keep edge validity, cycle detection, and tie-policy compliance as distinct checks.

## C14-A: a newly ready smaller node

With nodes a, b, c and edge a to b, the initial ready set contains a and c. Emit a. B now becomes ready, making the ready set b and c. The required next node is b, so the final order is a, b, c. Order a, c, b respects the edge but fails the smallest-ready rule. Sorting only the initial queue is insufficient.

A priority queue or a re-sorted small array can maintain this rule. The reference chooses the latter. The tie policy compares IDs in code-unit order, so replacing its comparison with locale-aware collation changes the required deterministic output for some names.

## C14-B: consistent edge accounting

Initialize one adjacency Set and zero in-degree for every node. For each input edge, add the neighbor and increment its degree only if that neighbor was not already in the Set. Initially ready nodes have zero degree. Repeatedly remove the smallest ready node, append it to output, and decrement each distinct outgoing neighbor. Add a neighbor to the ready collection when its degree reaches zero.

If output length differs from node count after the ready collection empties, throw an Error containing cycle. A self-loop prevents its node from becoming ready. A two-node cycle blocks both. A disconnected cycle still leaves the total output incomplete even if isolated nodes were emitted successfully. Do not return that partial output under the original contract.

For duplicate a-to-b edges, a's Set has one neighbor and b's degree is one. One emission satisfies that dependency. Counting two incoming edges but decrementing only once produces a false cycle. Deduplication must occur before both representations diverge.

## C14-C: independent validation layers

A valid result must contain each known node exactly once. Build a position Map, reject duplicates and unknown IDs, then ensure every input edge points from a smaller position to a larger one. Duplicate edges are harmless repeated assertions here. This checker accepts every valid topological order, including ones that fail the required deterministic tie rule.

For a tiny graph, enumerate all node permutations, retain those satisfying the edge checker, and choose the lexicographically smallest sequence with the specified string comparison. Compare the candidate to that minimum. Keep the node count small because factorial enumeration grows rapidly. If no valid permutation exists, the graph is cyclic, providing a bounded independent cycle oracle.

The minimum-order argument follows the first differing position. At that point, both candidate prefixes have emitted the same nodes. A smaller valid next node in another order would have no remaining prerequisite and thus would have been ready. Choosing the smallest ready node rules that out. This is why the local tie policy produces the global lexicographic minimum.

## C14-D: a different diagnostic API

A partial-progress report might return emitted order, unprocessed nodes, and a blocked flag. It should not call every unprocessed node a cycle member. A node downstream of a cycle can remain blocked without lying on any cycle itself. To identify actual cycle members or a concrete cycle path, add an appropriate graph analysis rather than guessing from nonzero remaining degree.

The baseline exercise throws instead of returning this richer report. Keep the new interface separate so callers do not mistake incomplete work for a valid complete installation order. Tests should include an isolated ready node, a cycle, and a downstream dependent to demonstrate all three categories.

## Transfer review

A real package installer also needs failure handling after a dependency begins or finishes. Topological order only establishes a valid prerequisite sequence for a static graph. It does not prove that installation actions succeed, roll back, or remain idempotent on retry. Preserve this boundary when integrating the algorithm into a workflow: ordering is one component of execution correctness, not the whole system.
