# 18. Minimum coins: optimal states and unreachable amounts

Read [coin change](../../54-coin-change.js), its reference implementation, and the exercise 54 assertions in [the original verifier](../../verify-original.cjs). The objective is the fewest coins summing exactly to the amount, with unlimited supply of each denomination. This is neither a count of combinations nor a rule to take the largest coin first. Use positive integer denominations and nonnegative integer amounts for this chapter's working domain.

## Define what each table entry proves

Let best[a] be the minimum number of coins needed for exact amount a, or an unreachable marker when no such construction exists. Best zero is zero because no coins are needed. For positive a, try every coin c no larger than a. If a-c is reachable, appending c gives a candidate with one more coin. Take the smallest candidate.

An optimal construction for a ends in some coin. Removing that coin leaves a construction of a-c. If that remainder used more coins than the best known remainder, replacing it with a better remainder would improve the original construction, contradicting optimality. This argument justifies reusing optimal smaller states. It is the proof behind the minimum recurrence, not a claim that all optimization problems automatically have this property.

The reference uses Infinity for unreachable states and converts a final Infinity to negative one. Infinity plus one remains Infinity, so unreachable predecessors do not become attractive candidates. Initializing every entry to zero would falsely claim every amount is reachable without coins. Base-state choices encode facts about the problem.

## Worked trace: greedy fails on six

Use denominations one, three, and four, with amount six. A largest-first choice takes four, then one, then one: three coins. Dynamic programming finds three plus three: two coins. The minimum table from zero through six is 0, 1, 2, 1, 1, 2, 2.

At amount five, the candidates include best four plus a one, best two plus a three, and best one plus a four. Their counts are two, three, and two, so best five is two. At amount six, using a three extends best three, producing two, while using four extends best two, producing three. The denomination order does not change the minimum value because every permitted last coin is considered.

For denominations two and four with amount three, best one is unreachable, best two is one, and best three remains unreachable. The result is negative one. There is no requirement to return the closest smaller amount or permit fractional coins. Exactness is part of the contract.

## Iteration order follows dependency direction

Because denominations are positive, each predecessor a-c is smaller than a. Filling amounts in ascending order ensures every needed state has already been resolved. A zero denomination would create a self-dependency; a negative denomination would reach forward or outside the intended table. Those values are excluded from the chapter's domain, and an application should reject them explicitly if inputs are untrusted.

The supplied reference assumes its intended input constraints rather than implementing a full validation layer. Keep that distinction visible. Adding validation to your own application is sensible, but claiming the reference rejects every invalid denomination would be false. The educational task is about the recurrence and minimum result.

With A as the requested amount and K denominations, the straightforward table examines at most A times K candidates and stores A plus one values. This is polynomial in the numeric amount, but the amount's binary representation may be short even when A is enormous. Avoid describing the routine as efficient for arbitrary monetary magnitudes merely because the nested loops are simple.

## Laboratory: a shortest-path oracle over amounts

Build a bounded breadth-first oracle whose vertices are amounts from zero through the target and whose edges add one denomination without exceeding the target. Each edge corresponds to one coin, so BFS distance to the target is the fewest coins. This oracle uses frontier order rather than the DP table's recurrence update and makes a good independent check on small targets.

Compare the two approaches for denomination sets one-three-four, two-four, and two-five over targets zero through twelve. Include duplicate denominations in one separate fixture and show that they do not improve the minimum, although they may add redundant work. Preserve the input denomination array. Report the thirty-nine primary comparisons and the extra duplicate fixture separately.

A reconstruction extension can store which last coin achieved each best value. Following those choices backward from the target gives one optimal list. Equal-cost candidates can produce different optimal lists, so define a tie policy or allow any optimal list. Validate both the sum and the number of coins. A minimum count alone does not specify a unique composition.

## Debugging case: counting ways instead of minimizing

A learner adds predecessor values together, borrowing the stairs recurrence. The resulting numbers may count some form of construction, depending on loop order, but they do not minimize coin count. On one-three-four and six, the required answer is two. Explain the meaning of addition versus minimum at the state transition: addition combines disjoint sets of possibilities, while minimum chooses the cheapest candidate. The operators express different questions.

## Graded exercises

**C18-A:** Fill the table through six and reject largest-first greediness with the worked counterexample. Four points require the optimal two-coin construction.

**C18-B:** Compare DP and BFS across the thirty-nine bounded cases. Five points require exact-amount semantics and unreachable results.

**C18-C:** Add reconstruction with a stated tie policy and check sum plus count. Five points require an unreachable case that returns no invented construction.

**C18-D:** Design validation and resource limits for a small application accepting denominations. Four points require distinguishing invalid input, unreachable valid input, and a request beyond the chosen computation limit.

## Hints, before the review

For C18-B, each BFS edge costs exactly one coin. For C18-C, predecessor amounts must strictly decrease during reconstruction. For C18-D, a valid huge amount can still exceed an operational budget. Read [the review](reviews/18-minimum-coin-dynamic-programming.md) after naming the quantity stored in every table entry.
