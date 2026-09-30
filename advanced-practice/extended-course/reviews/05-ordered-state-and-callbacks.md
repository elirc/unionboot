# Review 05. Ordered state and callbacks

Return to [the questions](../05-ordered-state-and-callbacks.md). State the recency or audience order explicitly before discussing the collection operations used to represent it.

## C05-A: the recency trace

After the initial three puts, the order from least recent to most recent is a, b, c. Getting a produces b, c, a. Updating b produces c, a, b because a put counts as use even for an existing key. Adding d evicts c and leaves a, b, d. A missing get for x does not create an entry or alter this order. These transitions are enough to reject a cache that refreshes only reads or one that treats a miss as insertion.

Deleting and resetting an existing Map key is a way to implement the recency transition. Simply setting its new value leaves its insertion position unchanged. The underlying collection's behavior should be demonstrated with a tiny scratch example if it is unfamiliar; guessing from the method name is unnecessary.

## C05-B: observe the consequence of undefined

With capacity two, put a with undefined and b with two. Get a, then put c with three. The correct get refreshes a despite returning undefined, so b is evicted. An implementation that tests cache.get rather than cache.has can treat a as absent and leave it least recent. It then evicts a and retains b. Querying b after the write distinguishes the states.

This test illustrates why an ambiguous API return does not imply the internal states are interchangeable. Presence can affect future operations even when the current read result is the same. If you need an externally unambiguous membership operation in an application, add and specify one separately; do not infer it from get alone.

## C05-C: duplicate registrations

Register first, second, first. The first emission calls first, then second, then first. Remove first once. The next emission calls second, then first. A Set would have stored only one first registration and would therefore produce a different first log. Filtering out every matching function would erase both registrations and produce a different second log. The reference's one index removal matches the one-listener wording.

Function source text does not establish listener identity. A newly allocated arrow function with the same body is another function. The same retained callback reference can be registered under multiple event names, and removing it from one event should not alter the other's list. Emitting an unknown event produces no calls and no error under the baseline contract.

## C05-D: an explicit snapshot extension

A snapshot-dispatch emitter copies the current listener array at the beginning of each emit call and iterates the copy. If A removes itself while running, B remains in that snapshot and still runs. If A adds C during the same emission, C does not appear in the existing snapshot and waits until a later emission. These are consequences of the chosen fixed-audience policy.

The snapshot must copy the list, not clone function objects. Callback identity remains unchanged. Removing a callback affects future audience snapshots but does not retract a callback already selected for the current one. If the product instead requires immediate cancellation of not-yet-called listeners, the implementation needs another policy and possibly membership checks during dispatch.

Thrown callbacks and nested emission remain separate decisions. A snapshot does not automatically isolate errors or prevent recursion. For a bounded extension, you may document that exceptions propagate and nested emit takes its own fresh snapshot. Test those behaviors only if you claim them. Avoid describing the small exercise as a complete event bus for concurrent or distributed applications.

## Follow-up challenge

Design a subscription handle whose unsubscribe operation removes one particular registration even when the same callback is registered repeatedly. Explain why identifying the registration itself solves a different problem from identifying the callback function. A token or closure can represent that registration, but its lifetime and repeated-unsubscribe behavior still need a contract.
