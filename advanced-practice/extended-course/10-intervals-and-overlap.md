# 10. Interval endpoints are part of the data model

Read [merge intervals](../../72-merge-intervals.js) and [peak overlap](../../73-peak-overlap.js). These neighboring exercises intentionally use different endpoint conventions. Exercise 72 represents closed ranges, includes zero-length ranges, and merges touching ranges. Exercise 73 represents half-open meetings, ignores zero-length meetings, and does not count an ending meeting as overlapping a new meeting at the same instant. Copying one comparison operator between them without revisiting the contract produces a semantic bug.

## Closed union versus simultaneous activity

A closed interval from start to end includes both endpoints. Therefore closed ranges 1 through 3 and 3 through 5 share the point 3 and merge into 1 through 5. A zero-length closed range at 4 still contains the point 4. It can be covered by another interval or remain a standalone output interval.

A half-open meeting includes its start and excludes its end. Meeting 1 through 3 is no longer active at 3, while meeting 3 through 5 begins there. Their active periods do not overlap. A meeting whose start equals end contains no active time and is ignored. Neither convention is universally better; each models a different question. The file comments explicitly choose the convention, so tests must enforce it.

Union and peak count also return different information. Merging intervals answers which regions are occupied by at least one interval. Peak overlap answers the largest number simultaneously active. Once intervals are merged into a union, their original multiplicities are lost. Computing peak overlap from the merged output cannot recover that information. Preserve the input representation appropriate to the question.

## Worked trace: merging without shrinking

Take closed intervals 1 through 8, 2 through 3, 8 through 9, and 12 through 12, supplied in an arbitrary order. Sort a copy by start. Begin output with a new pair 1 through 8. The second interval begins before the current end and is contained, so the merged end remains the maximum of 8 and 3: still 8. The touching interval beginning at 8 extends the end to 9. The point interval at 12 is separated and becomes a second output pair.

The result is 1 through 9 and 12 through 12. Replacing the current end with the incoming end without taking the maximum would shrink the first interval to 3 when processing the contained range. The later touching decision could then split a region that should be connected. A contained-interval fixture is therefore not merely another overlap example; it rejects a specific destructive update.

The output pairs must all be new, even when a source interval does not merge with anything. Sorting a shallow outer copy and then mutating one of its original inner pairs changes the caller's data. Copy the pairs you plan to extend, and test nested identity as well as values. This ownership requirement is stronger than the shallow row sharing required by exercise 68.

## Worked trace: grouped endpoint deltas

For half-open meetings 0 through 10, 5 through 15, and 10 through 20, record a positive one at every start and negative one at every end. At time zero, active becomes one. At five, it becomes two. At ten, one meeting ends and one begins, so the combined delta is zero and active stays two. At fifteen, active becomes one. At twenty, it becomes zero. Peak is two.

If starts are processed before ends at time ten and peak is updated between those events, the transient count becomes three. That number does not correspond to an actual half-open time interval. You can avoid the defect by processing ends before starts, or by combining all deltas at a timestamp and updating peak only after the group. The reference uses the grouped-delta approach.

Combining deltas does not lose a valid peak between different timestamps because active count is constant between consecutive event times. There is no need to inspect every real-number instant. The finite set of boundaries completely describes where activity can change. This is the core sweep-line insight, independent of whether the timestamps are integers, dates converted to numbers, or other ordered finite coordinates.

## Laboratory: a boundary table before implementation

Create a table containing disjoint ranges, overlapping ranges, touching ranges, one contained range, repeated identical ranges, a point range, and empty input. Give separate expected answers for closed union and half-open peak. For example, two identical nonzero meetings have peak two, while their closed union contains a single range. This row proves that deduplicating intervals before counting would be wrong.

Implement the two functions independently. Freeze the outer input and every pair. For merge output, assert sorted starts and strict separation of neighboring closed ranges: the next start must exceed the prior end because touching ranges should already have merged. Check that every output pair is a new object and that changing one output pair in a scratch test does not alter the input.

For a slow peak checker on small integer endpoints, evaluate the active count at each distinct start time using start less than or equal to time and time strictly less than end. A nonempty half-open activity region begins at some start, so these observations are sufficient for the maximum on this fixture domain. Keep zero-length intervals excluded by the membership condition. Compare with the sweep implementation across hand-selected tie cases before trying larger generated cases.

For a slow union checker, be cautious with sampling. Checking only integer points would miss gaps between fractional endpoints. Instead inspect the boundary representation directly, or restrict a sampling oracle to a precisely stated discrete domain. An oracle must model the same interval semantics as the implementation; otherwise a passing comparison can validate the wrong problem.

## Debugging case: stable sorting is not endpoint policy

A developer sorts events only by timestamp and relies on the original event insertion order to break ties. Some inputs pass because an ending event happens to be listed before a start. Reordering the input meetings changes that incidental order and creates a false peak. A stable sort preserves prior order; it does not invent the correct end-before-start policy. Explicitly encode the tie rule or group timestamps.

Another developer merges input ranges first to reduce work before counting peak. Two identical meetings become one interval and peak drops from two to one. This optimization erased multiplicity, much like using a Set for an anagram count. Recognizing the shared information-loss pattern helps diagnose the interval bug quickly.

## Graded exercises

**C10-A:** Complete the dual-semantics boundary table. Six points require distinguishing touching and zero-length behavior between the two prompts.

**C10-B:** Implement closed union with frozen nested input and fresh output pairs. Five points require a contained-range case, sorted results, and no shrinkage.

**C10-C:** Implement peak overlap with grouped deltas or an explicit event tie rule. Five points require repeated identical meetings, reordered input, and a timestamp containing both starts and ends.

**C10-D:** Design a calendar report returning both occupied regions and peak count. Four points require preserving the original intervals for each calculation and clearly labeling each output's endpoint convention.

## Hints, before the review

For C10-A, ask whether the exact endpoint belongs to each range. For C10-B, extend with a maximum. For C10-C, no intermediate ordering artifact should become a reported peak. For C10-D, a compact merged representation cannot reconstruct discarded counts. Read [the review](reviews/10-intervals-and-overlap.md) after predicting the false result from start-first ties.
