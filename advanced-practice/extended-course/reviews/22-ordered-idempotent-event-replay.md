# Review 22. Ordered event replay

Return to [the questions](../22-ordered-idempotent-event-replay.md). Validate identity, continuity, and arithmetic as separate invariants.

## C22-A: replay the unique stream

Opening ten with deliveries b at revision two and delta negative three, a at revision one and delta five, and exact a again yields two unique events. Sorted replay applies a to reach fifteen, then b to reach twelve. Return revision two and applied a,b. The original delivery array remains unchanged.

A complete strategy validates the opening balance, then each event before any duplicate decision. Store the first valid event under its ID. A later same-ID event is ignored only when revision and delta match exactly; otherwise throw. Sort a new array of unique events, require each revision to equal its one-based position, and apply each delta with a new safe, nonnegative balance check. Return only after the whole stream succeeds.

## C22-B: minimal rejection cases

A negative opening balance rejects even with no events. An empty ID, noninteger delta, or nonpositive revision is malformed. Two different IDs both at revision one collide. One event beginning at revision two creates a gap. The same ID and revision with a different delta conflicts. Starting at zero with negative one then positive one fails at the first intermediate state despite a zero final sum. Adding a positive delta above Number.MAX_SAFE_INTEGER fails the accumulated-balance check.

A malformed duplicate must also reject. Validation cannot be skipped merely because its ID was seen. Zero deltas help isolate revision errors from arithmetic, while small valid revisions help isolate delta errors. A focused fixture should make the intended failure category obvious.

## C22-C: idempotency boundary

Replaying the same logical batch from the same opening balance produces the same result, independent of delivery ordering when duplicates are exact. Passing the previous returned balance as a new opening balance changes the input and reapplies the stream's arithmetic. That is not the same replay operation and is not covered by a claim of duplicate suppression across calls.

The function has no persistent memory of previously accepted event IDs. Its deduplication scope is the supplied batch. A local file preserving a batch can make a repeatable experiment, but it does not create a durable receipt service or authenticate events.

## C22-D: persistent incremental design

An incremental API needs the current stored revision, an expected-revision condition, and a definition of which event IDs remain recognized across requests. Atomically check the expected state, establish or inspect the event identity, apply the next accepted transition, and persist the new state and receipt together. Otherwise concurrent requests can both pass a separate read before either writes.

Specify what a repeated key with different content means, how receipt retention affects retries, and how authorization is checked. Those are application requirements beyond capstone 3440. The exercise supplies a precise pure replay component, which can be tested independently before designing persistence.

## Transfer review

Do not deduplicate by revision to conceal collisions, and do not sort by ID to infer business order. Identity and sequencing are distinct fields with distinct invariants. This same separation appears in request idempotency, message delivery, and versioned writes: a stable identity does not itself establish a valid place in an ordered history.
