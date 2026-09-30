# 07. Two pointers and shrinking search intervals

Read [merge sorted arrays](../../42-merge-sorted.js), [move zeroes](../../35-move-zeroes.js), and [binary search](../../59-binary-search.js). These algorithms use small index variables, but their correctness comes from what those indices mean. An index named i is not an explanation. A sentence stating which region is already correct is the beginning of a proof.

## Merge: consume the smallest remaining candidate

For two sorted arrays, each unread suffix has its smallest value at its front. Therefore the smaller of those two front values is the smallest remaining value overall. Append it and advance only that array's pointer. The output prefix stays sorted and contains exactly the consumed input values, including duplicates. When one input is exhausted, the remaining suffix of the other can be appended unchanged because it is already sorted and cannot precede values that have already been selected incorrectly under the invariant.

The prompt forbids calling sort. That is a meaningful algorithmic constraint: the inputs already contain ordering information, and a linear merge exploits it. Concatenating and sorting can produce the right numbers while missing the required technique and doing more work. Input preservation is also natural for this output-producing function; the repository reference uses slices for the unconsumed tails instead of destructively shifting inputs.

When values tie, choosing the left input first gives a stable cross-input convention if later generalized to records. The numeric prompt primarily requires preserving duplicates and sorted order. Do not claim a rich record-stability API already exists; treat that as a transfer extension and specify its tie policy separately.

## Worked trace: merging with duplicates

Merge left values 1, 4, 4, 9 with right values 2, 4, 8. Select 1 from left, then 2 from right. The two fronts are now both 4. Under left-first ties, select the first left 4 and then the second left 4 before selecting the right 4. Next select 8, exhaust right, and append 9. The output has seven elements, including three copies of 4.

A deduplication habit borrowed from secondLargest would be wrong here. The information requirement changed. The merge must preserve the multiset of values, while secondLargest intentionally collapses duplicates for ranking. Reusing a helper without revisiting its contract can erase required data even when every individual operation appears reasonable.

## Compaction: read and write have different roles

MoveZeroes has a read position exploring the original sequence and a write position marking the next slot for a nonzero value. Before each read, the prefix before write contains exactly the nonzero values seen so far in their original order. A nonzero value is copied into that prefix and advances write. A zero advances only the read. After the scan, fill the remaining positions with zero.

The write position never gets ahead of the read position in this forward compaction. That matters because writing cannot overwrite unread values. The algorithm can therefore mutate the existing array safely with constant extra state. Its correctness argument differs from merge even though both use two pointers. In merge, each pointer consumes a separate input; in compaction, one pointer observes and the other constructs a certified prefix in the same input.

## Binary search: discard only impossible regions

Use an inclusive interval from lo through hi. The invariant says that if the target exists and has not been returned, at least one valid target position lies inside that interval. Initially it covers the whole sorted array. Compare the midpoint. If the midpoint is smaller than the target, every position through mid is too small, so set lo to mid plus one. If it is larger, every position from mid onward is too large, so set hi to mid minus one. Equality returns the midpoint.

The plus one and minus one are not arbitrary off-by-one adjustments. The midpoint has already been examined and ruled out in those branches, so keeping it would fail to shrink the interval in some one-element or two-element cases. Termination follows because every unsuccessful iteration strictly reduces the finite candidate region. The loop ends when lo exceeds hi, meaning no candidates remain.

The prompt returns an index, not specifically the first index among duplicates. A basic binary search may return any matching duplicate position. A lower-bound extension has a different invariant and result contract. Do not add a first-occurrence assertion to the original task without identifying it as an extension.

## Laboratory: trace every region

For merge, write a table with left pointer, right pointer, chosen value, and output prefix. Use the worked duplicate example and one empty input. Assert sortedness, output length equal to the sum of input lengths, and frequency preservation for every value. Together these catch both ordering mistakes and accidental loss or duplication. Snapshot the inputs as an additional nonmutation observation for your implementation.

For compaction, use zero, negative two, zero, three, negative two. Record the read and write indices after every element. The result should retain the nonzero order negative two, three, negative two, followed by two zeroes. Assert the original array identity remains the same, its length remains unchanged, and the nonzero subsequence matches the original nonzero subsequence. Checking only that all zeroes are last permits accidental reordering of the other values.

For search, trace an absent target between two neighboring values, an absent target below the minimum, an absent target above the maximum, and each endpoint. Put a step counter in your scratch implementation and reject a loop that exceeds a generous small bound on a short fixture. A timeout is a coarse failure signal; a shrinking-interval assertion explains the cause more directly.

## Debugging case: the midpoint never leaves

On an interval of two positions, a faulty search sets lo equal to mid when the midpoint is too small. If floor division chooses the lower position, lo remains unchanged. The next iteration computes the same midpoint and repeats forever. The repair is not to add an arbitrary maximum iteration count and return not found. The repair is to remove the tested midpoint from the candidate interval according to the invariant.

## Graded exercises

**C07-A:** Produce the duplicate-merge trace and verify frequency preservation. Four points require retaining all three copies of 4.

**C07-B:** Implement in-place compaction and explain why write cannot overwrite unread input. Five points require stable order, identity preservation, and the prefix invariant.

**C07-C:** Implement binary search with a per-iteration interval trace. Five points require endpoint, empty, absent-interior, and one-element cases plus a termination explanation.

**C07-D:** Design a lower-bound function returning the first insertion position that keeps order. Four points require a separate contract and examples for duplicates, absence, and insertion after the last element.

## Hints, before the review

For C07-A, sorted output alone does not prove multiplicity preservation. For C07-B, compare read and write before each assignment. For C07-D, a half-open interval is often convenient, but changing interval conventions requires changing every update consistently. Consult [the review](reviews/07-two-pointers-and-search-boundaries.md) after writing your invariants in ordinary language.
