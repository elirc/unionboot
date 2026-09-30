# 09. Prefix and suffix products without division

Read [product except self](../../51-product-except-self.js), its implementation in [round-two references](../../solutions/round2-remaining.cjs), and the exercise 51 assertions in [the original verifier](../../verify-original.cjs). The prompt explicitly forbids division. That restriction exposes a useful decomposition: every value except the current one lies either strictly before it or strictly after it. You can summarize those two regions separately and combine their summaries.

## Define the boundaries before the loop

For index i, the exclusive prefix product is the product of elements at indices smaller than i. The exclusive suffix product is the product of elements at indices greater than i. Exclusive matters: if either includes the current element, the result no longer excludes self. The desired output at i is the prefix product multiplied by the suffix product.

The empty product is one. Before the first element, there are no earlier values, so the prefix accumulator begins at one. After the last element, there are no later values, so the suffix accumulator also begins at one. Zero is not the neutral element for multiplication: initializing an accumulator to zero would erase every later value. This choice is the multiplicative analogue of starting an empty sum at zero.

For a first implementation, allocate separate prefix and suffix arrays. That makes the boundaries visible and is a good debugging representation. After proving the recurrence, store prefix values directly in the output array and use one running suffix accumulator to multiply them in place. The output array is required by the interface, while the extra accumulator state is constant. Describe that distinction when discussing space; the function still returns an array with one entry per input element.

## Worked trace with a zero

Use input 2, 0, negative three, 4. The exclusive prefix array is 1, 2, 0, 0. The exclusive suffix array is 0, negative twelve, 4, 1. Multiplying corresponding entries gives 0, negative twenty-four, 0, 0. Only the zero's own position has a nonzero answer because its product excludes that zero while every other answer includes it. Signed zero may appear in JavaScript's intermediate arithmetic; the mathematical result here treats zero signs as equivalent.

In the forward pass, write the current prefix accumulator to output before multiplying by the current input element. At index zero, write one and update prefix to two. At index one, write two and update prefix to zero. The remaining written prefix values are zero. If you update before writing, the output at each position includes the very value that must be excluded.

In the backward pass, begin suffix at one. Multiply the final output entry by one, then update suffix with the final input value four. Move left and multiply the next output entry by four, then update suffix to negative twelve. At the zero's index, multiplying the stored prefix two by negative twelve produces negative twenty-four. Only after that multiplication does incorporating the zero turn suffix into zero for the first position.

Two zeroes produce a different but easy consequence: every position's product still includes at least one zero, so every result is zero. No special zero-count branch is needed in the prefix/suffix method. The representation naturally preserves the required information. A division-based total product would need special cases and still violate this prompt's explicit constraint.

## A proof by regions

Before forward iteration i, prefix equals the product of exactly indices zero through i minus one. Assigning it to output i records the required left-region summary. Multiplying by input i establishes the invariant for the next iteration. This is an induction over the scan, with one as the base case for the empty region.

Before backward iteration i, suffix equals the product of indices i plus one through the final index. Output i already holds the left-region product. Multiplying them includes every input position exactly once except i. Updating suffix with input i prepares the next position to the left. The two proofs are independent and compose because their regions are disjoint and cover the complement of i.

This explanation also identifies why the input must remain available during both passes. If you overwrite input elements with prefix products, the backward pass can no longer read the original factors. An in-place extension would require another representation or a different contract. The reference allocates output and leaves input intact; your tests should preserve that behavior.

## Laboratory: compare with an intentionally slow oracle

Implement a checker that, for every index, loops through every other index and multiplies those values. It has quadratic work but follows the definition directly. Use small integer arrays so arithmetic remains within exact, easy-to-audit ranges. Compare your optimized implementation over arrays drawn from negative two, zero, and three, with lengths from two through five. Record the number of cases and explain why the bounded check does not cover arbitrary floating-point inputs.

JavaScript numbers are floating-point values, so mathematically equivalent multiplication orders can round differently for general inputs. The educational examples use small integers. Keep the oracle domain exact for this lab; do not demand bit-for-bit equality over arbitrary extreme floats and then blame an otherwise correct decomposition for reassociation effects. Treat positive and negative zero as equivalent for this mathematical-product check unless you deliberately add a signed-zero policy. A numerical application needs explicit precision and comparison rules beyond this exercise.

Freeze each input array or compare it with an independent snapshot. Check output length as well as values. Add a single-zero case at the beginning, middle, and end, then a two-zero case. These positions catch update-order mistakes that a zero-free array might not reveal. Include negative factors to verify that signs are preserved rather than converted to absolute values accidentally.

The prompt does not state an explicit empty-input or singleton policy. The reference returns an empty array for empty input and one for a singleton's only output, following the empty-product convention. Treat those as useful reference observations, and state them explicitly if your independent implementation adopts them. Do not describe unexplained edge behavior as though it were directly written in the original starter.

## Debugging case: the excluded value returns through an update

A learner writes prefix equal to prefix times input i, then assigns output i equal to prefix. On input 2, 5, the stored prefixes become 2 and 10. Even if the suffix pass is otherwise correct, the first answer becomes 10 instead of 5. The bug is visible in the meaning of the stored prefix before running the whole algorithm. Ask whether the recorded region ends before or at i. Naming the region prevents an arbitrary swap of lines that might later be reversed again.

A second defect reads output i instead of input i while updating the suffix. That mixes a derived summary with an original factor. A small array of distinct nonunit values exposes it better than an array of all ones. One is an excellent identity element and a poor sole test value because many incorrect multiplications leave it unchanged.

## Graded exercises

**C09-A:** Produce prefix, suffix, and final arrays for 2, 0, negative three, 4. Five points require exclusive boundaries and a correct explanation of both accumulator update orders.

**C09-B:** Write the quadratic oracle and compare it with your two-pass function on the bounded small-integer domain. Five points require case counts, nonmutation checks, and a clear limitation on numerical claims.

**C09-C:** Reject both update-order defects with minimal fixtures. Four points require predicting the wrong output before executing the mutated versions in scratch files.

**C09-D:** Design a product summary that reports the number of zeroes and the product of nonzero values. Explain how it could answer exclusion queries and why it is a different design from this no-division exercise. Four points require a zero-case analysis and no claim that division suddenly satisfies the prompt.

## Hints, before the review

For C09-A, an empty side contributes one, not zero. For C09-B, the oracle should skip an index explicitly rather than reuse prefix logic. For C09-C, avoid unit values in the smallest distinguishing example. For C09-D, distinguish a permitted application redesign from the algorithmic constraint you are practicing. Consult [the review](reviews/09-prefix-and-suffix-products.md) after writing both invariants.
