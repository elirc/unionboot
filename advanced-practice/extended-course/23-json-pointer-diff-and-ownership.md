# 23. JSON Pointer diff: equality, determinism, and ownership

Read [capstone 3441's prompt](../../js-capstones/prompts/3441.txt), [its tests](../../js-capstones/tests/3441.cjs), and [its reference](../../js-capstones/solutions/3441.cjs). This function reports changes between supported JSON values. Objects are compared by own fields, arrays are atomic replacement units, and every emitted value is deeply cloned. A generic diff library may use different policies, so reason from this exact contract.

## Equality decides whether any operation is needed

Distinct object references can describe equal JSON structures. Object key insertion order does not affect equality, while array element order does. Therefore comparing serialized strings directly can misclassify objects whose keys were inserted in a different order. The reference recursively compares structure before deciding whether to emit changes.

Arrays being atomic does not mean arrays are compared only by reference. Two arrays containing structurally equal objects are equal even if all their objects were independently allocated. If the arrays differ structurally, emit one replace for the whole array at its current pointer. Do not emit per-index operations under this prompt, even if that would produce a smaller-looking patch for one example.

The supported domain is JSON data, not arbitrary JavaScript instances, functions, cycles, or undefined. The reference's JSON serialization clone is meaningful within that domain. It is not a universal clone for every value a JavaScript program can hold. Keep application validation outside the pure diff or explicitly define it in an extension.

## Worked trace: keys, paths, and removal shape

Compare before containing a/b equal to one and a key named tilde with value true, where the actual second key is the single character ~. Let after contain only a/b equal to two. Sorted own-key traversal visits a/b before ~. Emit replace at /a~1b with value two, then remove at /~0 with no value property.

A remove object containing value undefined is not the same object shape as one with no value property. The contract requires absence. An assertion should use Object.hasOwn on the operation to verify this directly. Serializing both objects to JSON can erase that distinction and make a faulty in-memory result look correct.

The root pointer is the empty string. A property whose key is an empty string has pointer slash. Replacing the entire root from null to an object uses an empty path; replacing the empty-named property of an object uses slash. A display that renders both as blank without an explicit label can confuse reviewers, so show root and empty-key cases separately in your report.

## Escape each segment in the required order

Within a pointer segment, replace tilde with tilde-zero first, then slash with tilde-one. For key a/b, the segment becomes a~1b. For key ~/, the segment becomes ~0~1. If slash is replaced first and tilde second, the newly introduced escape tilde is escaped again, producing the wrong encoding.

Append encoded segments to the parent pointer with a slash separator. Do not escape the entire assembled pointer because that would also escape its structural separators. The dotted-path exercises avoided special characters by restricting keys; this capstone supports them through an explicit encoding rule. Sharing a path helper between those formats without translating their contracts would be an error.

Own __proto__ and constructor keys remain data here. They are not forbidden as they were in exercise 71's restricted reconstruction format. Safe membership checks and safe cloning preserve the distinction. A blanket global ban on those strings would silently narrow this capstone's stated input behavior.

## Output values belong to the output

Suppose after adds n containing v as an array with one element. The emitted add operation contains a cloned object and cloned nested array. Pushing onto the operation's v array must not modify after.n.v. A shallow object spread would create a new outer object but retain the nested array alias, violating the deep ownership requirement.

Input freezing catches writes performed during the diff call, but it does not alone prove that returned operations have independent nested values. Mutation of returned values after the call is a separate test. Check both directions when useful: changing an output must not change an input, and changing an input later must not rewrite an already returned operation value.

Deterministic operation ordering is also distinct from ownership. Sorting the union of raw own keys at each object level defines the traversal order. Equality checks can traverse unchanged structures to determine that they are equal; returning no operations does not mean the computation costs nothing. Avoid claiming the exact recursive reference is universally linear without analyzing its repeated equality checks and output cloning.

## Laboratory: independent dimensions of correctness

Create fixtures for root replacement, an empty-key property, slash and tilde keys, add, remove, nested scalar replacement, equal objects with different insertion order, equal arrays of reordered object keys, and a changed array. Predict complete operation lists before running the reference.

For each remove, assert that value is absent. For each emitted object or array value, mutate a nested field in a scratch output and verify the source fixture remains unchanged. Freeze a separate set of inputs during the call. Compare results from equivalent objects constructed in different key insertion orders to establish deterministic output.

A patch-application extension can provide a round-trip property: applying the emitted operations to an independent copy of before should reproduce after. However, writing a correct pointer decoder and safe property assignment is a separate task. Do not assume that a passing custom patcher proves the diff correct; both can share an escaping bug. Retain direct expected operations for special-key cases.

## Debugging case: array changes become an undocumented patch format

A learner recursively descends into arrays and emits replace at /0/name. That may be a valid operation in some patch systems, but the capstone says arrays are atomic. The correct output for a changed root array is one replace at the empty path, with a cloned complete array. A more granular result is not an improvement when it violates the required contract.

## Graded exercises

**C23-A:** Produce exact operations for the worked keys and both root/empty-key cases. Five points require correct escaping and absent value on remove.

**C23-B:** Test structural equality independent of insertion order and enforce atomic arrays. Five points require distinct but equal references and a changed-array case.

**C23-C:** Prove deep output ownership through post-call mutation. Five points require nested arrays, not only primitive values or outer-object identity.

**C23-D:** Implement a bounded patch-application checker in scratch with independently tested decoding. Four points require direct special-key fixtures alongside the round-trip property and safe own-property assignment.

## Hints, before the review

For C23-A, encode segments before joining them. For C23-C, an outer clone can still share its descendants. For C23-D, decoding reverses the escape interpretation without turning separators into data. Read [the review](reviews/23-json-pointer-diff-and-ownership.md) after distinguishing path syntax from display formatting.
