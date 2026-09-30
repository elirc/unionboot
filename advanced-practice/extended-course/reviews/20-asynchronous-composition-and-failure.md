# Review 20. Asynchronous boundaries

Return to [the questions](../20-asynchronous-composition-and-failure.md). The central distinctions are launch order, completion order, result order, and observation of failure.

## C20-A: ordered results

Allocate a result array and a separate remaining counter. Normalize each input with Promise.resolve, then store fulfillment at its original index and decrement remaining. Resolve only when remaining reaches zero. Reject with the first observed reason. Empty input resolves to a new empty array. Assigning a high index changes array length immediately, so length cannot prove that lower positions finished.

AllSettled uses the same indexed bookkeeping but records both fulfillment and rejection and decrements on either. It fulfills after all records are present. Exact reasons, including strings or objects, remain data rather than being wrapped unnecessarily.

## C20-B: capacity and stopping

Share a next-index counter and stopped flag among at most limit runners. Each runner claims the next index, awaits that worker, stores its result at the claimed position, and only then claims another. On a throw or rejection, mark stopped and propagate the reason. Observe every runner's rejection, including those from already-started work after the first failure.

Deferred workers let the test hold one slot open while failing another. Await the aggregate failure before asserting that no later index starts, then settle the remaining work and check again. This matches the prompt's after-observation boundary. No claim of cancelling that remaining work follows from the stopped flag.

## C20-C: dependent steps and recovery

AsyncReduce awaits the initial value and each reducer result before advancing. Each call depends on the previous accumulator, so a concurrent map is not equivalent. A pipeline similarly awaits stages in order, but a registered trap can replace one failed stage's output and permit later stages to run. The trap is recovery, not automatic re-execution.

The reference waits for its initial value outside stage catches. A rejected initial promise does not have a stage index and propagates. A trap that throws also propagates its failure. If an application wants initial-value recovery or repeated retries, it needs another specified boundary and tests.

## C20-D: timeout versus abort

WithTimeout attaches success and failure handlers immediately, starts a timer, and clears that timer when input settles first. A timeout rejects the returned wait but leaves underlying work alive. Its later rejection is still handled. AbortableDelay owns the timer it can actually stop; on abort it clears that timer, removes the listener, and rejects with the original signal reason. Normal completion also removes the listener.

Validate duration before checking an already-aborted signal because the prompt specifies that precedence. Never abort the caller's controller to implement cleanup. That controller may govern other work outside the delay's ownership.

## Transfer review

A batch report can truthfully say a case failed while another case succeeded. It cannot infer rollback from those statuses. A transactional system needs a shared atomic persistence mechanism or explicit compensation semantics, neither supplied by a Promise combinator. Keep this distinction in the final workbench: pure analysis results can be aggregated safely without pretending that aggregate rejection reverses external side effects.
