# Persistent versioned stacks — js-more 1849–1858

**What you practise:** building an immutable (persistent) linked stack where every operation appends a new version and every old version stays readable, with no copying.
**Prerequisites:** singly linked nodes (`{value, next}`); the difference between reassigning a variable and mutating an object; `Object.freeze`; `??` versus `||`.
**Exercises:** 1849: view=top; empty=empty, 1850: view=top; empty=error, 1851: view=bottom; empty=empty, 1852: view=bottom; empty=error, 1853: view=size; empty=empty, 1854: view=size; empty=error, 1855: view=peek; empty=empty, 1856: view=peek; empty=error, 1857: view=last-two; empty=empty, 1858: view=last-two; empty=error.

## The problem in plain words

The input is a flat array of operations. Each operation names a *version* — a number — and does something relative to it. Version 0 exists before you start and is the empty stack. `{type:'push', version, value}` appends a new version that is the named version with one more item on top. `{type:'pop', version}` appends a new version that is the named version with its top item removed. `{type:'read', version}` appends nothing; it records one answer about the named version.

The word "persistent" here does not mean "saved to disk". It means that a version, once created, never changes. Version 2 is still version 2 after version 7 has been built out of it. That also means operations can *branch*: two pushes onto version 1 produce two different versions that both continue from version 1, like two commits on top of the same parent.

The return value is `{versions: <how many versions exist>, queries: <the read answers, in order>}`. The version count includes version 0, so an empty input returns `{versions:1, queries:[]}`.

"Policy" in this family is two independent knobs. `view` decides what a read reports about a version — the whole stack top-first, the whole stack bottom-first, its size, just the top value, or the top two values. `empty` decides what popping an already empty version does: quietly produce another empty version, or throw.

## The contract you must honour

Taken from `tests/1849.cjs` and its siblings:

- `solve([])` returns `{versions:1, queries:[]}`. Version 0 always counts.
- A version number must be an integer in range. `assert.throws(()=>solve([{type:'read',version:9}]),/Unknown version/)` — the message must contain `Unknown version`, and the reference throws `new RangeError('Unknown version')`.
- `queries` holds one entry per `read`, in the order the reads appeared.
- With `empty=empty` (1849, 1851, 1853, 1855, 1857) the test asserts `check([{type:'pop',version:0}],{versions:2,queries:[]})`: popping the empty version 0 still appends a version.
- With `empty=error` (1850, 1852, 1854, 1856, 1858) the same input asserts `assert.throws(()=>solve([{type:'pop',version:0}]),/Empty stack/)`. The reference throws `new RangeError('Empty stack')`.
- The read shapes, one per `view`: `top` is an array of values, top first; `bottom` is the same array reversed; `size` is a number; `peek` is the top value, or `null` for an empty version; `last-two` is an array of at most the top two values.
- Every case runs through `check(input, expected)`, which takes `structuredClone(input)` first and finishes with `deep(input, before, 'Input must not mutate')`. You may read `op.version` and `op.value`, never write to them.
- Values are non-null JSON primitives, so `values[0] ?? null` is only ever `null` for a missing element, never for a stored `null`.
- The prompt adds a requirement no test can see: "Implement immutable linked nodes with structural sharing." The `CONTRACT` section says plainly that "Algorithmic complexity/structural sharing requirements also need source review". A version that copies an array on every push produces the same answers and passes; it is still the wrong answer to this exercise.

## Approach

1. Keep `versions`, an array whose element *i* is the head node of version *i*. Version 0 is `null`, which is how an empty stack is spelled.
2. For each operation, validate `op.version` first: `Number.isInteger(op.version) && op.version >= 0 && op.version < versions.length`. Anything else is `RangeError('Unknown version')`. Note the upper bound is the *current* length, so an operation cannot refer forward to a version that does not exist yet.
3. `push`: create one node, `{value: op.value, next: head, size: (head?.size || 0) + 1}`, and append it. The old head is reused as the tail — this is the structural sharing. `Object.freeze` makes the "never changes" promise enforced rather than merely intended.
4. `pop`: the new version is `head.next`, which is a node that already exists. Removing an item allocates nothing at all. If `head` is `null`, apply the `empty` policy.
5. `read`: walk from the head along `next`, collecting values into a local array — that gives you top-first order — then shape it according to `view`.
6. Return `{versions: versions.length, queries}`.

Cost: a push and a pop are O(1) in time and space. A read is O(k) in the size of that version, which is unavoidable for the `top`, `bottom` and `last-two` views. Each node caches `size`, so a `size` view could be O(1); the reference still walks the list, which is honest but not optimal — see "Try it yourself".

## Worked example — 1849 Persistent versioned stacks / scenario 1 — view=top; empty=empty

`tests/1849.cjs` builds this operation list (quoted from the file, reformatted):

```js
const ops = [
  {type:'push', version:0, value:'a'},
  {type:'push', version:1, value:'b'},
  {type:'push', version:1, value:'branch'},
  {type:'push', version:2, value:'c'},
  {type:'pop',  version:4},
  {type:'read', version:4},
  {type:'read', version:2},
  {type:'read', version:3},
  {type:'read', version:5},
  {type:'read', version:0}
];
```

Trace. "Head" is the node stored in `versions`; `→` is the `next` pointer.

| Step | Operation | New version | Head after | Shares with |
| --- | --- | --- | --- | --- |
| start | — | 0 | `null` | — |
| 1 | push `'a'` onto 0 | 1 | `a→null` | — |
| 2 | push `'b'` onto 1 | 2 | `b→a` | node `a` of version 1 |
| 3 | push `'branch'` onto 1 | 3 | `branch→a` | the same node `a` |
| 4 | push `'c'` onto 2 | 4 | `c→b→a` | the whole of version 2 |
| 5 | pop version 4 | 5 | `b→a` | version 2's head, reused exactly |

Five pushes and pops later there are six versions and exactly four nodes in memory (`a`, `b`, `branch`, `c`). Step 3 is the branch: versions 2 and 3 are different stacks that share their bottom item. Step 5 is the part that surprises people — popping created no node at all, and version 5's head *is* version 2's head.

Now the reads, with `view=top` (walk from the head, collect, return as is):

| Step | Operation | Walk | Query pushed |
| --- | --- | --- | --- |
| 6 | read 4 | `c`, `b`, `a` | `['c','b','a']` |
| 7 | read 2 | `b`, `a` | `['b','a']` |
| 8 | read 3 | `branch`, `a` | `['branch','a']` |
| 9 | read 5 | `b`, `a` | `['b','a']` |
| 10 | read 0 | head is `null` | `[]` |

Expected output: `{versions: 6, queries: [['c','b','a'],['b','a'],['branch','a'],['b','a'],[]]}`.

The test does not spell that literal out. It builds it with an independent oracle that models each version as a plain array (`versions.push([op.value,...a])` for a push, `a.slice(1)` for a pop) and then calls `check(ops, {versions: versions.length, queries})`. The oracle copies on every operation; your solution must not. Both must agree on the answers.

The reference solution, as it now reads in `solutions/1849.cjs`:

```js
function persistentStacks(input) {
  const versions = [null];
  const queries = [];

  function readView(head) {
    const values = [];
    for (let at = head; at; at = at.next) {
      values.push(at.value);
    }
    if (cfg.view === 'bottom') return values.reverse();
    if (cfg.view === 'size') return values.length;
    if (cfg.view === 'peek') return values[0] ?? null;
    if (cfg.view === 'last-two') return values.slice(0, 2);
    return values;
  }

  for (const op of input) {
    if (!Number.isInteger(op.version) || op.version < 0 || op.version >= versions.length) {
      throw new RangeError('Unknown version');
    }
    const head = versions[op.version];
    if (op.type === 'push') {
      versions.push(Object.freeze({ value: op.value, next: head, size: (head?.size || 0) + 1 }));
    } else if (op.type === 'pop') {
      if (!head && cfg.empty === 'error') {
        throw new RangeError('Empty stack');
      }
      versions.push(head ? head.next : null);
    } else if (op.type === 'read') {
      queries.push(readView(head));
    } else {
      throw new Error('Unknown operation');
    }
  }

  return { versions: versions.length, queries };
}
```

## Policy matrix — what changes between the variants

`cfg` is the decoded `Semantic key` from the prompt. Only `readView` and the `pop` branch look at it.

| ID | Variant | Semantic key | What differs in the code |
| --- | --- | --- | --- |
| 1849 | view=top; empty=empty | `{"empty":"empty","view":"top"}` | `readView` falls through to `return values`; `pop` on `null` appends `null` |
| 1850 | view=top; empty=error | `{"empty":"error","view":"top"}` | same read; `pop` on `null` throws `RangeError('Empty stack')` |
| 1851 | view=bottom; empty=empty | `{"empty":"empty","view":"bottom"}` | `readView` returns `values.reverse()` |
| 1852 | view=bottom; empty=error | `{"empty":"error","view":"bottom"}` | `values.reverse()` plus the throwing `pop` |
| 1853 | view=size; empty=empty | `{"empty":"empty","view":"size"}` | `readView` returns `values.length` — a number, not an array |
| 1854 | view=size; empty=error | `{"empty":"error","view":"size"}` | `values.length` plus the throwing `pop` |
| 1855 | view=peek; empty=empty | `{"empty":"empty","view":"peek"}` | `readView` returns `values[0] ?? null` |
| 1856 | view=peek; empty=error | `{"empty":"error","view":"peek"}` | `values[0] ?? null` plus the throwing `pop` |
| 1857 | view=last-two; empty=empty | `{"empty":"empty","view":"last-two"}` | `readView` returns `values.slice(0, 2)` |
| 1858 | view=last-two; empty=error | `{"empty":"error","view":"last-two"}` | `values.slice(0, 2)` plus the throwing `pop` |

Read down the table: the two knobs are independent, so the family is five read shapes times two empty-pop rules.

## Pitfalls the tests are designed to catch

- **Copying instead of sharing.** `versions.push([op.value, ...versions[op.version]])` passes every assertion, because the oracle does exactly that. It fails the prompt's "immutable linked nodes with structural sharing", which the `CONTRACT` section says is checked by source review.
- **Mutating a shared node.** Once two versions point at the same node, writing `node.value` or `node.next` rewrites history for both. `Object.freeze` in the reference turns that mistake into a silent no-op in sloppy mode and a `TypeError` under `'use strict';`, which every file in this track is.
- **Reversing in place for the `bottom` view.** `values` is a fresh array built by the walk, so `values.reverse()` is safe. `input`-derived arrays are not: every case ends with `deep(input, before, 'Input must not mutate')`.
- **Treating version numbers as "the last version".** Every operation names its version explicitly. Step 3 of the trace pushes onto version 1, not onto version 2, and the branch is the whole point.
- **Off-by-one in the version check.** `op.version >= versions.length` must be evaluated *before* this operation appends anything, otherwise an operation could legally refer to the version it is about to create.
- **Using `||` instead of `??` for `peek`.** With `values[0] || null`, a stored `0` or `''` would be reported as `null`. The prompt says values are non-null JSON primitives, which includes `0` and `''`.
- **Throwing the wrong error for an empty pop.** The assertion is `/Empty stack/`; `RangeError('Empty stack')` matches, `Error('Stack is empty')` does not.
- **Returning the node objects from a read.** `queries` must hold values, not `{value,next,size}` records. The walk collects `at.value`.

## Checking your work

```text
node js-more/verify.cjs --id=1849
node js-more/verify.cjs --starters --id=1849
```

Two things to check by eye, because no assertion will:

- Count the allocations in your `push`. It should be one object. If a loop or a spread appears, you are copying.
- Look at your `pop`. It should allocate nothing.

## Try it yourself

1. Each node already caches `size`. Rewrite the `size` view to return `head?.size ?? 0` and confirm the tests still pass. Which views can *not* be made O(1) this way, and why?
2. Add a `view` of `'depth-of'` that reports how many versions share the current head node. What extra bookkeeping would you need, and where would it live?
3. Add an operation `{type:'merge', a, b}` that appends a version holding version `a`'s items on top of version `b`'s. Can it still share structure with both inputs? With either?
4. In words: version 5 in the worked example is the same object as version 2's head. Describe an observable difference a caller could detect between "the same node" and "an equal copy", given that every node is frozen.
