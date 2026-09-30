# Review 15. Enumeration and backtracking

Return to [the questions](../15-subsets-and-permutations.md). Count, content, order, and ownership are separate properties of an enumeration result.

## C15-A: subset construction

For input 3, 1, the subsets are empty, 3, 1, and 3 followed by 1. The outer collection may appear in any order, but the full subset must preserve input order. Starting with one empty subset allows the first input value to create one included subset while retaining one excluded subset. Starting with no subsets gives nothing to extend and loses every result.

A complete iterative strategy maintains all subsets of the processed prefix. For each new value, create one appended copy for every existing subset, then combine the old and new collections. Old subsets exclude the value; new ones include it. The classes are disjoint and cover every choice, establishing both completeness and lack of duplicates for distinct input values.

## C15-B: two complete permutation strategies

The copying strategy chooses each input position as the first value, recursively permutes a newly formed remainder without that position, then prepends the chosen value to each returned ordering. Empty remainder returns one empty ordering. This is close to the supplied reference and avoids modifying the input or a shared working path.

The mutable-path strategy maintains a path and used-position flags. At each level, choose an unused position, mark it, append its value, recurse, then pop and unmark. When the path length equals input length, append a shallow copy of the path to output. Restoring both path and flags after each branch ensures sibling branches begin from the same prior decision state.

For distinct values, both strategies should produce the same set of ordered tuples. Their outer result order can differ without violating the prompt. Compare canonicalized representations of whole tuples, not sorted contents within each tuple. Sorting each permutation's values would make every permutation look the same.

## C15-C: semantic checks and aliasing

For subsets, verify every member comes from the input, appears at most once, and follows input position order. Verify the expected count and distinctness of represented subsets. For permutations of distinct input values, verify length, exactly one occurrence of each input value, uniqueness of ordered outputs, and factorial count. These combined properties reject repeated or malformed arrays that happen to meet a length assertion.

To expose shared-buffer aliasing, inspect the outputs after recursion completes, then mutate one output array in a scratch test and check that other output arrays remain unchanged. A broken implementation that stores the same path reference repeatedly often produces many empty arrays after backtracking unwinds. The bug concerns the result arrays themselves; neither prompt promises deep cloning of arbitrary nested object elements.

A missing unmark operation can eliminate later branches. A missing pop can contaminate their paths. Both violate branch restoration but produce different symptoms. Log state at entry and exit of each branch to identify the first mismatch rather than adding final cleanup that hides the local error.

## C15-D: lazy and duplicate-aware extensions

A generator can yield a copy of each completed path and avoid retaining the full result collection internally. If the caller collects every yield, total output storage still appears at the caller. If the caller stops early, less of the search space is explored. The worst-case cost of producing every explicit permutation remains tied to factorial output size.

For repeated values, unique-value permutations need to avoid choosing equivalent values for the same position more than once. One approach sorts a copied input and skips equal unused choices according to a carefully stated rule; another uses a value-count map and decrements counts during construction. These are different from the reference's positional recursion, which can produce equal-looking arrays from distinct equal-valued positions.

Define value equality for that extension before selecting a map key policy. Primitive values, object identities, and structurally equal objects can require different choices, just as they did in the memoization chapter. Do not add JSON serialization as an unexamined universal equality relation.

## Transfer review

Generating candidate schedules can use permutation search only at small sizes or with meaningful pruning. A pruning condition must prove that no completion of the current partial path can be valid or competitive. Rejecting a branch merely because it looks unpromising can remove the optimal answer. Separate complete enumeration, correctness-preserving pruning, and heuristic search in your report. Their guarantees differ even when their code shares the same choose-recurse-unchoose skeleton.
