# 08. Sliding windows and best-ending-here states

Read [longest unique substring](../../40-longest-unique-substring.js) and [maximum subarray](../../36-max-subarray.js). Both process a sequence from left to right while retaining compact state. They do not retain the same state or justify it in the same way. The window tracks a currently valid region with no repeated character. Kadane's algorithm tracks the best sum of a nonempty region ending exactly at the current position.

## A valid window is not the best answer yet

Let left and right identify a substring that contains no repeated character. When adding the character at right, a previous occurrence inside the current window makes that window invalid. Move left past that previous occurrence. A previous occurrence before left is irrelevant because it is already outside the window. This is why a last-seen-index implementation uses the maximum of the current left and previous index plus one. Left must never move backward.

After restoring validity, compute the window length and compare it with the best length seen. The current window may be shorter than an earlier one, so returning only its final length is wrong. The best variable summarizes the strongest completed candidate encountered across the scan. Keeping both current state and global best is a recurring sequence pattern.

The exercise works with JavaScript string indexing in the supplied reference. This chapter uses ASCII examples to keep each displayed character aligned with one index. A product needing grapheme-cluster lengths must choose a segmentation policy separately. That extension changes what the indices count; it is not established by these samples.

## Worked trace: why left cannot move backward

Use abba. At right zero, a produces window a of length one. At right one, b produces ab of length two. At right two, b was last seen at one, so left moves to two and the window becomes b. At right three, a was last seen at zero, which is already before left. The current left stays two, giving ba of length two. The answer is two.

A faulty assignment left equal to lastSeen plus one moves left backward to one on the final a. It counts bba, length three, even though the region contains repeated b. The bug is not a missing hash map; it is an invalid state transition. The existing reference test explicitly includes abba, which is a valuable counterexample because it distinguishes monotone left movement from naive last-seen replacement.

A second useful example is dvdf. After d and v, the repeated d moves left past the first d. Adding f gives vdf of length three. An algorithm that clears all remembered state at every repetition can lose the still-useful v and undercount. The correct transition discards only the part of the window made invalid by the duplicate.

## Maximum subarray has a different invariant

For a nonempty numeric array, let current be the maximum sum of any nonempty contiguous slice ending at the current element. Every such slice either starts at the current element or extends a slice ending immediately before it. Among extensions, the best predecessor is the previous current. Therefore the new current is the greater of the element alone and previous current plus that element. Best is the maximum current observed anywhere.

Initialize current and best from the first element. Starting both at zero silently permits an empty slice to defeat every negative nonempty slice. The prompt's all-negative sample expects negative one, not zero. This is another example of an internal initialization changing the public optimization problem. Decide whether empty slices are allowed before selecting base values.

Consider negative four, two, negative one, three, negative five, four. The best-ending-here sums are negative four, two, one, four, negative one, four. The global best is four. There are different slices attaining it, but the existing function returns only the sum. If you extend it to return indices, define a tie policy rather than accidentally depending on the order of greater-than comparisons.

## Why the state can be compressed

The window algorithm does not need every earlier substring because last occurrences plus the current left boundary determine how the next character affects validity. Kadane does not need every earlier slice sum because any inferior slice ending at the previous position remains inferior after adding the same next value. In both cases, the discarded history is irrelevant to future decisions under a precise argument.

This is different from saying the algorithm is greedy and therefore fast. An explanation should identify the dominance relation: which candidate can never outperform another in future extensions, and why. Later dynamic-programming chapters will reuse this way of proving that a compact state contains enough information.

## Laboratory: independent small oracles

Build a deliberately slow checker for longest unique substring. Enumerate every substring of short ASCII inputs, reject those with repeated characters, and take the maximum valid length. Use it to compare your optimized implementation over every string up to a small length from the alphabet a, b, c. Keep the bound small enough that the lab finishes quickly. This checker follows a different structure from the last-seen algorithm, making shared bugs less likely.

For maximum subarray, enumerate every nonempty start/end interval in a short numeric array and compute its sum directly. Compare the largest sum with your linear implementation. Include all-negative arrays, a single element, repeated zeroes, and a positive run separated by a large negative value. Do not add an empty-array case without deciding its result contract first; the prompt's ordinary domain and reference initialization are nonempty-oriented.

Measure operation counts for increasing small inputs if you want to compare growth. Do not use one wall-clock sample as proof of asymptotic complexity. Runtime startup, optimization, and measurement noise can dominate tiny fixtures. The enumeration structure and per-step work provide the complexity argument; measurements can illustrate it.

## Debugging case: the right answer for the wrong region

A flawed unique-substring function returns the right length on abcabcbb because its particular mistakes cancel. That does not validate its window invariant. Add a trace assertion that the current substring actually has no repeats after every update. On abba, the backward-left bug violates that local property before the final answer is returned. An invariant assertion can pinpoint the first invalid transition instead of only reporting a wrong final number.

## Graded exercises

**C08-A:** Trace abba and dvdf with left, right, prior occurrence, current length, and best. Five points require explaining why old occurrences outside the window do not move left.

**C08-B:** Build the bounded exhaustive substring oracle and compare your implementation. Five points require a stated alphabet, maximum length, number of generated cases, and direct invocation of your function.

**C08-C:** Trace the six-number maximum-subarray example and test all-negative input. Four points require distinguishing current from best and explaining nonempty initialization.

**C08-D:** Extend maximum subarray to return indices with a documented tie policy. Four points require a tie example and a slow checker that validates both the sum and the chosen tie-break.

## Hints, before the review

For C08-B, include the empty string because exercise 40 explicitly returns zero for it. For C08-C, the best prior slice ending yesterday may be discarded if starting today is better. For C08-D, decide whether equal sums prefer earlier starts, shorter length, or another rule before coding. Read [the review](reviews/08-windows-and-best-prefix-states.md) after recording a failing mutation for each optimized algorithm.
