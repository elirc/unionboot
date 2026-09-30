# 19. Flattening paths without losing structural meaning

Read [flatten object](../../70-flatten-object.js), [unflatten object](../../71-unflatten-object.js), and their implementations in [later references](../../solutions/missing-refs.cjs). These functions exchange a restricted nested configuration and a Map of dotted paths. Their key restrictions are part of why the representation is reversible. Do not confuse this format with exercise 69's array paths or capstone 3441's escaped JSON Pointers.

## A representation must distinguish structure from spelling

A dotted path a.b can mean an object a containing a property b only because the flattening contract forbids dots inside individual keys. If a literal key named a.b were allowed, it would collide with that nested structure. The exercise avoids the ambiguity by restricting the input domain rather than implementing an escaping grammar.

The domain also excludes arrays, undefined, symbols, getters, cycles, and the special path segments __proto__, constructor, and prototype. Leaves are strings, finite numbers, booleans, null, or the special preserved representation of an empty nested plain object. Inputs satisfy the flattening restrictions; the reverse function explicitly rejects invalid path syntax and conflicting declarations. Different validation responsibilities apply at the two boundaries.

An empty object is not interchangeable with a missing property. If user.flags is an empty object, dropping it during traversal would make reconstruction omit flags entirely. Therefore flattening emits a new empty-object leaf for that path. An empty root is represented by an empty Map because there is no path segment naming the root itself in this format.

## Worked trace: a leaf that looks like a container

Take a configuration with user containing name Ada and flags as an empty object, followed by active true. The flattened entries are user.name mapped to Ada, user.flags mapped to a new empty object, and active mapped to true, in the depth-first Object.keys traversal order. Null is a scalar leaf, not a container to recurse into.

Reconstruction splits user.name, creates user as an implicit container, and assigns name. The flags entry assigns a cloned empty object beneath that same container. The active entry becomes a root property. The reconstructed tree has the same supported content, while its created containers and empty-object leaves are independent of the input Map's object leaves.

Now consider entries a mapped to an empty object and a.b mapped to one. The first entry declares a complete leaf, even though that leaf's JavaScript value could also hold properties. The second entry requires a to be a container. The contract calls these declarations conflicting in either insertion order. Treating the empty object as an invitation to extend it would lose the distinction between declared leaf and implicit structure.

## Validate the declaration set before building

A convenient strategy stores all complete paths in a Set. For each path, split its segments and reject empty segments or forbidden names. Then check every proper prefix against the complete-path Set. If any prefix is also a declared leaf, the paths conflict. This detects a plus a.b no matter which entry appeared first in the Map.

Only after validation succeeds should the builder create the output. That two-phase structure makes correctness easier to explain because construction operates on a consistent declaration set. It also avoids partially built results influencing which error is noticed first. The function still has no external transaction: it simply returns a new in-memory object or throws before returning one.

Duplicate full paths cannot occur as simultaneous entries in a Map; setting the same key twice replaces its earlier value before the function sees it. Therefore the reverse function cannot reconstruct a history of duplicate declarations from a Map. If an application must reject duplicates in a raw list, validate the list before converting it to a Map. Representation choices determine which mistakes remain observable.

## Laboratory: round trips and ownership

Build several supported fixtures: an empty root, a nested null, sibling leaves, an empty nested object, and multiple levels with numeric-looking string keys. Flatten and reconstruct each, then compare supported structure. Inspect the Map's entry order separately; structural equality of objects does not prove the required depth-first emission order.

Freeze input objects and Map leaf objects where practical. Verify that flattening's empty-object leaf is not the original nested empty object. Verify that reconstruction's corresponding object is not the Map leaf. Mutate one resulting empty-object leaf in a scratch copy and confirm neither source changes. These observations check the explicit fresh-leaf contract.

For rejection, test a and a.b in both insertion orders, including a storing an empty object. Test an empty path, a leading dot, a trailing dot, a doubled dot, and each forbidden segment at both root and nested positions. The restriction applies to segments, not arbitrary substrings: a label containing constructor as part of a larger permitted name is a different string. Tests should match the actual rule.

A round trip alone is insufficient. Two broken functions can agree on a lossy format. Keep direct expected entry lists and invalid-input cases alongside round-trip properties. This principle applies to serializers, encoders, and database migrations: mutual compatibility does not by itself establish fidelity to the intended contract.

## Debugging case: validation depends on arrival order

A builder processes a.b first, creating a as an object. When a arrives later as an empty-object leaf, it overwrites the container and silently loses b. Reversing insertion order might instead extend the declared leaf and accept the conflict. Both outcomes violate the order-independent rejection rule. Inspecting the complete path set before construction resolves the ambiguity directly rather than adding ad hoc checks to each mutation.

## Graded exercises

**C19-A:** Produce the exact entry order for the worked configuration and explain the empty-object marker. Four points require distinguishing null, empty object, and missing property.

**C19-B:** Implement prefix-conflict validation and reject both insertion orders. Five points require all forbidden-segment and empty-segment cases.

**C19-C:** Build round-trip, direct-output, and ownership checks. Five points require explaining why no single category is sufficient alone.

**C19-D:** Design an extension permitting dots in keys. Four points require an unambiguous escaping or segment-array format and a migration story for existing dotted data; do not silently reinterpret old paths.

## Hints, before the review

For C19-B, compare proper prefixes with declared full paths before allocating the result. For C19-C, an empty object can be a declared leaf even though it is writable in JavaScript. For C19-D, decoding must invert encoding for every allowed key. Read [the review](reviews/19-path-representations-and-conflicts.md) before moving to the separate JSON Pointer format later in the course.
