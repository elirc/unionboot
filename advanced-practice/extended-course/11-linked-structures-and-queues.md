# 11. Linked structures, queue state, and amortized work

Read [linked list](../../57-linked-list.js), [queue class](../../79-queue-class.js), and the corresponding references in [round-two implementations](../../solutions/round2-remaining.cjs) and [later implementations](../../solutions/missing-refs.cjs). A linked list teaches local reference changes. A queue teaches an abstract ordering contract that can be implemented with several representations. The abstract operation and its storage mechanism should remain separate in your explanation.

## A list is a chain of reachable nodes

The list head is null when empty. Otherwise it references a node containing value and next, where next points to another node or null. The sequence visible through toArray is the sequence reached by following next from head. Removing a node does not require shifting all later values; it changes the reference that previously led to that node.

For a non-head deletion, previous.next becomes current.next. For a head deletion, the list's head becomes current.next because there is no preceding node to update. Failing to distinguish those cases often leaves the removed head visible or attempts to write through null. Deleting the only node is the same head case and should leave head null.

The reference find returns the actual matching node, not a copy of its value. That exposes its next reference to callers. It is useful for an educational structure but allows callers to mutate the chain or create a cycle. This chapter assumes the list is manipulated through the intended operations. An encapsulated production list might return values or handles instead; that is a design extension with a different interface.

## Worked trace: removing a middle node

Push values 4, 7, and 9. Draw head pointing to node A with value 4, A.next pointing to B with value 7, and B.next pointing to C with value 9. C.next is null. While searching for 7, previous is initially null and current is A. After the first nonmatch, previous becomes A and current becomes B. On the match, assign A.next to C. Head remains A, and traversal now yields 4, 9.

The removed B object may still exist if another variable references it. Deletion from this list means it is no longer reachable along the list's chain, not that JavaScript immediately destroys the object. If find previously returned B, that reference can still inspect B. This distinction between membership and allocation is essential when reasoning about object graphs.

Deleting 4 next sets head to C. Deleting 9 then sets head to null. A subsequent delete of 99 returns false and changes nothing. The reference removes the first matching value and returns immediately; duplicates can remain later in the list. The simple prompt does not provide an elaborate duplicate policy, so label first-match deletion as the chosen reference behavior when testing that extension of the examples.

## FIFO is independent of the representation

A queue returns values in the order they were enqueued, regardless of interleaved reads and writes. Exercise 79 adds a size getter, peek, chainable enqueue and clear, harmless empty reads, and support for any value including undefined. The public return from dequeue cannot by itself distinguish a stored undefined from an empty queue. Size supplies an additional observation, and the implementation must use actual occupancy rather than truthiness to decide whether to remove an item.

Repeated array.shift can move the remaining contents in an array-oriented implementation and is explicitly forbidden in dequeue and peek by this prompt. A head-index representation can append at the tail and advance a head cursor without shifting on every removal. A two-stack representation can also meet amortized constant-time queue operations. The reference uses numeric positions in a Map and resets its cursors when it becomes empty.

Read-only size means callers observe it through a getter rather than assign a new count as part of the API. Internal state must remain consistent after every operation: size equals the number of live values, peek does not remove one, and clear removes all values and returns the same queue object. A method name alone does not establish these details; the prompt does.

## Why amortized constant time is a sequence claim

In a two-stack queue, enqueue pushes onto an incoming stack. Dequeue pops from an outgoing stack. If outgoing is empty, move every incoming item to outgoing, reversing the order, then pop. One dequeue can perform many moves, so its worst individual cost is linear in the number of queued values. Across an operation sequence, each item is pushed into incoming once, moved to outgoing at most once, and popped at most once. Total work is linear in the number of items processed.

That is the amortized argument. It does not say every operation takes identical wall-clock time, and it does not depend on averaging over random inputs. It accounts for a bounded amount of work per item over any valid operation sequence. If you transfer the technique to a latency-sensitive interface, the occasional large transfer may matter despite the good amortized bound.

A head-index array has a different memory consideration: already-dequeued slots can retain references unless cleared, and the underlying array can grow indefinitely unless compacted or reset. Correct FIFO output does not prove good retention behavior. An implementation can periodically compact with a threshold and justify the aggregate copying work, or choose another representation. Keep memory policy visible instead of hiding it behind a time-complexity label.

## Laboratory: operation logs instead of isolated calls

For a linked list, test empty find and delete, deletion at head, middle, and tail, deletion of the only element, and a missing value. After every operation compare toArray with a simple expected array. Save one node reference from find and explain what happens to it after removal without mutating the repository reference or building a cycle accidentally.

For a queue, write a deterministic operation log mixing enqueue, peek, dequeue, and clear. Include undefined, zero, false, an object reference, and a string. Use a simple array model with shift in the test oracle; the prompt's performance restriction applies to your queue implementation, while a small independent test model can prioritize clarity. After every operation compare the returned value and size. Assert that peek leaves size unchanged and chainable methods return the queue itself.

Extend the log through an empty state and then enqueue again. Cursor-reset bugs often appear only after draining or clearing and reusing the same instance. Two separately constructed queues should have independent state. A hidden shared storage variable can pass a single-instance sample but fail this isolation case.

## Debugging case: undefined is mistaken for empty

A faulty dequeue reads the front value, then returns early if that value is undefined. If undefined is a stored item, the queue never removes it and later values become inaccessible. Enqueue undefined followed by 2. The first dequeue should return undefined and reduce size to one; the second should return 2 and reduce size to zero. Observing size after the first call distinguishes valid data from absence.

## Graded exercises

**C11-A:** Draw the list deletion trace and explain reachability versus object lifetime. Five points require correct head, middle, and only-node cases.

**C11-B:** Build a queue operation-log checker covering all permitted value kinds above. Five points require occupancy observations and reuse after clear.

**C11-C:** Implement a two-stack queue in scratch and count item moves. Five points require an aggregate work argument and an example of one expensive dequeue.

**C11-D:** Design an encapsulated list API that does not expose writable next links. Four points require explaining how callers find values and how the new interface differs from exercise 57.

## Hints, before the review

For C11-A, follow arrows from head after each write. For C11-B, the return value and size form separate observations. For C11-C, charge each transfer to the particular item being moved. Read [the review](reviews/11-linked-structures-and-queues.md) after recording the operation sequence.
