# 2. Trace a merge before implementing one

The authoritative local contract is [prompt 3439](../js-capstones/prompts/3439.txt), with examples in [its tests](../js-capstones/tests/3439.cjs). Three flat records contain own enumerable string values. The function returns exactly `{value, conflicts}` and does not mutate inputs. Deletion is represented by an absent own property. It is not a special string supplied by the caller.

For each key, the comparison order is: take agreement between local and remote; otherwise take remote if local matches base; otherwise take local if remote matches base; otherwise record a conflict and take local. A conflicted local deletion therefore removes the key while retaining its name in `conflicts`.

Consider base `{title:'draft', note:'absent', empty:'x'}`, local `{title:'edited', empty:''}`, and remote `{title:'draft', note:'revised', empty:''}`. Write M for the internal missing sentinel. The sorted union is `empty`, `note`, `title`.

| Key | Base | Local | Remote | Decision | Output |
| --- | --- | --- | --- | --- | --- |
| empty | x | empty string | empty string | Both editors agree | Keep the empty string |
| note | absent string | M | revised | Both changed differently | Conflict; local deletion wins |
| title | draft | edited | draft | Remote unchanged | Keep edited |

The result has only `empty` and `title`; conflicts contains `note`. This trace separates three questions: which keys participate, whether each record owns a key, and which comparison selects the final state. Combining those questions into a compact expression usually makes the failure harder to diagnose.

## What `??` actually guarantees

Nullish coalescing falls back only for `null` or `undefined`. It preserves the empty string. Logical OR falls back for every falsy value, including the empty string. Thus the claim that `record[key] ?? 'absent'` loses empty strings is false.

A string fallback still has a real problem: the input domain permits every string, including `'absent'`. Missing and a stored fallback string would compare equal. A lookup without `Object.hasOwn` also reads inherited values, so changing the fallback does not address property ownership. Under this exact string-only contract, `Object.hasOwn(record, key) ? record[key] : undefined` is a valid absence encoding: stored `undefined` is outside the domain. A fresh symbol makes that separation explicit and remains useful if the domain later widens. The symbol is not needed because empty strings are nullish; they are not.

## Output construction has its own boundary

The [reference implementation](../js-capstones/solutions/3439.cjs) gathers entries and calls `Object.fromEntries`. That creates an own data property for `__proto__`. Assigning a string to `result.__proto__` on a normal object instead invokes the inherited setter; it does not reliably create the desired data property. For a string value it is ignored, rather than replacing the prototype with a string. Do not explain every special-key failure as prototype replacement: the exact value type matters.

The union of own keys is sorted once, so conflicts are lexicographic. With k distinct keys, sorting costs O(k log k); selection is O(k) apart from ordinary property access. The function creates a new output but need not deeply clone values because the permitted values are strings.

For your trace exercise, replace local's deletion with the literal string `'absent'`, and then replace remote's note with a deletion. Predict both cases without running code. Finally, widen the imagined contract to permit `undefined`: which earlier absence representation becomes ambiguous? Record the changed assumption explicitly rather than silently changing the original exercise.
