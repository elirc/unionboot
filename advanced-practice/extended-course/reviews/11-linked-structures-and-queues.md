# Review 11. Linked structures and queues

Return to [the questions](../11-linked-structures-and-queues.md). Use an operation timeline and reference diagram together: one shows observable sequence behavior, the other explains the state changes that produce it.

## C11-A: deletion and reachability

After pushing 4, 7, and 9, head reaches A, then B, then C. Deleting 7 changes A.next from B to C. B is no longer a member of the list's reachable chain, but a saved reference to B remains a valid reference to that object. Deleting 4 changes head from A to C. Deleting 9 changes head to null. Deleting a missing value returns false and leaves the chain unchanged.

A sufficient delete algorithm keeps previous and current references while walking. On a match, update previous.next if previous exists; otherwise update head. Return true immediately. If traversal reaches null, return false. The reference's first-match behavior means a later duplicate can remain. Document that policy if you include duplicate fixtures, because the starter's examples do not explore every duplicate case.

The reference push walks to the tail, so append takes time proportional to current length. Keeping a tail pointer can make append constant time, but deletion of the tail then needs to update that pointer. Adding cached structural state creates new consistency obligations. A faster operation is not free if another method must maintain its invariant.

## C11-B: queue observations

Enqueue undefined then 2. Size becomes two. Peek returns undefined but size stays two. The first dequeue returns undefined and reduces size to one. The next returns 2 and reduces size to zero. A third returns undefined without changing size. This sequence distinguishes a stored undefined from an empty queue through occupancy, despite identical read values.

After clear, size is zero and the next enqueue behaves like an enqueue into a new empty queue. Enqueue and clear return the same queue instance for chaining. Different queue instances must not share storage. An object enqueued as a value should be returned by the same reference unless the interface explicitly promises copying, which this prompt does not.

A small array oracle can use shift because it serves as a clear specification model, not the submitted efficient implementation. Compare every operation's return and resulting size. Using a slow oracle is legitimate when its bounded cost is small and its simplicity makes disagreements easier to diagnose.

## C11-C: two-stack implementation

Maintain incoming and outgoing arrays. Enqueue pushes to incoming and returns the queue. Before peek or dequeue, if outgoing is empty, repeatedly pop incoming and push each item onto outgoing. The oldest queued item is then at outgoing's top. Peek reads that top without removing it. Dequeue pops it. Size is the sum of both lengths, and clear empties both arrays.

If outgoing still contains older items, never transfer new incoming items on top of it. Doing so would put newer items ahead of older ones. A revealing sequence enqueues one and two, dequeues one, enqueues three, then dequeues twice. Correct results are two then three. A transfer at every dequeue can reverse this chronology.

Each value enters incoming once, moves to outgoing at most once, and leaves outgoing once. Counting these actions bounds total work by a constant multiple of the number of values processed. A single dequeue after many enqueues may move all pending values, so the guarantee is amortized rather than worst-case constant time per call.

## C11-D: encapsulated list design

A value-oriented find can return a found/value record or a read-only snapshot rather than a writable node. Deletion can remain by value or use a registration-like opaque handle if equal values need distinct identities. State whether returned values themselves may be mutable objects; hiding next links does not automatically deep-clone arbitrary stored values.

The new interface differs from exercise 57, where find exposes the actual node in the examples. It may improve encapsulation for an application, but it should be named and tested as an extension rather than substituted without explanation into tests expecting node structure.

## Transfer review

Queue correctness and resource behavior are different axes. A head-index array can return perfect FIFO results while retaining references to dequeued objects. Clear consumed slots or use a representation whose removal releases those references. A deterministic functional test may not prove garbage collection occurred, but source inspection can verify that no live container intentionally retains the removed values. Avoid claiming precise memory reclamation timing, which is controlled by the runtime.
