# 06. Immutability without unnecessary copying

Read [todo reducer](../../23-todo-reducer.js), [deep equality](../../19-deep-equal.js), and [stable multi-sort](../../68-stable-multi-sort.js). These exercises separate a new container from new nested values. Copying an array does not automatically copy its members. Sharing an unchanged member does not automatically violate nonmutation. The correct ownership policy follows the contract and the operations performed.

## What a reducer must preserve

Exercise 23 requires a new state array and no mutation of inputs. When toggling one todo, a new array containing a new object for the changed todo satisfies this requirement. Unchanged todo objects can remain shared if the reducer never mutates them. The reference uses exactly that pattern. A comment saying no shared references in a sample should be read in the context of the actual array-identity comparison, not expanded into a promise that every nested object is cloned.

For ADD, the reference derives a new ID from the maximum currently present ID plus one. This avoids collisions among current records after a middle record is removed. It does not promise a globally never-reused identifier across the entire history of the program. Removing the highest ID can make that value available again in a later state. If your application needs permanent identities across deletion and synchronization, it needs another policy. Do not retrofit that larger guarantee into a small reducer exercise by description alone.

For REMOVE, filtering creates a new array without modifying surviving records. For an unknown action, the reference returns a shallow copy. That differs from a common reducer convention of returning the exact existing state for a no-op. Follow this exercise's new-array requirement when working here, and recognize that another application's convention can legitimately differ.

## Worked trace: the shallow-copy trap

Let state contain todo a with done false and todo b with done false. A faulty toggle first creates next equal to a shallow spread of state. It then assigns next at position zero's done field to true. The arrays differ by identity, but both arrays contain the same first todo object. Reading state at position zero now returns done true. The function changed its input through a shared nested reference.

A correct toggle maps the array and creates a new object only for the matching todo. State still observes a with done false. Next observes a with done true. Both can share b because neither changes it. This is structural sharing: preserve references where content is unchanged and replace the path where content changes. It is a reasoning technique, not a requirement to deep-copy everything.

Now imagine an undo history storing prior state arrays. The faulty shallow-copy toggle rewrites the past because the old snapshots still reach the changed object. The correct reducer preserves the prior state's observable content. A test that checks only next misses this failure. A test that inspects both prior and next states exposes it immediately.

## Sorting has its own ownership boundary

Exercise 68 explicitly asks for a new shallow array and forbids mutating rows, row objects, and rules. The result should contain the same row objects arranged in the required order. Deep cloning those rows is unnecessary and changes identity beyond the requested operation. Sorting the input array directly is wrong even if its final ordering matches the expected result.

The comparator must apply rules in priority order and return the first nonzero comparison. If all rules tie, preserve original input order. The prompt specifies code-unit comparison with less-than and greater-than for strings, not localeCompare. That matters because a locale-aware ordering can produce different results and depend on settings. A deterministic exercise contract should not be replaced with a culturally sensitive collation policy unless the task asks for that policy.

Decorating each row with its original index makes the final tie-break explicit. The index belongs to the current input sequence, not to an ID field that merely looks ordered. If two rows tie under every rule, sorting by their IDs would violate stability unless their ID order happened to match their original order.

## Laboratory: test both content and identity

In your scratch reducer tests, freeze the input array and each todo object, then call TOGGLE. Use strict mode or a runtime assertion strategy that reliably exposes attempted writes. Assert that the original done flag remains false, the new done flag is true, the arrays differ, and the changed todo objects differ. For an unchanged todo, allowing shared identity is correct. Do not require a deep clone that the contract does not demand.

Next, run ADD twice with the same input state and action. Compare contents. A hidden global counter can produce different IDs, violating the reference's deterministic behavior for repeated inputs. Deriving IDs from current state avoids that particular impurity, although the permanent-identity limitation remains. Keep those two observations separate.

For multiSort, freeze the input array, row objects, and rule objects. Use two tied rows in an intentionally nonalphabetical ID order. Assert the order remains unchanged within the tie. Test a second rule that distinguishes rows sharing the first-rule value, and an empty rule list that returns a distinct shallow array. Confirm every output row is one of the original row references.

## Debugging case: equality hides mutation

A developer snapshots the input by assigning before equal to state, calls the reducer, then deep-compares before and state. Both variables reference the same mutated structure, so equality tells them nothing about preservation. A snapshot must preserve earlier content independently, or the test must freeze the relevant objects and inspect expected original values. Choosing a test oracle is itself an ownership problem.

Deep equality also has a declared domain. Exercise 19 compares recursive objects and arrays in its educational examples; it is not a universal comparator for Dates, Maps, cycles, accessors, or arbitrary prototypes. The reference's use of ordinary membership in one branch deserves care if you extend beyond plain own-data examples. For this chapter, use explicit supported fixtures and do not market a small helper as a complete JavaScript value-equivalence engine.

## Graded exercises

**C06-A:** Draw the object graph before and after a correct toggle and a faulty shallow-copy toggle. Six points require identifying shared nodes and showing which old observation changes in the faulty case.

**C06-B:** Build the frozen-input reducer suite. Five points require input preservation, repeated-input determinism, correct changed-object identity, and the new-array rule for a no-op action.

**C06-C:** Test multiSort with two rules and a complete tie. Five points require stable order, code-unit string semantics, unchanged inputs, and shallow row identity.

**C06-D:** Design an undo stack for these reducer states and explain why a later mutation of a stored todo would corrupt history. Four points require a concrete timeline and an ownership policy at the boundary where states enter the history.

## Hints, before the review

For C06-A, draw arrows, not only JSON values. For C06-B, freezing an outer array leaves its element objects mutable unless you freeze those too. For C06-C, use tied IDs in reverse alphabetical order. Read [the review](reviews/06-immutability-and-structural-sharing.md) after saving both your graph and assertion file.
