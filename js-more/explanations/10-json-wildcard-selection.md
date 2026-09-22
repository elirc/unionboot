# JSON wildcard selection — js-more 1809–1818

**What you practise:** evaluating a path expression over a JSON value one segment at a time, expanding `*` wildcards over own properties only, and applying a missing-key policy.
**Prerequisites:** `Object.keys` versus `in` versus `Object.prototype.hasOwnProperty.call`; why `typeof null === 'object'`; arrays as objects with numeric string keys; [02 Ranked trie autocomplete](02-ranked-trie-autocomplete.md) for level-by-level traversal.
**Exercises:** 1809: order=forward; missing=skip; output=all, 1810: order=forward; missing=null; output=all, 1811: order=forward; missing=error; output=all, 1812: order=reverse; missing=skip; output=all, 1813: order=reverse; missing=null; output=all, 1814: order=reverse; missing=error; output=all, 1815: order=forward; missing=skip; output=first, 1816: order=forward; missing=null; output=first, 1817: order=reverse; missing=skip; output=first, 1818: order=reverse; missing=null; output=first.

## The problem in plain words

The input is `{value, path}`. `value` is any JSON value — an object, an array, a string, a number, `null`. `path` is an array of tokens; each token is either a literal property name or the string `'*'`.

Walk the path from the root. At each step you have a *set* of values, not one value, because a wildcard can fan out. A literal token narrows each value in the set to one property; a `'*'` expands each value in the set to all of its own property values. After the last token, report what is left.

That set-at-a-time shape is what makes the implementation a loop rather than a recursion: `nodes` starts as `[input.value]`, and each token replaces `nodes` wholesale.

"Policy" is three knobs. `order` decides whether a wildcard expands keys in `Object.keys` order or reversed. `missing` decides what a literal token does when the property is not there: `skip` drops that branch, `null` substitutes `null` and carries on, `error` throws `Error('Missing path')`. `output` decides whether you get every surviving value or just the first, with `null` when nothing survives.

Two rules from the prompt constrain what counts as "there". "No prototype traversal": only own properties, so the token `'toString'` finds nothing on a plain object. And "primitives have no wildcard children": a `'*'` over a string or a number contributes nothing, and it does *not* count as a missing key.

## The contract you must honour

Taken from `prompts/1809.txt` and `tests/1809.cjs`:

- An empty path selects the root: `solve({value, path: []})` returns `[value]` under `output: 'all'`, and the value itself under `output: 'first'`.
- Under `output: 'all'` the return value is an array, possibly empty. Under `output: 'first'` it is a single value, and `null` when nothing survived — the test writes its expectation as `expected[0] ?? null`.
- Lookups use own properties. The test's `oracle` uses `Object.hasOwn(value, token)`; the reference uses `Object.prototype.hasOwnProperty.call(value, token)`. Both reject inherited members, which is why the route `['toString']` produces nothing found.
- `null` is not a container. `typeof null === 'object'`, so the guard has to be `value !== null && typeof value === 'object'`. The test's value has a property `n: null`, and the route `['n','x']` exercises exactly that: `'n'` is found, then `'x'` is looked up on `null`.
- A `'*'` over a non-container contributes nothing and never triggers `cfg.missing`. The reference's `if (token === '*')` branch has no `else` reaching the missing-key handling.
- `missing: 'error'` throws `Error('Missing path')`. The test detects it by running its own oracle first and, if that throws, asserting `assert.throws(()=>solve({value,path:route}),/Missing path/)`.
- `check` clones the input and asserts `'Input must not mutate'`. Values are re-collected, never copied or written; `Object.keys` returns a fresh array, so `keys.reverse()` is safe.

## Approach

1. `let nodes = [input.value]`.
2. For each `token` of `input.path`, build a fresh `next` array and then assign `nodes = next`. Building a new array rather than mutating in place is what keeps a wildcard from expanding into the very array you are iterating.
3. For each `value` in `nodes`, compute `isContainer` once: `value !== null && typeof value === 'object'`. Arrays satisfy it — `Object.keys([1,2])` is `['0','1']`, so array elements come out in index order.
4. If the token is `'*'`: when `isContainer`, take `Object.keys(value)`, reverse it if `cfg.order === 'reverse'`, and push each `value[key]`. When it is not a container, push nothing.
5. Otherwise the token is a literal. If `isContainer` and the property is an own property, push `value[token]`. Else apply `cfg.missing`: push `null`, throw `Error('Missing path')`, or do nothing for `skip`.
6. After the loop, project with `cfg.output`.

Each token touches every currently selected value once, so the cost is the total size of the intermediate sets. A path of all wildcards over a deep object visits every node once per level, which is the same work a recursive descent would do — the difference is only that the recursion is flattened into the `nodes` list.

## Worked example — 1809 JSON wildcard selection / scenario 1

The hand-written value and route list, quoted from the last line of `tests/1809.cjs`:

```js
const value={users:[{name:'A',score:0},{name:'B'},{name:'C',score:4}],empty:[],n:null};
for(const route of [[],['users','*','name'],['users','*','score'],['n','x'],['missing'],['empty','*'],['toString']])
```

With `cfg = {"missing":"skip","order":"forward","output":"all"}`, take the third route, `['users','*','score']` — it is the one that uses all three policy knobs' worth of behaviour.

| Token | `nodes` on entry | What happens to each value | `nodes` after |
| --- | --- | --- | --- |
| `'users'` | `[value]` | `value` is a container with an own `users`; push the array | `[[{name:'A',score:0},{name:'B'},{name:'C',score:4}]]` |
| `'*'` | that one array | container; `Object.keys` is `['0','1','2']`; push all three elements | `[{name:'A',score:0}, {name:'B'}, {name:'C',score:4}]` |
| `'score'` | those three | first has own `score` → push `0`; second has none → `skip` drops it; third → push `4` | `[0, 4]` |

The return value is `[0, 4]`. The value `0` surviving matters: it is falsy, and a `hasOwnProperty` check is the only lookup that distinguishes "the property is there and holds 0" from "the property is not there".

The full route table for scenario 1:

| Route | Result | Why |
| --- | --- | --- |
| `[]` | `[value]` | no tokens, so `nodes` is untouched |
| `['users','*','name']` | `['A','B','C']` | every element has a `name`; forward order is index order |
| `['users','*','score']` | `[0,4]` | `{name:'B'}` has no `score`, and `skip` drops it |
| `['n','x']` | `[]` | `'n'` is found and gives `null`; `null` is not a container, so `'x'` misses and is skipped |
| `['missing']` | `[]` | no own property `missing` on the root |
| `['empty','*']` | `[]` | `empty` is found; it is a container, but `Object.keys([])` is `[]` |
| `['toString']` | `[]` | `toString` is inherited from `Object.prototype`, not an own property |

The last two rows look the same from outside and are not the same inside. `['empty','*']` never reaches the missing-key handling at all — a wildcard over a container with no keys simply contributes nothing. `['toString']` *does* reach it, and only `cfg.missing` being `skip` makes the two agree. Under 1811 (`missing: 'error'`) they part: `['empty','*']` still returns `[]`, while `['toString']` throws `Error('Missing path')`.

**The same routes under the other policies.**

| Route | 1809 skip/forward/all | 1810 null/forward/all | 1811 error/forward/all | 1812 skip/reverse/all | 1815 skip/forward/first |
| --- | --- | --- | --- | --- | --- |
| `[]` | `[value]` | `[value]` | `[value]` | `[value]` | `value` |
| `['users','*','name']` | `['A','B','C']` | `['A','B','C']` | `['A','B','C']` | `['C','B','A']` | `'A'` |
| `['users','*','score']` | `[0,4]` | `[0,null,4]` | throws | `[4,0]` | `0` |
| `['n','x']` | `[]` | `[null]` | throws | `[]` | `null` |
| `['missing']` | `[]` | `[null]` | throws | `[]` | `null` |
| `['empty','*']` | `[]` | `[]` | `[]` | `[]` | `null` |
| `['toString']` | `[]` | `[null]` | throws | `[]` | `null` |

Read the `['users','*','score']` row across: `skip` gives two values, `null` gives three with the gap marked, `error` refuses the whole query. Read the `['users','*','name']` row across: only `order` moves it, and only because a wildcard was involved.

The reference solution, as it now reads in `solutions/1809.cjs`:

```js
function jsonSelection(input) {
  let nodes = [input.value];
  for (const token of input.path) {
    const next = [];
    for (const value of nodes) {
      const isContainer = value !== null && typeof value === 'object';
      if (token === '*') {
        if (isContainer) {
          const keys = Object.keys(value);
          if (cfg.order === 'reverse') keys.reverse();
          for (const key of keys) next.push(value[key]);
        }
      } else if (isContainer && Object.prototype.hasOwnProperty.call(value, token)) {
        next.push(value[token]);
      } else if (cfg.missing === 'null') {
        next.push(null);
      } else if (cfg.missing === 'error') {
        throw new Error('Missing path');
      }
    }
    nodes = next;
  }
  if (cfg.output === 'count') return nodes.length;
  if (cfg.output === 'first') return nodes.length ? nodes[0] : null;
  return nodes;
}
```

The `cfg.output === 'count'` branch is dead in all ten scenarios of this family — none of them sets `output` to `count` — but it ships in every file because the same body is generated for the whole family.

## Policy matrix — what changes between the variants

Three knobs, but only ten of the eighteen combinations exist: `missing: 'error'` is paired only with `output: 'all'`.

| ID | Variant | What differs in the prompt | What differs in the code |
| --- | --- | --- | --- |
| 1809 | order=forward; missing=skip; output=all | `{"missing":"skip","order":"forward","output":"all"}` | keys in `Object.keys` order; a miss pushes nothing; returns `nodes` |
| 1810 | order=forward; missing=null; output=all | `…"missing":"null"` | a miss pushes `null` and the branch keeps walking |
| 1811 | order=forward; missing=error; output=all | `…"missing":"error"` | a miss throws `Error('Missing path')` |
| 1812 | order=reverse; missing=skip; output=all | `…"order":"reverse"` | `keys.reverse()` before expanding a wildcard |
| 1813 | order=reverse; missing=null; output=all | `…"order":"reverse","missing":"null"` | reversed expansion, `null` for a miss |
| 1814 | order=reverse; missing=error; output=all | `…"order":"reverse","missing":"error"` | reversed expansion, throws on a miss |
| 1815 | order=forward; missing=skip; output=first | `…"output":"first"` | returns `nodes.length ? nodes[0] : null` |
| 1816 | order=forward; missing=null; output=first | `…"missing":"null","output":"first"` | `null` for a miss, then first-or-`null` |
| 1817 | order=reverse; missing=skip; output=first | `…"order":"reverse","output":"first"` | reversed expansion, then first-or-`null` |
| 1818 | order=reverse; missing=null; output=first | `…"order":"reverse","missing":"null","output":"first"` | reversed expansion, `null` for a miss, first-or-`null` |

`order` only ever matters when the path contains a `'*'` and the expanded container has more than one key. `missing` only ever matters for a literal token. `output` is applied once, after the whole walk.

Note how `missing: 'null'` interacts with `output: 'first'`: under 1816 the route `['missing']` yields `[null]`, whose first element is `null` — the same answer 1815 gives from an empty list, by a different path through the code.

## Pitfalls the tests are designed to catch

- **Using `in` or plain property access.** `'toString' in value` is `true` for any plain object, so the `['toString']` route would return the inherited function. The prompt says "own-property string tokens" and "No prototype traversal".
- **Treating `null` as a container.** `typeof null === 'object'`, so `typeof value === 'object'` alone lets `['n','x']` try to read a property off `null`. The reference guards with `value !== null &&`.
- **Treating a missing wildcard target as a missing key.** A `'*'` over a primitive or over `null` contributes nothing and must not throw under 1811 or push `null` under 1810. Only a literal token consults `cfg.missing`.
- **Dropping falsy values.** `if (value[token]) next.push(value[token])` loses the `score: 0` on user A, which the `[0,4]` expectation catches immediately.
- **Reversing a shared array.** `Object.keys` returns a fresh array each call, so `keys.reverse()` is safe. Reversing something taken from the input — say `input.path` — would fail `'Input must not mutate'`.
- **Recursing depth-first and expecting the same order.** For `['users','*','name']` a depth-first walk and this level-by-level walk agree, because each level of the path is applied to every node before the next. Mixing the two — applying the remaining tokens to one branch before expanding the next — changes the order once more than one wildcard is present.
- **Returning `undefined` for `output: 'first'` on an empty result.** The expectation is `expected[0] ?? null`, so the answer is `null`.
- **Returning a bare value for `output: 'all'` when only one thing survives.** `all` always returns an array, including `[value]` for the empty path.
- **Copying the selected values.** The prompt says preserve inputs, not clone outputs; the reference returns the same object references that live inside `input.value`.

## Try it yourself

1. Add a `missing=throwPath` policy whose error message names the token that failed. What extra state does the loop need, and does it survive a wildcard fan-out?
2. Add a `'**'` token meaning recursive descent. The prompt currently forbids it — write it anyway, and say why it cannot be expressed as one pass over `nodes` the way `'*'` can.
3. Make the function also return the path actually taken to each surviving value. Which of the two loops has to carry it?
4. In words: `['empty','*']` and `['toString']` both return `[]` under 1809 but only one of them throws under 1811. Explain the difference in terms of which branch of the `if` chain each one reaches.
