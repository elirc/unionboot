# Review 09. Prefix and suffix products

Return to [the questions](../09-prefix-and-suffix-products.md). A complete answer identifies the exact indices represented by each accumulator. Saying it contains the product so far is too vague to distinguish inclusive from exclusive state.

## C09-A: the two scans

For 2, 0, negative three, 4, exclusive prefixes are 1, 2, 0, 0 and exclusive suffixes are 0, negative twelve, 4, 1. The mathematical outputs are 0, negative twenty-four, 0, 0. The forward accumulator excludes the current value when it is stored. The backward accumulator excludes the current value when it multiplies that stored prefix. Only after those operations does each pass incorporate the current input for the next position.

A complete two-pass algorithm allocates output of the input length, initializes prefix to one, and for each index assigns output from prefix before updating prefix. It then initializes suffix to one and walks backward, multiplying output by suffix before updating suffix from the original input. It never divides and never overwrites input. Each pass visits every input position once, so the work is linear under ordinary fixed-cost number operations.

The output storage is linear in input length. Auxiliary storage beyond that required output is constant for this implementation. Reporting simply constant space can mislead a reader who includes the returned array in the accounting. State your convention.

## C09-B: a distinct oracle

For each output index i, initialize a local product to one and multiply every input value whose index differs from i. Append that product. This quadratic checker follows the specification directly and is independent of the optimized boundary bookkeeping. Over a three-value alphabet and lengths two through five, there are nine plus twenty-seven plus eighty-one plus two hundred forty-three cases, totaling three hundred sixty.

Use numerical equality that treats signed zero consistently with this mathematical exercise. Strict assertion libraries may distinguish negative zero from positive zero even when ordinary equality does not. A zero-sign disagreement can arise from multiplication order with negative factors; it is not automatically an exclusion error. State this oracle policy explicitly. Do not use that observation to ignore nonzero sign errors or inaccurate results.

The bounded domain avoids large magnitudes and rounding-sensitive fractions. Therefore exact equality is appropriate for its nonzero results. Extending to arbitrary floating-point inputs requires a more careful numerical contract. A passing small-integer oracle check does not prove numerical stability for every possible Number value.

## C09-C: targeted mutations

With input 2, 5, updating prefix before storing it changes the stored prefixes to 2 and 10. A correct suffix pass then produces 10 and 10 instead of 5 and 2. This rejects inclusive-prefix storage. If the backward pass uses output instead of the original input to extend suffix, input 2, 3 is already sufficient to expose the error: the last stored prefix is 2, so the first output can be multiplied by 2 rather than the required factor 3.

These cases are small enough to trace every operation. An array of ones is weak here because replacing a factor with another one leaves the result unchanged. A longer random input might reveal a failure but make the incorrect region harder to identify. Use the shortest fixture that demonstrates the violated invariant, then broaden the suite for neighboring cases.

## C09-D: a separate summary design

A summary can store zero count and the product of all nonzero values. With no zeroes, an application that permits division can divide that product by the excluded value. With exactly one zero, only exclusion of that zero yields the nonzero product; other exclusions yield zero. With two or more zeroes, every exclusion yields zero. This is a valid mathematical case analysis for a different permitted design.

It does not satisfy the original no-division constraint in the zero-free case. It also inherits numerical issues from a potentially large total product. The prefix/suffix approach directly answers the exercise without making total-product division its central mechanism. Compare designs against their own requirements instead of calling one universally superior.

## Transfer review

The reusable idea is an exclusive summary on each side of a position. For concatenation, order matters, so a suffix summary must preserve the original right-side order rather than reverse it accidentally. Multiplication of ordinary numbers hides that distinction because the mathematical operation commutes. Explain the composition order when transferring prefix/suffix reasoning to strings, matrices, or other operations where order can affect the result.
