# 05. Ordered state: recency and callback registration

Read [LRU cache](../../17-lru-cache.js), [event emitter](../../18-event-emitter.js), and their numbered sections in [SOLUTIONS.md](../../SOLUTIONS.md). Both exercises combine lookup with order, but they attach different meanings to that order. The cache tracks recency of use. The emitter tracks registration order. Treating either as an unordered set discards behavior the caller can observe.

## The cache is a transition system

A cache state can be described as an ordered sequence from least recent to most recent, plus a value for each key. A successful get moves its key to the most recent position. A put of an existing key updates its value and moves it to that position. A put of a new key appends it, then evicts the least recent key if capacity is exceeded. A missing get returns undefined and does not add an entry.

The reference uses a Map whose iteration order reflects insertion order. Setting an existing key does not by itself move it to the end. Deleting and then setting it does. That small distinction is the mechanism behind the policy. You should be able to explain the policy without mentioning Map first, then show how Map operations implement each transition.

For this chapter use positive integer capacities, matching the ordinary exercise scenario. The prompt does not fully specify invalid capacities. A production cache should decide how to handle zero, negative, fractional, or changing capacities explicitly. Do not infer a universal validation policy from a reference constructor that simply stores its argument. Additional validation can be a sensible extension, but it is a new requirement.

## Worked trace: updates count as use

Start with capacity three. Put a with value ten, b with twenty, and c with thirty. The recency sequence is a, b, c. Get a; it returns ten and the sequence becomes b, c, a. Put b with value twenty-one; the sequence becomes c, a, b. Put d with forty; c is now the victim, leaving a, b, d. A cache that only refreshes on get would instead leave b too old and choose the wrong victim in an appropriate continuation.

Now get a missing key x. The sequence stays a, b, d. If the implementation inserts x with undefined while handling the miss, it changes both capacity and future eviction. A cache miss is not an ordinary cached undefined value. If your cache permits undefined values, use internal membership to distinguish those states even though this public get API returns undefined for both. Eviction behavior can still reveal whether the entry exists.

For a capacity-two example, put a with undefined, then b with two, then get a, then put c with three. If stored undefined was treated as a miss, a would not refresh and could be evicted. A later observation of b distinguishes the broken behavior: correct recency evicts b. The test must observe the state consequence, not only the ambiguous return from get a.

## Listener identity is part of registration

An emitter stores callable references under event names. Registering a function and later supplying a newly created function with the same source text does not identify the original registration. Functions are objects with identity. Keep the reference you intend to remove. An inline function is removable if you retained that exact reference elsewhere; the real limitation is losing access to the registered identity, not the syntax used to write it.

Exercise 18 says off removes one listener. If the same function is registered twice, removing one occurrence should not erase every occurrence under that reading. The reference uses indexOf followed by one splice. A Set-based implementation would collapse duplicate registrations and therefore implements a different policy. As with memoization, a data structure can quietly change the meaning of sameness.

The prompt specifies registration order and harmless emission for an unknown event. It does not fully specify what should happen when a listener adds or removes listeners during emission, or when a listener throws. The reference iterates the live array directly and does not catch listener exceptions. That is observable implementation behavior, but it is not a comprehensive event-system design. Keep a baseline exercise separate from an extension with explicit reentrancy rules.

## Laboratory: compare state after every operation

Implement your own cache in a scratch file. Write a tiny model using an ordinary array of key/value pairs, accepting its linear operations because it is only an independent checker for small traces. Run the worked sequence against both. After every operation compare observable get results using careful probes that do not accidentally alter the state you intend to compare. An easier alternative is to design a test-only snapshot method in your scratch model and implementation, then exclude it from the exercise API.

If you use only public probes, remember that get is a mutation of recency. Reading every key to inspect contents changes the next eviction. Record this observer effect in the lab. A diagnostic interface can be valuable, but adding it must not change normal behavior. Tests need an observation strategy consistent with the system's state transitions.

For the emitter, register first, second, and first again for one event. Emit once, remove first once, and emit again. Predict the callback log. Add another event name and show that removing a listener from one event leaves the other event unaffected. Finally, emit an unregistered name and assert no new callback log entries and no throw.

## Debugging case: mutation during dispatch

Create listeners A and B. A removes itself when called. In a live-array loop, removing the current element shifts B into the earlier index; the iterator may advance past it. Observe the repository reference behavior in a temporary extracted copy if you want to investigate, but do not change the shared solution. Then define a snapshot-dispatch extension in your scratch implementation: copy the listener list at the start of emit and call that snapshot. Under this policy B still runs for the current emission, while removals affect future emissions.

Neither policy should be justified by saying arrays are convenient. The policy is a product decision about the current event. Write it first, then choose the iteration technique. Nested emission and thrown callbacks need additional decisions if your extension supports them.

## Graded exercises

**C05-A:** Complete the capacity-three trace and add a miss between two writes. Four points require accurate recency order and victim choice.

**C05-B:** Build a test proving that cached undefined refreshes recency. Four points require observing the later eviction rather than treating the get result as sufficient evidence.

**C05-C:** Test duplicate listener registration and single removal. Five points require function identity, event isolation, registration order, and an unknown-event case.

**C05-D:** Specify and implement snapshot dispatch in a separate scratch emitter. Five points require a self-removal example, an added-during-emission example, and a clear statement that this is an extension beyond the minimally specified exercise.

## Hints, before the review

For C05-B, let a second key's survival reveal which key was considered recent. For C05-C, create each function once and store its reference. For C05-D, decide whether the current event's audience is fixed at its start. Read [the review](reviews/05-ordered-state-and-callbacks.md) after recording the operation logs.
