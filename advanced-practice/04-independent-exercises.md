# 4. Independent exercises with decreasing guidance

Complete these exercises in a new scratch area or your existing personal answer files. Do not overwrite the repository's starters or another learner's work. Keep the [review guide](05-solutions-and-review.md) closed until each prediction and attempted implementation is recorded. For every exercise, write a case that should fail an attractive shortcut.

## E1: Presence matrix

Construct six merge rows: both unchanged, one-side edit, both identical edits, both deletions, one deletion against an unchanged side, and deletion against a different edit. For each row list base/local/remote ownership and the selected result. At least one row must use the empty string and another the literal `'absent'`. Deliver a trace table and executable assertions. Completion requires explaining the difference between "no emitted key" and "emitted key with an empty value."

## E2: An implementation-independent checker

Write a tiny enumerator using the states missing, empty string, and a nonempty string for one key. There are 27 triples. Derive the expected result from the four rules in the prompt without importing the reference solver to calculate the expectation. Compare your candidate against those expectations. Extend the domain with the fallback string to expose a collision. Keep a count of tested states and explain why finite enumeration is not a proof for arbitrary strings or hostile prototypes.

## E3: Replay after an interrupted delivery

Use [3440](../js-capstones/prompts/3440.txt). Feed events in reverse revision order and repeat the first event. Demonstrate that the result equals processing each distinct event once in revision order. Then reuse an ID with a changed delta and require rejection. The result must never be reported as successful simply because its final numeric balance looks plausible. Your evidence must include validation before deduplication, not just a happy duplicate.

## E4: Intermediate state matters

Construct a replay whose final mathematical sum would be valid but whose first revision goes below zero. Explain why sorting by input position or validating only the final total violates the prompt. Add a separate safe-integer overflow case. Submit the failed shortcut, the discriminating input, and a short discussion of why integer representation is part of the API contract. Do not substitute floating-point tolerances for an exact safe-integer requirement.

## E5: Diff ownership and escaping

Use [3441](../js-capstones/prompts/3441.txt). Create keys containing `/`, `~`, and the empty string. Predict their pointer segments and compare a changed root scalar with a changed empty-named child. Then mutate a nested array inside an emitted operation. Neither input should change. Your test must inspect the original after mutation; asserting the operation's initial shape alone cannot catch aliasing.

## E6: Review an overclaim

A teammate writes: "The capstone verifier passed, so the merge handles all JSON and is ready for collaborative editing." Produce a review that identifies the exact unsupported claims. Reference the string-only 3439 contract, the separate 3441 JSON diff contract, and the verifier's default solution mode. Propose the smallest additional evidence needed to claim the teammate's actual implementation works within its stated scope.

Finish with a ten-minute oral reconstruction. Explain one exercise without opening its code, then change one assumption and describe the necessary design change. If you cannot reconstruct the reason for a test, mark it "needs repetition," even when your saved output is green. Independent transfer is the goal; memorized implementation text is only a temporary aid.
