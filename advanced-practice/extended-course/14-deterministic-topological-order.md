# 14. Dependency order, duplicate edges, and cycles

Read [topological sort](../../81-topo-sort.js), the topoSort implementation in [later references](../../solutions/missing-refs.cjs), and its extra checks in [verify-missing](../../verify-missing.cjs). This task asks for a deterministic order respecting directed dependencies. It does not ask for a shortest path. A ready node has no remaining prerequisites, which is a different condition from a vertex being close to a starting point.

## Read edge direction aloud

An edge before, after means before must appear earlier in the result. Write that sentence beside a fixture before calculating degrees. The in-degree of a node counts distinct unresolved incoming dependencies. A node with zero in-degree is ready. Emitting it satisfies its outgoing prerequisites, so each dependent node's in-degree decreases accordingly.

The prompt allows duplicate edges. Repeating the same dependency does not create an additional semantic prerequisite. The reference stores each outgoing neighbor in a Set and increments in-degree only when a new edge is added. If you deduplicate adjacency but increment degree for every duplicate input pair, the later decrement happens too few times and a valid node can remain permanently blocked. Representation and counting must use the same edge multiplicity policy.

All edge endpoints are guaranteed to be known node IDs, and nodes are unique strings. This exercise focuses on ordering rather than validating those input constraints. Cycles, however, must be detected and throw an Error whose message includes cycle. A self-loop is a cycle and must not disappear during deduplication.

## Worked trace: readiness changes the tie choice

Use nodes a, b, c, d, e and edges a to d, b to c, c to d, and d to e. Initially a and b are ready. The code-unit smallest is a, so emit it. D still depends on c. Emit b next, which makes c ready. Emit c, then d, then e. The result is a, b, c, d, e.

Now use nodes a, b, c with the single edge a to b. Initially a and c are ready. Emit a, which makes b ready. The next choice must be b because b is now the smallest ready ID, even though c was already waiting. The required result is a, b, c. A FIFO ready queue initialized in sorted order can instead produce a, c, b. That is a valid topological order but violates this exercise's deterministic smallest-ready rule.

The tie requirement applies after every change in readiness, not only once at initialization. The reference sorts the ready list whenever a node becomes ready. For small inputs, this is straightforward. A priority queue is a possible extension for larger graphs, but the specification should not be weakened to fit whichever worklist is easiest.

## Why emitting a ready node is safe

A zero in-degree node has no unsatisfied incoming edge among unprocessed nodes. Placing it next cannot violate a prerequisite. Removing its outgoing edges updates exactly the dependencies that its emission satisfies. Repeating this process produces an order in which every edge points forward.

If nodes remain but no node is ready, every remaining node has at least one incoming dependency from the remaining subgraph. Following such dependencies in a finite set eventually revisits a node, revealing a cycle. Therefore emitting fewer nodes than the supplied node count establishes that a cycle prevented completion. The reference checks the final output length against the total nodes and throws rather than returning a misleading partial order.

A disconnected cyclic component still invalidates the complete ordering. A graph can emit several independent nodes successfully and then become stuck. Those early successes do not justify returning the partial list as though all packages can be installed. If an application wants a partial progress report plus cycle diagnostics, that is a different result contract from this exercise's throw-on-cycle behavior.

## Determinism is stronger than validity

A result validator can check that every node occurs exactly once and every edge's before position is smaller than its after position. Those properties establish topological validity. They do not establish the smallest-ready tie rule. To check determinism independently on small graphs, enumerate all valid orders and select the lexicographically smallest sequence under the same code-unit comparison. Compare that sequence with the candidate result.

For a valid DAG, repeatedly choosing the smallest available node produces the lexicographically smallest valid order: any smaller first differing choice in another purported valid order would have needed to be ready at that step, contradicting the chosen minimum. This reasoning connects the local selection policy to a global deterministic result. Keep the alphabet comparison exact; locale-aware ordering would implement a different rule.

The reference's repeated array sorting and shifting adds overhead beyond the textbook linear graph traversal with an unconstrained ready queue. Do not call that exact implementation linear solely because Kahn's algorithm is often presented that way. The dependency bookkeeping is linear in unique edges and nodes under standard collection assumptions; maintaining the specified ordered frontier has its own cost.

## Laboratory: valid orders and smallest valid orders

Build a position-map validator for returned orders. Reject missing nodes, duplicate nodes, unknown nodes, and backward edges. Use a DAG with multiple valid orders so your validator can accept more than one. Then add a separate tie-policy checker for tiny graphs by enumerating permutations and selecting the smallest valid sequence. This separation shows which assertion detects an ordering mistake and which detects nondeterminism.

Include duplicate copies of one edge, a self-loop, a two-node cycle, a disconnected cycle beside an isolated node, and empty input. The duplicate-edge case should produce the same result as the deduplicated graph. Each cycle should throw with cycle in the message. Empty input has an empty valid order. Freeze node and edge arrays to catch sorting or mutation of caller data.

For your independent implementation, log degree changes. Every decrement should correspond to a distinct stored edge being satisfied. Assert degrees never become negative. A mismatch between adjacency multiplicity and degree construction often appears as a negative degree or a node never reaching zero. The log can expose the bookkeeping defect before the final cycle check misclassifies it.

## Debugging case: a false cycle from a repeated dependency

Take nodes a and b with two identical edges a to b. A broken setup counts b's in-degree as two but stores only one outgoing neighbor from a. Emitting a decrements b to one. The ready list empties and the implementation reports a cycle even though the graph is acyclic. The error message describes the symptom, not the cause. Compare unique edge count and degree construction before changing cycle detection.

## Graded exercises

**C14-A:** Trace the smallest-ready example a to b with isolated c. Four points require explaining why a, c, b is valid yet unacceptable here.

**C14-B:** Implement duplicate-safe degree bookkeeping and reject all three cycle fixtures. Five points require a self-loop and a disconnected cyclic component.

**C14-C:** Build separate validity and lexicographic-minimum checkers for small DAGs. Five points require a fixture with multiple valid orders and the correct code-unit comparison.

**C14-D:** Design a dependency report that returns partial progress and a diagnostic when blocked. Four points require clearly separating that new interface from the baseline throw-on-cycle contract.

## Hints, before the review

For C14-B, deduplicate before incrementing degree, or use a fully consistent multiplicity scheme. For C14-C, keep permutation enumeration bounded. For C14-D, an unprocessed node is not necessarily itself on a cycle; it may only depend on one. Read [the review](reviews/14-deterministic-topological-order.md) after writing the edge-direction sentence beside each fixture.
