# Review 07. Two pointers and search boundaries

Return to [the questions](../07-two-pointers-and-search-boundaries.md). An answer earns full credit when the index meanings explain both correctness and termination.

## C07-A: merged sequence

The merged output is 1, 2, 4, 4, 4, 8, 9. At every selection, the chosen front is no larger than the other unread front. Because each input is already sorted, no later value in either unread suffix can be smaller than both fronts. Appending the smaller front therefore preserves the sorted output invariant.

Each step consumes exactly one input element and appends exactly one output element. Appending the unconsumed tail preserves this one-to-one accounting. The output length and frequency checks expose accidental deduplication or double consumption. Sortedness alone would permit a shorter sorted array missing values, so it is not a complete correctness check.

## C07-B: compaction

Initialize write to zero and scan every original position from left to right. Whenever the current value is nonzero, store it at write and increment write. At the end, fill positions from write through the final index with zero. The number of writes into the nonzero prefix equals the number of nonzero values observed, so write never exceeds the next unread position. No assignment destroys a value that still needs to be read.

For zero, negative two, zero, three, negative two, the nonzero prefix grows to negative two, then negative two and three, then negative two, three, negative two. Filling the tail produces those three values followed by two zeroes. The original array identity and length remain unchanged. The contract deliberately requires mutation here, unlike the reducer and merge-output exercises.

## C07-C: inclusive binary search

Start lo at zero and hi at length minus one. While lo is at most hi, compute an integer midpoint. Return it on equality. If the midpoint value is smaller, assign lo to mid plus one. Otherwise assign hi to mid minus one. Empty input begins with hi negative one, so the loop does not run and returns negative one.

The invariant keeps every possible remaining match inside the interval. The progress measure is the interval's size, which strictly decreases after every unsuccessful comparison. Updating a boundary to mid without excluding it can violate progress. A step cap may stop a hang during testing, but it does not repair the algorithm's reasoning.

## C07-D: lower bound

A useful lower-bound contract returns the first index whose value is at least the target, or the array length if no such value exists. Use a half-open interval from lo inclusive to hi exclusive, initially zero to length. If the midpoint value is smaller than target, move lo to mid plus one. Otherwise move hi to mid. When lo equals hi, that boundary is the answer.

Here retaining mid in the upper region is correct because mid may be the first qualifying position; the half-open interval still shrinks. This differs from the equality-returning inclusive search. Mixing the update rules from the two conventions is a common source of defects. For values 1, 3, 3, 7, lower bound of 3 is one, of 4 is three, and of 8 is four.

## Follow-up challenge

Generalize merge to records sorted by timestamp and define left-first ties. Tag records with their source and original index. Test that each input's internal order is preserved and that equal timestamps follow the explicit cross-source rule. This demonstrates how a numeric algorithm can become a stable data-processing operation only after its comparison and ownership contracts are made explicit.
