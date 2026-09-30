# Review 16. Recurrences and measured work

Return to [the questions](../16-recurrences-memoization-and-stairs.md). Label every number as a returned value, a function-entry count, a cache-miss count, or a stored-state count.

## C16-A: repeated subproblems

F six is eight. A naive call tree has twenty-five function entries when base calls count. Its count recurrence is C zero and C one equal to one, with C n equal to one plus C n minus one plus C n minus two. The extra one represents the current call itself. Distinct argument values range only from zero through six, so the tree contains far more entries than distinct mathematical states.

This difference is exactly what memoization exploits. The same argument identifies the same Fibonacci result under the pure recurrence. Cache validity here is uncomplicated because n is immutable and the mathematical function has no external changing state. That makes it a clearer memoization example than caching a mutable business object without a version policy.

## C16-B: cold, warm, and iterative runs

The supplied suite seeds results for zero and one. A cold memoized call to six enters the function eleven times under its counter, including hits. A second call to six on the same suite increments the count once more, to twelve, and returns eight immediately. A new suite starts with fresh counters and the two seeded base values, restoring the cold experiment.

For iterative Fibonacci, begin with a equal to zero and b equal to one. Before iteration i, a is F i and b is F i plus one. Compute the new pair as old b and old a plus old b. After six iterations, a is eight. A temporary or simultaneous destructuring prevents the second calculation from accidentally using an already updated a.

Naive recursion performs repeated expansions; memoization computes each new state once but still has recursive calls and storage; iteration retains only the previous two values when only the final result is needed. Explain these differences using operation and storage counts. A fast warmed call does not prove a cold calculation has constant work.

## C16-C: stairs by the final move

For three stairs, the sequences are one-one-one, one-two, and two-one. For four, append one to each of the three sequences for three stairs, and append two to each of the two sequences for two stairs, producing five. For five, the same partition gives five plus three, or eight. The final-move classes cannot overlap because their last moves differ.

Using W zero equal to one represents the empty sequence and makes the recurrence work at the lower boundary. W one is one. With those bases, `W(n) = F(n + 1)`. The repository samples establish W two equal to two, W three equal to three, and W ten equal to eighty-nine. Do not return F n simply because the recurrence shape looks familiar.

An independent generator can recurse on remaining stairs: zero contributes one complete sequence, a negative remainder contributes none, and a positive remainder branches by subtracting one or two. Enumerating actual move arrays verifies that orderings are counted separately. Sorting those arrays before deduplication would collapse distinct paths and change the question.

## C16-D: exact values and richer output

A BigInt extension can use integer-valued BigInt bases and additions consistently, with an ordinary validated integer n controlling the number of iterations. Mixing Number and BigInt arithmetic without conversion is not a coherent design. Document the accepted n range and practical resource limits; exact arithmetic does not make arbitrarily large computation free.

If the caller requests every intermediate value, allocate and return a sequence or yield values incrementally. The claim of constant auxiliary state may still apply to a generator's recurrence state, but a fully materialized returned list requires storage proportional to its length, plus the growing size of each exact integer. Complexity accounting should reflect the requested output and numeric representation.

## Transfer review

Counting paths with a new allowed step size of three changes the recurrence to depend on three predecessor states. The final-move partition still works, but the rolling state must retain enough history for all allowed moves. Obstacles or forbidden landing positions add another state rule. Re-derive the counted object and transitions instead of treating Fibonacci as a template to paste into every counting problem. The proof technique transfers more reliably than the exact two-variable code.
