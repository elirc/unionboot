# Extended JavaScript reasoning workbook

This complete twenty-four-unit workbook is grounded in unionboot's numbered exercises, references, and verifiers. Each unit provides a worked trace, a practical lab, four graded exercises, hints, and a separate review. The sequence moves from precise value and ownership contracts through algorithms and asynchronous work to an independent change-review capstone. Course checks validate the instructional examples; your own implementation and evidence remain the learning deliverable.

## Completed teaching units

1. [Contracts and evidence](01-contracts-and-evidence.md): distinguish an implementation check from a reference check; design counterexamples for exercise 3 and mutation assertions for exercise 35.
2. [Presence and nullish boundaries](02-presence-and-nullish-boundaries.md): follow exercise 69 step by step, then expose the real string-sentinel collision in capstone 3439.
3. [Counting and grouping](03-counting-and-grouping.md): preserve multiplicity, original positions, and group order across exercises 4, 13, 16, and 25.
4. [Identity and memoization](04-identity-and-memoization.md): use exercise 27 to separate key membership, object identity, structural equality, and invalidation policy.
5. [Ordered state and callbacks](05-ordered-state-and-callbacks.md): model LRU recency and duplicate listener registrations from exercises 17 and 18.
6. [Immutability and structural sharing](06-immutability-and-structural-sharing.md): trace object graphs for exercise 23 and preserve shallow identity and stable order in exercise 68.
7. [Two pointers and search boundaries](07-two-pointers-and-search-boundaries.md): prove merge, compaction, and binary search using exercises 42, 35, and 59.
8. [Windows and best-prefix states](08-windows-and-best-prefix-states.md): derive the sufficient state for exercises 40 and 36 and compare with bounded independent oracles.
9. [Prefix and suffix products](09-prefix-and-suffix-products.md): prove exclusive scan boundaries for exercise 51, including zeroes and a bounded numerical oracle.
10. [Intervals and overlap](10-intervals-and-overlap.md): distinguish closed union from half-open peak activity in exercises 72 and 73.
11. [Linked structures and queues](11-linked-structures-and-queues.md): reason about reachability, occupancy, and amortized operations in exercises 57 and 79.
12. [Tree traversal and BST order](12-tree-traversal-and-bst-order.md): derive structural recursion and inherited ordering bounds for exercises 28 and 58.
13. [Breadth-first word ladders](13-breadth-first-word-ladders.md): prove shortest word counts and investigate the exact neighbor-generation policy in exercise 33.
14. [Deterministic topological order](14-deterministic-topological-order.md): enforce duplicate-safe degree accounting and the smallest-ready rule in exercise 81.
15. [Subsets and permutations](15-subsets-and-permutations.md): preserve decision state, output ownership, and distinct enumeration contracts in exercises 44 and 45.
16. [Recurrences, memoization, and stairs](16-recurrences-memoization-and-stairs.md): distinguish cold and warm measurements and derive rolling state for exercises 49 and 53.
17. [Grid dynamic programming](17-grid-dynamic-programming.md): derive final-move counting and rolling-row dependencies from exercise 52.
18. [Minimum-coin dynamic programming](18-minimum-coin-dynamic-programming.md): prove minimum states and compare them with a bounded BFS oracle for exercise 54.
19. [Path representations and conflicts](19-path-representations-and-conflicts.md): preserve empty-object leaves and reject order-dependent declarations in exercises 70 and 71.
20. [Asynchronous composition and failure](20-asynchronous-composition-and-failure.md): distinguish result order, concurrency limits, recovery, timeout, and abort across exercises 60-65 and 83.
21. [Three-way merge decisions](21-three-way-merge-as-a-decision-system.md): prove per-key composition and policy asymmetry for capstone 3439.
22. [Ordered idempotent event replay](22-ordered-idempotent-event-replay.md): validate identity, revision continuity, and intermediate balances for capstone 3440.
23. [JSON Pointer diff and ownership](23-json-pointer-diff-and-ownership.md): encode paths, preserve deterministic operation shape, and prove nested independence for capstone 3441.
24. [Offline change-review capstone](24-offline-change-review-capstone.md): build and defend an independent work sample that composes the three domain contracts.

Read a chapter before its review. Record your prediction, independent implementation location, exact command, observed result, and the smallest rejected mutation. Award the published points only for evidence you can reproduce. A correct explanation copied from a review is useful study material but does not establish independent performance.

## Workspace and commands

Run commands from the unionboot repository root. Keep personal attempts in your own scratch directory; none of the course commands overwrites numbered starters. Early starter files often print examples without asserting them, and several repository verifiers evaluate references rather than the learner's function. Chapter 1 explains how to prove that a check reaches the intended implementation.

Run `node --test advanced-practice/extended-course/reference-traces.test.cjs` to check the published worked examples against the existing reference functions. The bounded oracles cover 364 short ASCII strings and 363 nonempty short numeric arrays. This command uses only Node built-ins and existing local files, writes no verification report, and does not install packages. It checks course/reference consistency; it does not grade your personal solutions or establish application readiness.

Run `node --test advanced-practice/extended-course/reference-structures.test.cjs` for the structures and algorithms units. It checks products, interval boundaries, linked structures, trees, graph ordering, enumeration, and recurrence traces using existing references. Bounded comparisons include 360 product arrays, 100 ordered interval pairs, and 64 small DAGs. It has the same read-only, reference-consistency scope as the first command.

Run `node --test advanced-practice/extended-course/reference-capstones.test.cjs` for grid and coin oracles, path reconstruction, controlled asynchronous failures, and all three capstone references. It includes 25 grid comparisons, 39 primary coin cases, and direct invocation of the existing capstone assertions without their report-writing verifier. To check the complete workbook, pass all three named test files to one `node --test` command.

The chapter reviews give complete reasoning and algorithm strategies separately from hints. They deliberately explain where a prompt leaves behavior unspecified, such as cache capacity validation or event-listener mutation during dispatch. Extensions must state their own contracts instead of silently rewriting the baseline exercise.

## Study routes and completion evidence

Start with units 1-6 if function contracts, own-property presence, identity, and immutable updates are not yet comfortable. Before attempting the sequence and structure units, you should be able to explain a failed assertion, draw a reference graph, and write a bounded independent checker. Units 7-16 build algorithmic invariants; units 17-20 combine dependency reasoning with compressed state and asynchronous scheduling; units 21-24 apply those habits to precise domain contracts.

An experienced learner can use the graded exercises as a placement check, then read only the explanations needed to repair gaps. Keep the separate review closed until an attempt and a prediction exist. Revisit a changed fixture after a delay to distinguish independent reconstruction from immediate recognition. The final capstone rubric asks for actual commands, observed results, and candid limits rather than a completion checkbox based on reference output.

The workbook contains all twenty-four planned units and their reviews. It exceeds the requested 37,000 new prose words under the shared count method excluding fenced code. No production app, durable service, or completed learner answer is implied by that instructional completion.

Return to the [original six-chapter practice pack](../README.md) for the shorter placement route and the existing isolated merge-boundary lab.
