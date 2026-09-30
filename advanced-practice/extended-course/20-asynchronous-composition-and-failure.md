# 20. Asynchronous composition: order, capacity, and failure

Read [collect concurrent results](../../60-promise-all.js), [all settled](../../61-all-settled.js), [concurrency pool](../../62-concurrency-pool.js), [async reduction](../../63-async-reduce.js), [timeout](../../64-with-timeout.js), [abortable delay](../../65-abortable-delay.js), and [pipeline recovery](../../83-async-pipeline.js). These are separate contracts. Combining them requires deciding whether work is independent, whether partial failures are report data, and whether an operation can actually be cancelled.

## Result order differs from completion order

Exercise 60 resolves results in input order even when later positions finish first. Store each result at its original index and count settled successes independently. An array's length is not a completion counter: assigning index nine makes length ten even if positions zero through eight remain unresolved. Empty input resolves immediately to an empty array.

Promise.resolve normalizes plain values, promises, and thenables. The first observed rejection settles the aggregate rejection, and the exact reason is preserved even when it is not an Error object. Other input operations may still finish. An aggregate rejection does not undo their side effects or cancel their execution.

Exercise 61 instead turns each fulfillment or rejection into a record at the corresponding input position and fulfills after every position settles. It preserves reasons as data. It is appropriate for a complete report, not a transaction. A report saying one item failed does not imply earlier successful effects were rolled back.

## Worked trace: two slots and four jobs

For mapLimit with four items and limit two, start indices zero and one. Suppose index one finishes first. Its result is stored at position one, and the freed slot starts index two. If zero then finishes, its slot starts index three. Completion order can be one, zero, three, two while the returned results remain zero, one, two, three by input position.

The capacity invariant counts unfinished worker calls, not how many jobs have ever started. A slot remains occupied until its awaited value settles, including when the worker returns a thenable. Starting all workers immediately and awaiting them in batches does not satisfy the concurrency bound; the work was already launched.

If index one rejects while zero remains active, the failure is observed by its runner and a stopped flag prevents subsequent scheduling. Zero may still finish or reject. The prompt says no new jobs after failure is observed, not after some unknowable instant when a remote failure occurred. Tests should control promise settlement and observation instead of relying on tiny timer differences.

## Dependencies require sequencing

AsyncReduce waits for the initial value, then feeds each resolved accumulator into the next reducer call. Running those calls concurrently would give them stale or missing predecessor results. Use a normal loop with await. An async callback passed to forEach does not make forEach await each step, so it is a misleading substitute for sequential control flow.

The pipeline in exercise 83 similarly feeds one stage's output to the next. Its optional trap handles a stage throw or rejection and supplies a replacement output, allowing later stages to continue. Registering a new trap replaces the old one. A trap failure itself propagates from the reference rather than recursively trapping its own error. The reference also awaits the initial value before entering stage-specific catch blocks, so initial rejection is distinct from a stage failure.

For stages add one, throw, multiply by ten, a trap returning the failed stage index one makes the final result ten. Recovery is not a retry of the failed stage. If a product needs retries, specify their count, delay, identity, and side-effect policy separately.

## Timeout is not cancellation

Exercise 64 bounds how long a caller waits and clears the timer if the input settles first. If the timer wins, the underlying work continues unless another mechanism stops it. A later rejection must still have a handler. At zero milliseconds, an already-resolved input wins under the prompt's microtask-before-timer rule.

Exercise 65 models genuinely abortable waiting: abort clears its timer and rejects with signal.reason by identity. It removes the listener on every settlement and never aborts the caller's controller. Validation of milliseconds happens first, so invalid duration and already-aborted signal have an explicit precedence. These lifecycle details are part of correctness, not optional cleanup polish.

## Laboratory: deferred controls instead of sleep guesses

Create a deferred helper returning a promise plus resolve and reject functions. Use separate deferred values for worker calls so you can decide completion order precisely. Immediately attach handlers to the aggregate promise before triggering rejections. Log start indices, active count, peak active count, completion indices, and final results. Resolve later indices first and prove result order remains unchanged.

For failure, hold the first worker pending and reject the second. Await the aggregate rejection so the failure has been observed, then settle the first. Assert no third job started and no late rejection escaped handling. Use generated values and no external services; the lab needs scheduling control, not a network dependency.

For timeout, use a short bounded timer only where the timer contract itself is under test. Show that a side-effect flag can become true after timeout when the underlying deferred work later resolves. Do not describe that as a cancellation failure: cancellation was never promised. For abortable delay, verify the exact reason identity and test an already-aborted signal without waiting for a long timer.

## Graded exercises

**C20-A:** Build an out-of-order completion trace for exercise 60 and reject a results.length completion counter. Five points require indexed storage and empty input.

**C20-B:** Prove the concurrency limit and stop-after-observation rule with deferred workers. Five points require handling already-started late failures.

**C20-C:** Compare sequential reduction, all-settled reporting, and stage recovery on one small data workflow. Four points require explaining which failures become data and which propagate.

**C20-D:** Demonstrate timeout versus abortable waiting. Four points require exact reason identity, cleanup reasoning, and no claim that a timeout rolls back completed work.

## Hints, before the review

For C20-A, an assigned final index says nothing about earlier positions. For C20-B, await observation before asserting the stopped state. For C20-D, separate the caller's wait from the worker's lifetime. Read [the review](reviews/20-asynchronous-composition-and-failure.md) after drawing the event timeline.
