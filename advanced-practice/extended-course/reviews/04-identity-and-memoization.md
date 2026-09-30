# Review 04. Identity and memoization

Return to [the questions](../04-identity-and-memoization.md). The grading criterion is fidelity to the chosen equality relation, not the number of cache hits.

## C04-A: relations can disagree

Two separately allocated records with the same ID and fields have different reference identity, equal supported structure, and the same domain identity if the ID is authoritative. One record before and after an in-place name change has the same reference identity and domain identity, but a snapshot of its earlier content differs structurally from its later content. Two customers with different IDs but the same displayed name are different domain entities even if a projection containing only name is structurally equal.

A good table states which fields participate in the structural comparison and which identifier defines domain identity. Without that scope, claims about equality can become tautological. The exercises intentionally use narrower definitions than a complete business model.

## C04-B: complete synchronous strategy

Create a Map in the closure returned by memoize. On every call, check cache.has(argument). If true, return cache.get(argument). Otherwise call fn(argument), store the returned value under that exact argument, and return it. This caches undefined correctly because membership does not depend on the value. It distinguishes equal-looking objects because Map uses object identity for those keys.

The computation counter should rise once for a repeated key and once more for each distinct key. For the fresh-object result function, two calls with the same key return the same object reference. Two calls with different object keys compute distinct result objects. An implementation that returns equal contents from repeated recomputation fails the work-count and identity observations even though deep comparisons may pass.

## C04-C: limits are not necessarily defects

If a cached function reads key.price, and the same key object is mutated afterward, returning the earlier result illustrates the absence of invalidation. The simple exercise did not promise invalidation. If a caller mutates the cached result object and receives the changed object on the next call, that illustrates shared result identity. It may be unacceptable in your application, but repairing it requires a new contract about ownership or immutability.

Possible application policies include freezing immutable result structures, returning defensive copies of a supported data domain, or exposing documented shared snapshots. Each policy has costs and edge cases. Freezing only an outer object does not make nested content immutable. Copying arbitrary values is not automatically possible or meaningful. Explain the selected domain instead of promising universal deep safety.

## C04-D: revision-aware keys

A catalog revision may be unique only within its catalog. Therefore a cache keyed solely by revision three could mix different catalogs. A complete identity might combine catalog ID and revision, using nested Maps or an unambiguous structured encoding. The test should create two catalogs at revision three with different contents, then revision four for one catalog, and verify that all expected results remain distinct.

Retention is a separate decision. Keeping every immutable revision forever can satisfy correctness while exhausting memory. A bounded cache can evict old results and recompute them later without changing semantics if computation is pure and snapshots remain available. If snapshot data can disappear, eviction changes operational behavior and should be described. The original one-argument memoizer is a learning component, not a complete catalog service.

## Follow-up challenge

Wrap a function that throws on its first call and succeeds on its second. Under the simple algorithm, the first call never stores a result, so the second retries computation. Then wrap a function returning a Promise that rejects. The Promise itself can be stored immediately, causing later calls to receive the same rejection. Design separate tests before deciding whether failures should be evicted. This contrast prepares you to reason about asynchronous caches without assuming synchronous exceptions and asynchronous rejections have identical timing.
