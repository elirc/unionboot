# Structural JSON change log — js-capstones 3441

**What you practise:** a recursive structural diff that emits JSON Pointer operations, with deterministic ordering, correct escaping, and cloned output values.
**Prerequisites:** recursion over nested data; JSON Pointer syntax; deep versus shallow equality; why `JSON.parse(JSON.stringify(x))` is a clone and what it costs.
**Exercises:** 3441: Produce a deterministic JSON Pointer diff.

## The problem in plain words

Given two JSON values, describe the change from the first to the second as a list of operations. Each operation is `{op, path}` with `op` one of `"add"`, `"remove"` or `"replace"`, and a `value` for the two that need one. The `path` is a JSON Pointer: a string of `/`-separated segments naming a position inside the document, with the empty string naming the root.

Three design decisions in the prompt shape the whole implementation.

**Plain objects are compared field by field; everything else is atomic.** Two objects that differ in one key produce one operation about that key. Two arrays that differ at all produce a single `replace` of the whole array. The prompt calls arrays atomic explicitly, which removes the hardest part of a general diff — deciding what an array insertion did to the indices after it.

**The order of operations is deterministic.** Objects are walked over the sorted union of their own keys, so the output does not depend on which key happened to be written first. Two objects with the same keys in different insertion orders are equal, and produce nothing.

**Every emitted value is deeply cloned.** An operation must not hold a reference into either input, because a caller who mutates the operation would otherwise be mutating the document it came from.

## The contract you must honour

Taken from `tests/3441.cjs` and `prompts/3441.txt`:

- The signature is `solve(before, after)` and the return value is an array of operations.
- Root path is the empty string. `solve(null, {a:1})` asserts `[{op:'replace',path:'',value:{a:1}}]` — a type change at the root is one replace with an empty path.
- Object keys are visited in sorted order. `solve({z:1},{a:2})` asserts `[{op:'add',path:'/a',value:2},{op:'remove',path:'/z'}]`: the add comes first because `'a' < 'z'`, not because adds precede removes.
- A `remove` carries no `value` property at all. `deepEqual` in `node:assert/strict` distinguishes `{op:'remove',path:'/z'}` from `{op:'remove',path:'/z',value:undefined}`, so the property must be absent rather than undefined.
- Arrays are atomic. `solve([1],[1,2])` asserts one `{op:'replace',path:'',value:[1,2]}`, not an add at `/1`.
- Object key order inside an array is irrelevant. `solve([{a:1,b:2}],[{b:2,a:1}])` asserts `[]`.
- Pointer escaping: `~` becomes `~0` and `/` becomes `~1`. `solve({'a/b':1,'~':true},{'a/b':2})` asserts `[{op:'replace',path:'/a~1b',value:2},{op:'remove',path:'/~0'}]`.
- A key that is the empty string still produces a separator. `solve({'':1},{'':2})` asserts `[{op:'replace',path:'/',value:2}]` — a pointer of one slash and nothing after it.
- Emitted values are clones. The test runs `out[0].value.v.push(2)` and then asserts `after.n.v` is still `[1]`.
- Neither input may change. The nested case freezes both the outer object and an inner one.

## Approach

1. `isPlainObject(value)` is `value !== null && typeof value === 'object' && !Array.isArray(value)`. All three clauses are needed: `typeof null` is `'object'`, and arrays are objects.
2. `equal(a, b)` is a structural comparison. `===` first, which settles scalars and identical references; then arrays element by element after a length check; then plain objects by own-key count plus a recursive check on each key; otherwise `false`.
3. `escapeSegment(key)` replaces `~` with `~0` and then `/` with `~1`. The order is not optional — see the pitfalls.
4. `clone(value)` is `JSON.parse(JSON.stringify(value))`. The inputs are JSON values by the prompt's definition, so this is safe here.
5. `visit(a, b, pointer)`:
   - return immediately if `equal(a, b)`;
   - if either side is not a plain object, push `{op:'replace', path: pointer, value: clone(b)}` and return;
   - otherwise walk `[...new Set([...Object.keys(a), ...Object.keys(b)])].sort()`. For each key, build the child pointer, then: `remove` if the key is gone from `b`, `add` if it is new in `b`, otherwise recurse.
6. Call `visit(before, after, '')` and return the collected operations.

`Object.hasOwn` is used for the membership tests so an own key named `__proto__` or `constructor` counts as data and an inherited name is never mistaken for a present key.

## Worked example — 3441 Produce a deterministic JSON Pointer diff

Take the first assertion in the test file, which extends the example in the prompt:

```js
before = { 'a/b': 1, '~': true }
after  = { 'a/b': 2 }
```

`visit(before, after, '')`. They are not equal, and both are plain objects, so the key walk runs.

The union of own keys is `{'a/b', '~'}`. Sorting compares code units: `'a'` is U+0061 and `'~'` is U+007E, so `'a/b'` sorts first. That is why the replace is emitted before the remove.

| key | escaped segment | child pointer | in `after`? | in `before`? | action |
| --- | --- | --- | --- | --- | --- |
| `'a/b'` | `/` → `~1`, giving `a~1b` | `'' + '/' + 'a~1b'` = `/a~1b` | yes | yes | recurse into `visit(1, 2, '/a~1b')` |
| `'~'` | `~` → `~0`, giving `~0` | `/~0` | no | yes | `{op:'remove', path:'/~0'}` |

The recursion on `visit(1, 2, '/a~1b')`: not equal, and `1` is not a plain object, so it emits `{op:'replace', path:'/a~1b', value: clone(2)}`. Cloning a number gives the number.

Result `[{op:'replace',path:'/a~1b',value:2},{op:'remove',path:'/~0'}]`, asserted on line 4 of the test file.

Now the nested case on lines 9 to 11, which is the one that proves the cloning:

```js
before = Object.freeze({ x: Object.freeze({ a: 1 }) })
after  = { x: { a: 2 }, n: { v: [1] } }
```

Sorted union of keys is `['n','x']`.

| key | in `before`? | in `after`? | action | operation |
| --- | --- | --- | --- | --- |
| `'n'` | no | yes | add, with a cloned value | `{op:'add', path:'/n', value:{v:[1]}}` |
| `'x'` | yes | yes | recurse into `visit({a:1}, {a:2}, '/x')` | — |

The recursion walks the single key `'a'`, present on both sides, and recurses again into `visit(1, 2, '/x/a')`, which emits `{op:'replace', path:'/x/a', value:2}`.

Result `[{op:'add',path:'/n',value:{v:[1]}},{op:'replace',path:'/x/a',value:2}]` — `n` first because `'n' < 'x'`. The test then runs `out[0].value.v.push(2)` and asserts `after.n.v` still deep-equals `[1]`. That only holds because the add's value went through `clone`; had it been `b[key]` directly, the push would have reached into `after`.

The reference solution, as it now reads in `solutions/3441.cjs`:

```js
function solve(before, after) {
  function isPlainObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }
  function equal(a, b) {
    if (a === b) {
      return true;
    }
    if (Array.isArray(a) && Array.isArray(b)) {
      return a.length === b.length && a.every((item, index) => equal(item, b[index]));
    }
    if (isPlainObject(a) && isPlainObject(b)) {
      const keys = Object.keys(a);
      if (keys.length !== Object.keys(b).length) {
        return false;
      }
      return keys.every((key) => Object.hasOwn(b, key) && equal(a[key], b[key]));
    }
    return false;
  }
  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }
  function escapeSegment(key) {
    return key.replace(/~/g, '~0').replace(/\//g, '~1');
  }
  const ops = [];
  function visit(a, b, pointer) {
    if (equal(a, b)) {
      return;
    }
    if (!isPlainObject(a) || !isPlainObject(b)) {
      ops.push({ op: 'replace', path: pointer, value: clone(b) });
      return;
    }
    const allKeys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const key of [...allKeys].sort()) {
      const childPointer = pointer + '/' + escapeSegment(key);
      if (!Object.hasOwn(b, key)) {
        ops.push({ op: 'remove', path: childPointer });
      } else if (!Object.hasOwn(a, key)) {
        ops.push({ op: 'add', path: childPointer, value: clone(b[key]) });
      } else {
        visit(a[key], b[key], childPointer);
      }
    }
  }
  visit(before, after, '');
  return ops;
}
```

## Variations you could build

| Variation | What would change in the code |
| --- | --- |
| Descend into arrays by index | the atomic-array branch disappears and arrays join the key walk with numeric segments; index shifts after an insertion become the hard problem |
| Emit a `test` operation before each change, as JSON Patch allows | a second push alongside each existing one, carrying `clone(a[key])` |
| Apply a diff, `patch(before, ops)` | walk each pointer, unescaping `~1` before `~0` — the reverse of the escape order |
| Group all operations under a single `replace` when more than N differ | count first in a dry run, then decide; the traversal itself is unchanged |

## Pitfalls the tests are designed to catch

- **Escaping `/` before `~`.** A key of `a/b` becomes `a~1b`, and a second pass escaping `~` turns that into `a~01b`. Tilde first is the only order that works, and the test's `{'a/b':1,'~':true}` case has both characters.
- **Emitting `value: undefined` on a remove.** `assert.deepEqual` under `node:assert/strict` compares own keys, so an extra `value` key fails even when it holds `undefined`.
- **Aliasing the emitted value.** The `out[0].value.v.push(2)` assertion exists precisely to catch this.
- **Descending into arrays.** `solve([1],[1,2])` would emit an add at `/1` instead of one replace at the root.
- **Comparing objects with `===` or `JSON.stringify`.** `===` makes `[{a:1,b:2}]` and `[{b:2,a:1}]` different; `JSON.stringify` makes them different too, because it preserves insertion order. The structural `equal` is what makes that case emit nothing.
- **Walking keys in insertion order.** `solve({z:1},{a:2})` would emit the remove first and fail the ordering assertion.
- **Skipping the separator for an empty key.** `solve({'':1},{'':2})` asserts the path `'/'`, so the `'/' +` is unconditional.
- **Using `key in b` instead of `Object.hasOwn(b, key)`.** Inherited names would read as present.
- **Writing into either input.** The nested case freezes `before` and its inner object.

## Try it yourself

1. Add a `maxDepth` after which subtrees are replaced wholesale rather than descended into. Where does the check go, and what does it do to the existing assertions?
2. Write `unescapeSegment` and state the order its two replacements must run in. Explain why it is the reverse of the escape order.
3. In words: `clone` here is `JSON.parse(JSON.stringify(x))`. Name two JavaScript values for which that is not a faithful clone, and say why neither can appear in this exercise's inputs.
