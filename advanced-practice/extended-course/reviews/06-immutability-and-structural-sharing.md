# Review 06. Immutability and structural sharing

Return to [the questions](../06-immutability-and-structural-sharing.md). The important observations concern both content and references; neither category alone is sufficient.

## C06-A: the graph

Initially, state points to array S, and S points to todo objects A and B. A shallow copy creates array N, which still points to A and B. Assigning N's first member's done field therefore changes A, and S observes the change through its own arrow to A. The arrays differ, but the changed nested object does not.

A correct toggle creates a new object A2 with the updated field. N points to A2 and B; S continues pointing to A and B. The unchanged B can be shared safely because the reducer does not mutate it. If later callers may mutate these shared objects, the broader application needs an ownership policy. The reducer's nonmutation during its call is not a promise that arbitrary future writes are harmless.

## C06-B: sufficient tests

Freeze S, A, and B. Toggle A's ID. Assert that the new array differs from S, its first todo differs from A, A still has its original done value, and the new first todo has the toggled value. Assert the unaffected content remains correct. Repeated ADD calls with the same frozen state and action should produce equal contents under the reference's state-derived ID policy.

For an unknown action, the exercise's stated new-array behavior is satisfied by a shallow copy. Returning S directly is common in other reducer designs but does not follow this exercise's wording and reference. Distinguish local requirements from familiar conventions. Tests should not force deep clones of unchanged members when the contract only requires no mutation and a fresh outer state.

The ID policy avoids collisions with currently present records, not all historical records. With current IDs one and three, a length-based rule could generate three again, while maximum-plus-one generates four. After deleting the highest ID, maximum-plus-one may reuse an older historical value. A synchronization system requiring globally permanent IDs needs a different mechanism and tests spanning deletion history.

## C06-C: stable sorting

Decorate each row with its original index. Compare rule values in priority order, reversing the sign for descending rules. If all rule values tie, compare the original indices. Sort the decorated copy and return the row references in that order. This preserves input order among complete ties and avoids mutating the input array or records.

An empty rule list returns a new shallow array in original order. String comparisons follow the prompt's case-sensitive code-unit relation. A row ID is not a substitute for the original index in the final tie-break. A test with tied rows whose IDs are z then a rejects that accidental alphabetical policy.

## C06-D: undo ownership

An undo history can store immutable state snapshots by reference if all producers and consumers respect immutability. If a later operation mutates an object shared by an older snapshot, undo no longer restores the historical value. One boundary policy is to accept only states produced through immutable transitions and prevent uncontrolled mutation elsewhere. Another is to copy a supported data domain when adding snapshots. Both require clear scope and costs.

A history test should push an initial state, push a changed state, and then inspect the earlier state's content directly before and after later operations. Assigning before equal to the original variable does not create a content snapshot; it creates another reference. Use known expected values or a genuinely independent supported copy when checking preservation.

## Follow-up challenge

Add a nested tags array to a todo in a separate extension. Toggle done without changing tags, then implement an action that appends a tag. Which references may remain shared in each action? Draw both graphs. The correct copying depth is determined by the path being changed and the ownership contract, not by a fixed rule to always copy one level or always clone everything.
