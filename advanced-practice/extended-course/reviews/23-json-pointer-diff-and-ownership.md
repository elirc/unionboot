# Review 23. JSON diff and ownership

Return to [the questions](../23-json-pointer-diff-and-ownership.md). Exact operation shape is part of the result, alongside path meaning and cloned values.

## C23-A: operations and paths

The worked change emits replace at /a~1b with value two, then remove at /~0 with no value property. Root replacement uses the empty string path. Replacing an empty-named object property uses slash. Assert these strings directly rather than relying on a display that can hide empty text.

Escape tilde to ~0 before escaping slash to ~1 within each segment. A key ~/ becomes segment ~0~1. Join encoded segments with structural slashes. Escaping an already assembled pointer would corrupt those separators. A remove object must omit value entirely; checking JSON serialization alone can miss an own value property containing undefined.

## C23-B: a complete decision structure

First compare supported JSON structures for equality. Equal structures emit nothing. If both unequal values are plain objects in the JSON domain, iterate the sorted union of own keys: absent-after yields remove, absent-before yields add with a clone, and keys present in both recurse. For any other unequal pair, emit one replace at the current pointer with a deep clone of after.

Arrays participate in structural equality but not field-by-field operation generation. Equal arrays containing objects with different insertion order produce no operations. Any changed array produces one whole-array replace. Scalar or type changes also replace. This decision structure separates the equality relation from the granularity of reported changes.

## C23-C: post-call ownership

An added value containing a nested array must be independent at every mutable level. Mutate the emitted nested array and verify the after input remains unchanged. In a separate fixture, mutate after following the call and verify the previously returned operation remains stable. Freeze inputs during another call to catch direct writes.

A shallow spread only creates a new outer object and therefore fails the nested-array test. The reference's JSON serialization clone is scoped to JSON values. It does not preserve arbitrary class instances, functions, or cyclic graphs, which are outside this capstone's domain.

## C23-D: applying a bounded patch

A checker must distinguish empty root path from slash naming an empty key, split pointer separators before decoding segments, and interpret ~1 as slash and ~0 as tilde without reinterpreting newly decoded text incorrectly. Test encoding examples directly before using the checker as a round-trip oracle. For own special keys, define data properties safely rather than accidentally invoking inherited setters.

Apply operations to an independent supported copy of before, then compare structure with after. Keep direct expected diff assertions because a buggy encoder and buggy decoder can agree with each other. Round-trip compatibility is valuable evidence, but it is not a substitute for checking the external format.

## Transfer review

A deterministic diff is a change description, not automatic authorization to apply it. An application may need an expected document version and validation of the resulting state before persistence. Likewise, atomic array replacement is a deliberate conflict granularity that may be too coarse for another product. Preserve the distinction between the pure reporting algorithm and the policies governing a live editing system.
