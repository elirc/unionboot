# 15. Exhaustive search with explicit choices and ownership

Read [power set](../../44-power-set.js), [permutations](../../45-permutations.js), their functions in [sequence references](../../solutions/round2-39-50.cjs), and the corresponding assertions in [the verifier](../../verify-39-50.cjs). Both tasks enumerate possibilities, but one chooses membership while the other chooses order. Their output sizes grow differently, and their base cases explain why empty input still has one valid result.

## A subset is a membership decision

Exercise 44 receives distinct numbers. For each input position, a subset either includes that value or excludes it. With n independent binary choices, there are two to the power n subsets. The empty subset and full subset are both included. The order inside each subset must follow the input order, while the collection of subsets may appear in any order.

An iterative construction begins with one subset, the empty array. For each new value, keep every existing subset and create a new subset formed by appending the value to it. These are the cases that exclude or include the new value. The count doubles at each step, and all subsets remain ordered according to input positions.

A recursive construction makes the same include/exclude decision at each position. The important invariant is that a partial path contains exactly the selected values from already-considered positions in their original order. Sorting each finished subset would be unnecessary and could violate the input-order requirement for an input that is not numerically sorted.

## A permutation is an order of positions

For n distinct elements, a permutation chooses one of n elements first, one of the remaining n minus one next, and so on. The total count is n factorial. Each result has the same length and elements as the input, but their order differs. Choosing subsets and then sorting them cannot generate permutations because sorting intentionally removes ordering differences.

The starter demonstrates distinct values but does not state a full duplicate-value policy. The supplied reference chooses positions recursively. On repeated equal values, different positional choices can produce equal-looking output arrays. If you need unique value permutations, specify that extension and add a duplicate-suppression strategy. Do not assume factorial distinct outputs for repeated values or silently deduplicate without documenting the change.

The empty array has one permutation: the empty ordering. It also has one subset: the empty set. Returning no results for empty input breaks the recursive composition. A parent branch prepending its selected value to each result from an empty remainder needs one empty result so it can produce one completed ordering. This is an algebraic identity for enumeration, not a special sample to memorize.

## Worked trace: subsets preserve input order

Use input 3, 1. Start with the empty subset. After processing 3, the results are empty and 3. After processing 1, keep those two and append 1 to a copy of each, producing 1 and 3, 1. The full subset is 3, 1 because that is the input order; 1, 3 is not the required representation of that subset under this prompt.

For three values p, q, r in a separate permutation example, choosing p first leaves q, r with orderings q-r and r-q. Choosing q first leaves p, r. Choosing r first leaves p, q. The six results cover each possible first choice and each ordering of the remainder exactly once for distinct inputs. Draw the decision tree and label each leaf with the finished output, rather than drawing only recursive function calls without their decisions.

## Backtracking needs a restoration invariant

A mutable-path implementation pushes a choice, recurses, then pops it. On return from a branch, the path and used markers must equal their state before that choice. Otherwise the next sibling branch begins with stale decisions and produces missing or repeated elements. This restoration condition is the central backtracking invariant.

At a completed path, append a copy to results. Appending the same mutable path array repeatedly makes all result entries alias the working buffer. After later pops, the outputs can all become empty or reflect the final branch. Correct values at the moment of append do not imply durable output values. This is the same ownership issue encountered in reducer history, now inside an enumeration algorithm.

The supplied permutation reference instead creates new remainder arrays and new output arrays recursively. That avoids explicit push/pop restoration at the cost of allocation. Both styles can satisfy the contract. Compare clarity, allocation, and mutation risk without treating one implementation pattern as the only valid solution.

## Output size limits the achievable complexity

Materializing every subset of n distinct elements already requires exponentially many result arrays. Across all subsets, each element appears in half of them, so the number of stored element occurrences grows on the order of n times two to the power n. Materializing all permutations stores n elements in each of n factorial arrays. No clever loop can return that complete explicit output in constant or polynomial time for unbounded n.

This lower-bound reasoning prevents misleading optimization claims. A generator can reduce peak memory by yielding results incrementally, but consuming every result still requires visiting the enormous output space. A consumer that stops after a few results performs less work because it requested less of the space, not because factorial enumeration became linear.

Keep laboratory bounds small. Three or four distinct values are enough to expose restoration and aliasing bugs. A large factorial run is not a meaningful proof of correctness and can needlessly exhaust memory. Predict output count before choosing the test size.

## Laboratory: properties stronger than length

For subsets, assert the total count, absence of duplicate represented subsets, membership only from the input, and preservation of input order within each result. Include empty input, one element, and an unsorted distinct input such as 3, 1, 2. A function returning repeated empty arrays can match the expected count while failing every semantic property, so count alone is insufficient.

For permutations of distinct values, assert each result has input length, each input value appears exactly once, and no two outputs are equal in sequence. Then assert factorial result count. Freeze the input array to detect accidental swaps left unrecovered. Mutate one returned result in a scratch check and ensure other result arrays and the input remain unchanged at the outer-array level. The exercises do not promise deep cloning of arbitrary object elements, so keep the ownership claim scoped.

Build a second small checker using index permutations or a different construction style from your candidate. Canonicalize each output only for comparison of the outer result collection; do not sort the values inside each permutation, which would erase exactly the distinction being tested. For subsets, a bitmask can be a useful independent oracle within small integer bit-width bounds.

## Debugging case: one branch forgets to unchoose

A scratch backtracker marks position zero used, explores a complete branch, then forgets to reset that marker. Later branches cannot use the first value, so they disappear or become incomplete. A trace of used markers before and after recursion exposes the first violated restoration invariant. Adding a final sort or deduplication cannot repair missing valid branches.

## Graded exercises

**C15-A:** Derive the four subsets of 3, 1 and explain the empty base case. Four points require preserving input order.

**C15-B:** Implement both copying and mutable-path permutation strategies for distinct small inputs. Five points require identical result sets and correct path restoration.

**C15-C:** Build the semantic property checks above and reject a same-buffer aliasing mutation. Five points require more than a result-length assertion.

**C15-D:** Design a lazy enumeration extension and a separate unique-duplicate-values policy. Four points require explaining which costs decrease and which output-size costs remain unavoidable.

## Hints, before the review

For C15-B, write the branch-entry state beside the branch-exit state. For C15-C, compare ordered tuples, not sorted element bags. For C15-D, distinct positions and distinct values are different equivalence relations. Read [the review](reviews/15-subsets-and-permutations.md) after predicting every leaf in a three-element decision tree.
