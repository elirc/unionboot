# 22. Ordered event replay and the limits of idempotency

Read [capstone 3440's prompt](../../js-capstones/prompts/3440.txt), [its tests](../../js-capstones/tests/3440.cjs), and [its reference](../../js-capstones/solutions/3440.cjs). This is a pure in-memory replay function over one supplied batch. It validates event identities, revision continuity, and every intermediate balance. It does not implement a durable receipt store, authenticate event authors, or guarantee exactly-once effects across process restarts.

## Identity and order answer different questions

An event ID identifies a repeated fact. A revision places a unique event in the ordered stream. Repeating an ID is harmless only when its revision and delta exactly match the first occurrence. Two different IDs at the same revision are not duplicates; they are a revision collision. The same ID with a different delta is conflicting reuse, even if the final balance would coincidentally remain acceptable.

Validate each incoming event before deciding whether it is a duplicate. A malformed repeat must not escape validation merely because its ID was previously seen. The reference performs validation and duplicate comparison in one pass, checking each event first. It then copies the unique events into a new array for sorting, preserving the caller's event order and objects.

The opening balance and every updated balance must be nonnegative safe integers. Individual deltas may be negative but must be safe integers. An event ID must be a nonempty string, and revisions must be positive safe integers. The prompt does not require trimming IDs; a whitespace string is nonempty under the implemented rule. Avoid inventing normalization that changes identity without a stated extension.

## Worked trace: delivery order is not revision order

Open at ten. Receive event b at revision two with delta negative three, event a at revision one with delta five, and an exact repeat of a. Validate all three. Deduplicate the repeated a by ID and matching meaning. Sort unique events into a then b. Revision one raises balance to fifteen; revision two lowers it to twelve. Return balance twelve, revision two, and applied IDs a then b.

The array length is three but the final revision is two because only two unique events are applied. The applied list follows revision order, not first delivery order. An implementation that sorts the original array mutates the caller even if its result is otherwise right. Sorting a new array of references is enough because the events themselves are read, not changed.

Now replace the duplicate a with a at revision one and delta six. The batch must throw for conflicting identity before returning any replay result. Adding the two deltas or keeping whichever appeared last would assign two different meanings to one ID and violate the contract.

## Continuity is stronger than sortedness

After sorting N unique events, require the event at zero-based position i to have revision i plus one. This enforces exactly the sequence one through N. Merely checking that revisions increase would allow gaps such as one and three. Merely checking uniqueness would allow a batch beginning at five. The compact position check captures the complete starting-point and continuity rule.

This replay function always interprets the supplied batch from revision one against the supplied opening balance. It is not an incremental apply-after-current-revision API. If a caller has already applied revisions one through ten and wants only revision eleven, this contract must be adapted rather than passing eleven alone and expecting acceptance. The initial argument is a balance, not a stored stream revision.

## Every intermediate state matters

Starting at zero, revision one with delta negative one followed by revision two with delta positive one ends at zero. Yet the first intermediate balance is negative, so the batch is invalid. Checking only the sum of deltas misses the required temporal invariant. Sorting before replay ensures the invariant is evaluated in the defined event order rather than arrival order.

Safe-integer checks also apply after addition. Two individually safe numbers can sum outside the safe range. Rejecting that result prevents silently accepting an imprecise balance. This is a domain contract about integer arithmetic, not a general financial system: currency units, account ownership, storage transactions, and audit policies are outside the pure exercise.

## Laboratory: adversaries for each validation boundary

Create a fixture table separating invalid initial balances, malformed events, conflicting ID reuse, revision gaps, revision collisions, intermediate negatives, and unsafe accumulated results. Include a valid exact duplicate and a valid out-of-order delivery. Every rejection should have a stated reason category in your lab notes, even though the prompt does not require a particular message for every error.

Freeze the event array and each event object. After both success and failure, compare the input snapshot. For exact repeats, call the function with the same logical batch in several delivery orders and confirm the same result. Keep invalid duplicates in the test set: a repeat with a noninteger delta must be rejected before it could be ignored.

A transfer experiment can persist a generated batch in a local scratch JSON file and replay it twice from the same opening balance. Both results should match because the function is pure. Do not add the first returned balance as the second opening balance and call that idempotent delivery; doing so asks the function to apply the stream again from a different starting state. Define the replay boundary precisely.

## Debugging case: deduplicate by revision

A learner stores events in a Map keyed by revision and overwrites collisions. Two distinct IDs at revision one collapse into a single event, hiding an invalid stream. ID deduplication and revision validation must remain separate stages. The smallest counterexample contains two different IDs with revision one; the correct solver throws even if both deltas are zero.

## Graded exercises

**C22-A:** Trace the valid three-delivery example and explain why applied length is two. Four points require sorting copied unique events.

**C22-B:** Build one minimal fixture for each invalidity category above. Six points require malformed duplicate, gap, collision, and intermediate-state cases.

**C22-C:** Demonstrate the precise repeated-replay boundary with immutable inputs. Four points require explaining why changing the opening balance changes the operation.

**C22-D:** Design an incremental persistent API with expected stream revision and durable receipt identity. Four points require naming the atomic persistence boundary and acknowledging that this exercise does not implement it.

## Hints, before the review

For C22-B, zero deltas can isolate ordering errors from arithmetic errors. For C22-C, the complete input determines the pure result. For C22-D, a receipt lookup followed by an unrelated write is not automatically atomic. Read [the review](reviews/22-ordered-idempotent-event-replay.md) before making any broader delivery guarantee.
