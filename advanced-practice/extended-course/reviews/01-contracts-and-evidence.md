# Review 01. Contracts and evidence

Return to [the questions](../01-contracts-and-evidence.md). This review explains sufficient answers; it does not turn a copied implementation into evidence of independent work. Keep your first attempt so you can identify which assumption changed.

## C01-A: observable behavior

For secondLargest, the result is the second greatest distinct numeric value in the stated working domain, or undefined when fewer than two distinct values exist. The existing verifier also requires the input array to remain unchanged. Repeated copies of the maximum do not occupy multiple ranking positions. For moveZeroes, the caller's original array must acquire all nonzero values in their original relative order, followed by the original number of zeroes. Returning a new correct-looking array while leaving the original unchanged fails this second contract.

A test of returned identity alone is insufficient for either task. Exercise 3 returns a scalar. Its mutation property concerns the input. Exercise 35 does not demand a particular returned value in the prompt; its primary observable result is the mutated array. Match assertions to the actual interface.

## C01-B: counterexamples and a complete strategy

A distinct-value strategy can maintain two optional maxima. On each number, ignore equality with the current largest; if the value exceeds largest, move the old largest to second and replace largest. Otherwise, update second when it is missing or the value exceeds it without equaling largest. Start with explicit missing states rather than zero. At the end return second directly. This strategy has linear traversal cost and constant auxiliary state for an ordinary finite-number domain.

A Set followed by sorting a newly allocated array is also a legitimate implementation if the required complexity allows it. It uses additional storage and sorting work but can satisfy the contract. Do not reject it merely because the reference uses a different technique. Reject mutation of the original input, duplicate-ranking errors, or the wrong empty result.

The cases negative five, negative two, negative seven reject zero initialization. Nine, nine, four rejects duplicate ranking. Five, five rejects returning the largest when no second distinct value exists. Empty input rejects accidental index assumptions. A snapshot comparison rejects in-place sorting. Each test eliminates a different plausible defect, which is why this small suite has explanatory value.

## C01-C: proving the connection

The deliberate throw must be placed in the exact function your own command is supposed to test. The personal check should fail. If a repository reference command still passes, inspect its imports or extraction code and show why it did not reach that function. This is not evidence that the reference verifier is broken; it is evidence that it verifies a different target. Restore the temporary mutation after collecting the result.

A stronger handoff names the function path, the command, the assertion file, and the expected exit code. It avoids phrases such as all tests passed when only a reference subset ran. A reviewer can reproduce the claim without guessing which copy of the code was exercised.

## C01-D: timestamp transfer

One defensible new contract treats timestamps as distinct numeric instants, excludes events missing a valid instant with a reported validation error, preserves input order, and returns undefined if there are fewer than two distinct instants. Another defensible contract ranks events and breaks equal timestamps by event ID. These produce different answers when two events share the newest instant. Either can earn full credit if the requirement, examples, and implementation agree.

For the transfer test, use three events where two share the newest timestamp and the third is older. State the expected winner under your policy before implementing. Include a separate invalid timestamp case and a preservation check. The numeric exercise supplies a useful algorithm only after the application has decided what constitutes a distinct ranked item.

## Follow-up challenge

Explain why a test that checks only the final printed text might miss undefined versus a missing output field in a larger report. Design a result object whose own-property presence matters, then carry that distinction into chapter 2. The purpose is to build a habit of observing the precise contract boundary rather than equating similar displays with equivalent values.
