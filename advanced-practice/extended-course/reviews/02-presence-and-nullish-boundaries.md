# Review 02. Presence and nullish boundaries

Return to [the questions](../02-presence-and-nullish-boundaries.md). The central proof obligation is that distinct permitted input states remain distinguishable until the algorithm intentionally treats them as equivalent.

## C02-A: the matrix

For a missing property on an ordinary object, Object.hasOwn is false and reading a nonexistent ordinary name yields undefined. Logical OR and nullish coalescing both return their fallback in that case. For an own empty string, ownership is true, lookup yields the empty string, OR returns its fallback, and nullish coalescing preserves the string. For an own literal absent, both fallback operators preserve the stored nonempty string. If absent is also your chosen missing sentinel, the collision occurs between representations after the read, not because either operator changes that stored string.

For inherited toString, ownership is false while ordinary lookup reaches an inherited function on a typical ordinary object. Both fallback operators preserve that truthy, non-nullish function. This row rejects using lookup alone to implement an own-property path contract.

## C02-B: a sufficient path algorithm

Keep a variable current initialized to root. For each segment, first require that current is a non-null value with typeof object. This accepts arrays and ordinary objects while excluding functions and primitives under the stated contract. Then require Object.hasOwn(current, segment). On either failure, return the supplied fallback. Otherwise assign current to the owned value and continue. After all segments, return current. With an empty path the loop does nothing, so root is returned exactly.

This ordering preserves an own final undefined because no extra validation happens after the last successful read. It also rejects a further traversal through undefined because the next iteration checks traversability. A recursive implementation can express the same logic, but the iterative version makes the step boundary particularly visible.

## C02-C: a concrete sentinel collision

Take base with no a property, local with a equal to the string absent, and remote with a equal to x. Correctly, both sides added different strings relative to absence. The three-way policy reports a conflict and keeps local, producing a equal to absent. A broken reader that turns missing into the string absent sees local equal to base and chooses remote without a conflict. That single row establishes the collision with no need for undefined as a stored input.

Repair the reader by checking ownership and returning a fresh symbol for missing. Alternatively, use undefined only under the capstone's string-only domain and still check ownership. Preserve the existing merge decision order and local-wins conflict policy. An output construction based on Object.fromEntries can preserve an own __proto__ data key; a carefully used property definition is another option. Test the resulting own property rather than assuming assignment had the desired effect.

## C02-D: a different interface

A found/value result can express found true with value undefined without requiring callers to create an impossible fallback. It adds an allocation or object-shaped return protocol and requires callers to inspect found before using value. A fallback API is compact for many consumers and permits a fresh-symbol marker when callers need an unambiguous result. Neither interface removes the need for correct own-property traversal internally.

A caller that supplies the string missing as fallback while permitting that same stored string has chosen an ambiguous observation. The lookup function may still satisfy its contract. Distinguish a function defect from a caller's inability to infer more information than the API and chosen arguments preserve.

## Follow-up challenge

Widen the merge's stored domain to include undefined and predict which proposed absence encodings stop working. Then widen it to include symbols supplied by callers. A freshly created private symbol remains distinct from those existing values, but reusing a globally accessible marker could create a collision if callers can supply it. The exercise teaches representation design through explicit domains, not through a magic keyword that is always safe everywhere.
