# 16. Recurrences, repeated subproblems, and measurement

Read [Fibonacci three ways](../../49-fibonacci-memo.js), [climbing stairs](../../53-climbing-stairs.js), fibonacciSuite in [sequence references](../../solutions/round2-39-50.cjs), and climbStairs in [round-two references](../../solutions/round2-remaining.cjs). The exercises connect recursive definitions to memoization and rolling state. Similar-looking recurrences can have different base values because they count different things.

## Define the quantity before optimizing it

Fibonacci has F zero equal to zero and F one equal to one, with later values equal to the sum of the previous two. A direct recursive implementation mirrors that definition. For a small n it is easy to read and useful as a baseline. Its problem is repeated computation: the same subproblem is reached through many paths in the call tree.

For climbing stairs with steps of size one or two, let W n count ordered step sequences totaling n. Every sequence reaching n ends with either a one-step move from n minus one or a two-step move from n minus two. Those cases are disjoint and cover all valid sequences, so W n is the sum of W n minus one and W n minus two. The recurrence resembles Fibonacci, but W one is one and W two is two, so `W(n) = F(n + 1)` for the ordinary nonnegative convention.

Treat W zero as one if you use the empty-step-sequence convention: there is one way to make no moves. The starter does not show zero, but the reference returns one there, consistent with that convention. Negative or fractional n is not a meaningful stair count in this model and needs explicit validation in an application extension. Do not infer sensible behavior for invalid domains from a loop that happens to return a number.

## Worked trace: a call tree has repeated states

For F six, direct recursion calls F five and F four. F five calls F four and F three. The two occurrences of F four are the same mathematical subproblem, but naive recursion computes both independently. Expanding the tree shows repeated F three, F two, and base calls as well. The result is eight, but the call count is twenty-five when every function entry is counted, including base cases.

Memoization associates each n with its result after computing it once. The supplied suite seeds F zero and F one in a Map. A cold call to F six enters the memo function eleven times under its counter convention, because cache hits still count as calls even though they avoid recursive expansion. The count is not simply the number of distinct cached states. Keep function entries and newly computed states as separate measurements.

Calling memoized F six again on the same suite adds one function entry and returns the cached result. It does not recreate the cold eleven-call pattern. The suite factory creates a fresh cache and fresh counters, so use a new suite when comparing cold runs. Reusing a warmed cache while claiming cold complexity makes an experiment misleading even when its outputs are correct.

## Rolling state preserves only future dependencies

The iterative Fibonacci implementation keeps two adjacent values. Before iteration i, one variable holds F i and the other F i plus one. Replacing them simultaneously with the latter and their sum establishes the invariant for the next iteration. After n iterations, the first variable holds F n. No earlier value is needed for the next step, so discarding the full table is safe when the only requested output is the final value.

An incorrect sequential update can reuse the newly assigned first variable when computing the second, effectively adding the wrong pair. Destructuring assignment or an explicit temporary preserves both old values for the transition. Trace two iterations on paper to expose this defect; a single base-case test never enters the update loop.

Rolling state saves memory but loses the history table. If an application needs every intermediate Fibonacci number or a reconstruction of counted paths, returning only the final two variables does not satisfy that richer request. Space optimization follows the output contract. It should not erase evidence the caller actually needs.

## Worked trace: stairs count orderings

For three stairs, the valid sequences are one-one-one, one-two, and two-one, giving three. For four stairs, the sequences ending in one extend the three ways to reach three; the sequences ending in two extend the two ways to reach two. The total is five. One-two and two-one are different because the order of moves differs, even though they use the same multiset of step sizes.

This distinction will matter in coin-change work. Counting ordered paths, counting unordered combinations, and minimizing the number of coins are three different questions. Sharing an addition or minimum operation in a loop does not make their state definitions interchangeable. Write the counted object in ordinary language before borrowing a recurrence.

For five stairs, extend the five ways to four with a final one and the three ways to three with a final two, yielding eight. A small exhaustive sequence generator can verify these counts independently by trying allowed moves until the remaining total is zero or negative. Keep it bounded; its role is a transparent oracle, not the efficient final implementation.

## Laboratory: measure three different things

Implement naive, memoized, and iterative Fibonacci in scratch. For n from zero through a modest bound such as twelve, compare returned values. Count function entries separately from cache misses. For one selected n, draw the naive call tree and compare its node count with the instrumented result. Then call the memoized function twice on the same cache and once on a fresh cache, labeling each measurement.

The repository's published n thirty reference expects 832040 and call counts 2692537 naive versus 59 memoized under its exact convention. You do not need to repeat the large naive run to learn the recurrence. A smaller fresh-suite case establishes the instrumentation relationship with less work. If you do run the published case, report exactly which counter increments and which cache was used.

For stairs, enumerate all one/two step sequences up to a small n and compare their counts with the rolling recurrence. Include zero only after stating the empty-sequence policy. Check that the generator counts orderings separately. A set of sorted step lists would collapse one-two and two-one and undercount.

Use operation counts to explain growth rather than relying on a single wall-clock timing. JavaScript startup, optimization, and machine load can dominate short runs. Also distinguish arithmetic-operation count from exact-integer capacity: Number eventually cannot represent every integer in these growing sequences. Passing small examples does not establish exact results for arbitrary n. A BigInt extension would require consistent types and its own cost model.

## Debugging case: a counter changes the claimed experiment

A learner increments memoCalls only on cache misses, then compares it with the repository's expected 59 function entries. Their algorithm can return correct Fibonacci values while the reported counts disagree. The fix is to align the measurement definition, not to add pointless recursive calls until the number matches. An experiment is a contract about what was counted.

## Graded exercises

**C16-A:** Draw the F six call tree and distinguish total entries from distinct subproblems. Five points require result eight and the stated counting convention.

**C16-B:** Implement cold and warm memoization measurements plus rolling-state Fibonacci. Five points require equivalent small outputs and a correct simultaneous transition.

**C16-C:** Derive stair counts by the final move and verify n three through five with enumeration. Four points require ordered sequences and explicit base cases.

**C16-D:** Design an exact-integer extension and a report containing every intermediate value. Four points require explaining why the output request changes the storage claim and why Number's ordinary range is insufficient for an unbounded promise.

## Hints, before the review

For C16-A, every leaf is still a function entry. For C16-B, a factory call resets state while a repeated function call does not. For C16-C, classify by the final move so the cases cannot overlap. Read [the review](reviews/16-recurrences-memoization-and-stairs.md) after labeling the units of each measurement.
