# Review 10. Intervals and overlap

Return to [the questions](../10-intervals-and-overlap.md). The endpoint convention belongs in every expected result, not only in the introduction.

## C10-A: distinguishing rows

Closed ranges 1 through 3 and 3 through 5 merge into 1 through 5. The corresponding half-open meetings have peak one because the first has ended when the second begins. A closed point range 4 through 4 remains a point if not covered by another range, whereas a half-open meeting with those endpoints contributes no activity. Repeated identical nonzero intervals merge to one union range but contribute their full multiplicity to peak count.

For empty input, union is an empty array and peak is zero. A contained interval does not extend the union but can increase activity count inside the container. Disjoint intervals remain separate union ranges and have peak one if each has nonzero duration. These rows distinguish union geometry from simultaneous multiplicity.

## C10-B: a complete merge strategy

Clone every input pair into working storage and sort the copied pairs by start. For each pair, inspect the last output pair. If there is none, append a new pair. If the incoming start is at most the last end, update the last end to the maximum of the two ends. Otherwise append a new pair. Because starts are sorted, only the last output interval can overlap the next incoming interval; earlier outputs are already separated from it.

Taking the maximum prevents a contained interval from shrinking its container. Using at most rather than strictly less merges touching closed ranges. New output pairs preserve the explicit ownership contract. A test should verify that even an isolated interval's output pair is not the original pair, because a no-overlap input can otherwise conceal aliasing.

For the worked set, output is 1 through 9 followed by 12 through 12. Changing the first output end after the call must not change any input pair. This is a useful direct aliasing test in scratch, separate from freezing inputs during the call.

## C10-C: a complete peak strategy

Ignore zero-length meetings. Accumulate positive one at each start and negative one at each end in a Map keyed by timestamp. Sort the distinct timestamps numerically. Starting from active zero and peak zero, add the entire delta at a timestamp, then compare active with peak. This treats all starts and ends at one boundary as one transition to the next half-open region.

An equivalent event-list implementation processes ending events before starting events at equal timestamps. Either design avoids a fabricated start-before-end peak. If you use individual events, encode the tie rule explicitly. Sorting only by time and trusting input order is not enough.

For 0 through 10, 5 through 15, and 10 through 20, active counts after the distinct boundaries are one, two, two, one, zero. Peak is two. Reversing input order leaves the result unchanged. Two identical 1-through-2 meetings have peak two; deduplicating them changes the problem and is incorrect.

## C10-D: two outputs from one source

A report can compute closed occupied regions and half-open peak count from the original interval list, clearly labeling the two conventions. If the application actually needs both outputs under one shared convention, redesign one calculation accordingly and state that this differs from the paired exercise contracts. Do not silently mix interpretations in a user-facing calendar.

Keep the original intervals available for the peak calculation because merging loses multiplicity. A cache of merged regions can answer coverage queries but cannot tell whether one or ten meetings occupy a segment. The representation must retain the information required by later questions.

## Transfer review

Suppose timestamps arrive as strings. Lexicographic ordering might differ from chronological ordering unless a normalized format is guaranteed. Parse or normalize at a defined boundary and reject invalid intervals there if the application requires validation. The supplied exercise assumes valid finite numeric endpoints, so validation is an application extension rather than an unimplemented part of the basic algorithm. Separate parsing, interval semantics, and sweep logic to make failures easier to localize.
