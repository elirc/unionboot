# Review 19. Path formats and conflict detection

Return to [the questions](../19-path-representations-and-conflicts.md). The format is reversible because its domain restrictions and empty-object markers preserve the necessary distinctions.

## C19-A: direct representation

The worked entries are user.name with Ada, user.flags with a fresh empty object, then active with true. Their order follows depth-first traversal of Object.keys. Null is emitted as a leaf. An empty nested object is also emitted, but as a new object marker; an empty root produces an empty Map. Missing properties produce no entries at all.

A complete flattening walk carries a path prefix, visits each owned enumerable key in the specified order, and either emits a scalar leaf, emits a new empty-object leaf, or recurses into a nonempty supported object. The constrained domain excludes arrays and dotted key segments, so the walk does not need to invent array indexing or escaping rules.

## C19-B: order-independent rejection

Collect every full path into a Set. For each path, split on dots and reject empty segments and exact forbidden names. Check each proper prefix against the full-path Set. If a prefix is declared as a leaf, reject the configuration before construction. This catches a plus a.b in both insertion orders, including when a stores an empty object.

After validation, create missing containers while walking path prefixes and assign supported leaf values. Clone empty-object leaves. The Map has already eliminated simultaneous duplicate full keys by its own semantics, so duplicate raw declarations require an earlier validation boundary if an application needs to reject them.

## C19-C: three evidence categories

Round trips establish that reconstruction agrees with flattening on selected supported fixtures. Direct expected entries establish the intended representation and ordering. Mutation and identity checks establish fresh empty-object ownership. None implies the other two: two lossy functions can round-trip their own reduced data, a correctly ordered Map can alias an input object, and independent objects can still encode the wrong paths.

Test a, a.b conflicts in both orders and each invalid segment position. A substring such as constructorSuffix is not the exact forbidden segment constructor. Do not broaden a security-looking rule by intuition and then claim it matches the prompt. The later merge and JSON diff contracts deliberately allow own data keys with those exact names, showing why restrictions belong to specific formats.

## C19-D: extending the format

A segment-array representation can carry literal dots without ambiguity because boundaries are explicit array positions. An escaped-string representation can also work if escaping and decoding form a one-to-one mapping over every allowed segment. Define handling for the escape character itself, empty keys if newly allowed, and malformed encodings.

Existing unescaped dotted data needs a version marker or a migration rule. Reinterpreting old strings under a new grammar can change their meaning. Include examples that distinguish a literal a.b key from nested a then b. A migration must preserve that difference rather than guess from the spelling alone.

## Transfer review

Configuration reconstruction and JSON Pointer patching share the idea of a path but have different grammars, key restrictions, and mutation policies. Reuse low-level utilities only when their contracts align. A helper called splitPath is not a sufficient abstraction if callers disagree about separators, escaping, empty keys, or whether arrays are traversable.
