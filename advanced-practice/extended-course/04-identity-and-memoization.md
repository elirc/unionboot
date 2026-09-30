# 04. Identity, equality, and what a cache promises

Read [memoization](../../27-memoize.js), [deep equality](../../19-deep-equal.js), and [the reference verifier](../../verify-original.cjs). Exercise 27 explicitly accepts arguments of any type, including objects, and uses Map-compatible key identity. Exercise 19 compares supported structures by content. The difference is deliberate: two records can be equal in content while still being different cache keys.

## Separate three kinds of sameness

Reference identity asks whether two object references point to the same object. Structural equality asks whether their supported contents match recursively. Domain identity asks whether two records represent the same business entity, perhaps because they share an ID. None of these relations automatically implies the others. Two independently parsed records with the same entity ID have different object identities. A record can retain object identity while its contents mutate. Two unrelated records can coincidentally have equal contents.

Exercise 27's example creates key1 and key2, both containing id one. Repeating key1 must reuse the computed result. Calling with key2 must compute a separate result, even though the records look identical. Replacing Map keys with JSON.stringify changes that contract. It also introduces serialization assumptions that the exercise did not request: supported values, key ordering, cycles, and how special values are represented.

Map uses its own key-equality rules for primitives, including treating NaN as the same key as NaN and positive and negative zero as the same key. That is compatible with the exercise's chosen Map-oriented design. Do not generalize the primitive comparison rule from deepEqual, whose prompt says everything outside recursive objects and arrays is compared with strict equality. Under that prompt, NaN does not equal itself. A shared word such as equality does not make the two contracts identical.

## Worked trace: cached undefined

Imagine a function that increments a counter and returns undefined for every input. Memoize it and call the wrapper twice with the same argument. After the first call, the cache contains the key and a stored undefined value. A second call must return that stored result without computing again. If the wrapper asks whether cache.get(key) is undefined to detect a miss, it cannot distinguish this stored value from absence. The counter reaches two, exposing the bug.

The correct decision asks whether the key is present, then reads the value. This is the same presence-versus-value distinction from chapter 2, now applied to an explicit collection API. There is no need to invent a string sentinel. Map.has already expresses the required membership question.

Now use a function returning a newly allocated object. Call the wrapper twice with the same key. The two results should be the exact same returned object under ordinary memoization. Calling with a different but structurally equal key should yield a different returned object because the underlying function runs again. Two assertions can establish both sides: equality by reference for the repeated key and inequality by reference for the distinct key.

## The purity assumption behind useful memoization

Caching a result by argument identity is most useful when the result remains valid for that identity. If a key object changes after the first computation, the wrapper still sees the same key. Suppose the original function reads key.price, and the caller changes that property. The memoized result can now be stale while satisfying the exercise's same-argument cache rule. The cache did not magically establish immutability or a versioning policy.

For your own application, you can require immutable arguments, include an explicit revision in the key, invalidate entries after mutation, or avoid memoization at that boundary. Each choice changes the promise. A WeakMap can help with retention for object keys in some designs, but it does not solve stale results and cannot accept every primitive key required by this exercise. Choosing a different collection is not a substitute for defining validity.

Thrown exceptions create another policy question. A simple synchronous memoizer stores a result only after the wrapped function returns successfully. A thrown call does not populate the cache. A later call can try again. Caching failures may be useful in some systems, but it needs an explicit duration and retry policy. Do not silently treat a rejected Promise as equivalent to a thrown synchronous error; the wrapper may have already cached the Promise object before rejection happens.

## Laboratory: observe work, not only results

Write a memoizer in a scratch file and wrap a function whose counter increments on every invocation. Test repeated primitive input, two different primitive inputs, the same object twice, two structurally equal objects, and a function returning undefined. For each case predict both returned values and the number of underlying computations. If you only compare returned values, an implementation that never caches can pass most ordinary examples.

Add a function returning a fresh object. Save the first result and mutate it after the first call. Observe what the second call returns. This experiment documents aliasing of cached results; it does not prescribe deep cloning as a repair. Cloning would change result identity and cost, and may be impossible for every value the wrapped function can return. State whether your application allows callers to mutate cached results.

For a separate experiment, mutate a key after the first call and compare a direct computation with the cached one. Explain why they differ. Keep the original exercise tests unchanged, because its contract does not promise invalidation after mutation. The point is to identify a limit before transferring the technique to a product.

## Debugging case: a structural key that erases identity

A developer serializes object arguments to improve cache hits. Two records with the same fields now share a result. The cache appears faster because fewer computations occur. Exercise 27's object-key example rejects this behavior. Optimization changed the equivalence relation rather than implementing the same relation more efficiently. A performance improvement is meaningful only after preserving the required observable behavior.

A related mistake uses a plain object for all cache keys. Numeric one and string one can address the same property name; unrelated object references can coerce to the same string. A small example with two differently typed keys can expose the mismatch more clearly than a large benchmark. Choose the shortest counterexample that distinguishes the relations.

## Graded exercises

**C04-A:** Draw a table of reference identity, structural equality, and domain identity for three pairs of records. Six points require one pair that differs under each relation and a clear definition of the chosen business ID.

**C04-B:** Implement the memoizer and its computation-count tests. Six points require correct undefined caching and separate equal-looking object keys. Tests must call your function, not only the repository reference.

**C04-C:** Demonstrate stale results after key mutation and shared result identity after result mutation. Four points require describing the observations without incorrectly labeling both as violations of the exercise contract.

**C04-D:** Design a cache for immutable catalog snapshots with revision numbers. Four points require defining the complete key, invalidation or retention policy, and a test proving that a changed revision cannot return the earlier result.

## Hints, before the review

For C04-A, imagine two network responses for the same customer and two customers with identical visible names. For C04-B, membership and retrieval are separate operations. For C04-D, ask whether revisions are globally unique or only unique within one catalog. Read [the review](reviews/04-identity-and-memoization.md) only after writing the counterexample that would reject your first design.
