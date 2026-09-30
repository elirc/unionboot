# Review 08. Windows and best-ending-here states

Return to [the questions](../08-windows-and-best-prefix-states.md). A compact state is justified when discarded history cannot change a future correct decision.

## C08-A: window traces

For abba, the left positions after processing each character are zero, zero, two, two. Current lengths are one, two, one, two, and best remains two after the second character. On the final a, its earlier index zero lies outside the current window. Moving left back to one would include both b characters and break the uniqueness invariant.

For dvdf, left stays zero for d and v, moves to one for the repeated d, and stays one for f. The last valid window is vdf, length three. Clearing the entire window on repetition can discard v unnecessarily. Last-seen positions let the transition remove exactly the invalid prefix rather than all accumulated state.

## C08-B: an independent oracle

Enumerate every start and end boundary of a short string. For each substring, build a fresh Set of its characters and accept it only when its size equals the substring length under the chapter's ASCII domain. Track the greatest accepted length, starting at zero so the empty string is handled. This is slower than the optimized algorithm but simple enough to inspect independently.

For alphabet size three and maximum length five, the number of generated strings including empty is one plus three plus nine plus twenty-seven plus eighty-one plus two hundred forty-three, or three hundred sixty-four. Report that bound rather than claiming exhaustive testing over all strings. The bounded oracle is strong evidence against small-state mistakes, but it is not a proof for arbitrarily long or differently segmented text.

## C08-C: maximum subarray

For negative four, two, negative one, three, negative five, four, current becomes negative four, two, one, four, negative one, four. Best becomes negative four, two, two, four, four, four. Current is allowed to decline because it must end at the present position. Best retains earlier successful slices.

At each position, every nonempty ending-here slice either contains only the current element or extends some slice ending at the previous position. Among the latter, extending the previous maximum remains best because every candidate receives the same added element. This proves that retaining only the best predecessor is sufficient. Starting at zero would introduce the empty slice and change the all-negative result, contrary to the supplied sample.

## C08-D: indices and ties

One defensible extension chooses the earliest start among equal maximum sums, then the earliest end. State that policy in both the optimized code and the slow oracle. Track the current candidate's start whenever you restart at the current element. When comparing a candidate with best, compare sum first and the documented tie fields afterward. A zero-sum prefix can create equal-sum candidates with different starts, so it is useful for testing the policy.

Another policy prefers the shortest maximum-sum slice. That can require choosing a restart on an equal current-sum comparison where the earliest-start policy would extend. The numeric recurrence alone does not determine tie behavior. A test checking only the sum cannot validate the new interface.

## Follow-up challenge

Suppose the window may contain at most two occurrences of each character. Last-seen-one-position is no longer enough to choose the left boundary directly. Design either a frequency-based shrinking window or a structure retaining enough recent positions. Explain what new state is required and why the old invariant is insufficient. This transfer tests whether you understand the state, not merely the familiar code pattern.
