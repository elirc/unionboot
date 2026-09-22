# LCS edit scripts — js-more 1869–1878

**What you practise:** the longest-common-subsequence dynamic program, and turning its table into a deterministic list of edit operations.
**Prerequisites:** two-dimensional arrays built with `Array.from`; the idea of a subsequence (not a substring); `Array.prototype.filter`/`join`; why a tie-break rule has to be written down.
**Exercises:** 1869: tie=delete; fold=false; output=ops, 1870: tie=delete; fold=true; output=ops, 1871: tie=insert; fold=false; output=ops, 1872: tie=insert; fold=true; output=ops, 1873–1876: the same four with output=common, 1877: fold=false; output=length, 1878: fold=true; output=length.

## The problem in plain words

You are given `{a, b}`, two ASCII strings. A *subsequence* of a string is what is left after deleting zero or more characters without reordering the rest: `ace` is a subsequence of `abcde`, `aec` is not. The longest common subsequence of `a` and `b` is the longest string that is a subsequence of both.

Knowing the LCS is the same as knowing how to turn `a` into `b`: keep the characters that are in the LCS, delete the other characters of `a`, insert the other characters of `b`. That list of `['keep'|'delete'|'insert', character]` pairs is the edit script, and it is what most variants return.

The prompt is explicit that this is "Not Levenshtein: substitutions are separate delete and insert". There is no `['replace', x, y]` operation. Changing one character costs a delete plus an insert.

"Policy" is three knobs. `tie` decides, when deleting and inserting lead to equally long results, which one to take — this is what makes the output deterministic. `fold` compares letters case-insensitively. `output` selects the shape: the operations, the kept characters as a string, or just how many were kept.

## The contract you must honour

Taken from `tests/1869.cjs` and its siblings, which check seven pairs against an independent recursive oracle:

```js
for (const [a, b] of [['',''],['abc',''],['','abc'],['ab','ba'],['ABC','abc'],['banana','ananas'],['abcbdab','bdcaba']])
  check({a, b}, oracle(a, b));
```

- The operation labels are exactly `'keep'`, `'delete'` and `'insert'`, lower case, and each operation is a two-element array `[label, character]`.
- A `delete` carries a character from `a`. A `keep` and an `insert` carry a character from `b`. Under `fold`, a `keep` therefore reports the *target's* case: with `a='ABC'`, `b='abc'` the operations are three keeps of `'a'`, `'b'`, `'c'`.
- The walk starts at the beginning of both strings, so operations come out in left-to-right order.
- When `a` is exhausted, everything left in `b` is inserted; when `b` is exhausted, everything left in `a` is deleted. `{a:'abc', b:''}` is three deletes, `{a:'', b:'abc'}` is three inserts, `{a:'', b:''}` is `[]`.
- `output=common` returns a string (the kept characters joined), not an array. `output=length` returns a number.
- Ties are resolved by `cfg.tie`. The oracle encodes the same rule: `const use = del.n > ins.n || (del.n === ins.n && cfg.tie === 'delete')`.
- `check` clones with `structuredClone` and finishes with `deep(input, before, 'Input must not mutate')`.
- `cfg` for 1877 and 1878 has no `tie` key at all: `{"fold":false,"output":"length"}`. `cfg.tie === 'delete'` is then `false`, so ties go to insert — which is invisible, because only the count is returned and both branches keep the same number of characters.

## Approach

1. Spread both strings into arrays of characters. `[...'abc']` gives `['a','b','c']` and behaves sensibly for multi-unit code points; the inputs here are ASCII either way.
2. Write the comparison once: `const equal = (x, y) => cfg.fold ? x.toLowerCase() === y.toLowerCase() : x === y;`. Every later decision goes through it, so the fold policy cannot be applied in one place and forgotten in another.
3. Build `dp` with `a.length + 1` rows and `b.length + 1` columns, all zero. `dp[i][j]` is the LCS length of `a.slice(i)` and `b.slice(j)`; the extra row and column are the empty-suffix base cases.
4. Fill it backwards, `i` from `a.length - 1` down to 0 and `j` likewise. If the characters are equal, `dp[i][j] = 1 + dp[i+1][j+1]`; otherwise `Math.max(dp[i+1][j], dp[i][j+1])`. Cost: O(len(a) × len(b)) time and the same in space.
5. Walk forward from `i = 0, j = 0` while either string has characters left. Equal characters are kept. Otherwise compare `dp[i+1][j]` (the value of deleting) with `dp[i][j+1]` (the value of inserting) and take the larger; on a tie, apply `cfg.tie`. When one side is exhausted only one move is legal.
6. Return per `cfg.output`.

Filling the table backwards and walking forwards is what makes the result stable: the table answers "from here on", so the walk can always take the locally best move and know it is globally optimal.

## Worked example — 1869 LCS edit scripts / scenario 1 — tie=delete; fold=false; output=ops

Take the fourth pair in the test list, `['ab','ba']`. It is the smallest case where the tie policy is visible.

`a = ['a','b']`, `b = ['b','a']`. The table (rows `i` = position in `a`, columns `j` = position in `b`; row 2 and column 2 are the empty-suffix base cases):

| `dp[i][j]` | j=0 (`'b'`) | j=1 (`'a'`) | j=2 |
| --- | --- | --- | --- |
| **i=0** (`'a'`) | 1 | 1 | 0 |
| **i=1** (`'b'`) | 1 | 0 | 0 |
| **i=2** | 0 | 0 | 0 |

Read one cell to see the rule: `dp[1][0]` compares `a[1]='b'` with `b[0]='b'` — equal, so `1 + dp[2][1] = 1`. And `dp[0][0]` compares `'a'` with `'b'` — not equal, so `max(dp[1][0], dp[0][1]) = max(1, 1) = 1`. That `max` of two equal values is the tie.

The forward walk:

| Step | `i, j` | Characters | Decision | Operation |
| --- | --- | --- | --- | --- |
| 1 | 0, 0 | `'a'` vs `'b'` | not equal; `dp[1][0] = 1`, `dp[0][1] = 1`, tie → `cfg.tie === 'delete'` | `['delete','a']` |
| 2 | 1, 0 | `'b'` vs `'b'` | equal | `['keep','b']` |
| 3 | 2, 1 | `a` exhausted | only insert is legal | `['insert','a']` |
| end | 2, 2 | — | both exhausted, loop ends | — |

Result: `[['delete','a'],['keep','b'],['insert','a']]`, with `kept = ['b']`.

The same pair under 1871 (`tie=insert`) takes the other branch at step 1 and produces `[['insert','b'],['keep','a'],['delete','b']]` — the same length, a different script. That is exactly why the policy exists.

The test never writes either literal down. It calls `check({a,b}, oracle(a,b))`, where `oracle` is a memoized recursion over the same definition, written independently of the solution. Both must agree, including on the tie.

The reference solution, as it now reads in `solutions/1869.cjs`:

```js
function lcsDiff(input) {
  const a = [...input.a];
  const b = [...input.b];
  const equal = (x, y) => (cfg.fold ? x.toLowerCase() === y.toLowerCase() : x === y);

  const dp = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      dp[i][j] = equal(a[i], b[j]) ? 1 + dp[i + 1][j + 1] : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  const ops = [];
  const kept = [];
  let i = 0;
  let j = 0;
  while (i < a.length || j < b.length) {
    const canDelete = i < a.length;
    const canInsert = j < b.length;
    if (canDelete && canInsert && equal(a[i], b[j])) {
      ops.push(['keep', b[j]]);
      kept.push(b[j]);
      i++;
      j++;
    } else if (canDelete && (!canInsert || dp[i + 1][j] > dp[i][j + 1] || (dp[i + 1][j] === dp[i][j + 1] && cfg.tie === 'delete'))) {
      ops.push(['delete', a[i]]);
      i++;
    } else {
      ops.push(['insert', b[j]]);
      j++;
    }
  }

  if (cfg.output === 'length') return kept.length;
  if (cfg.output === 'common') return kept.join('');
  return ops;
}
```

## Policy matrix — what changes between the variants

| ID | Variant | Semantic key | What differs in the code |
| --- | --- | --- | --- |
| 1869 | tie=delete; fold=false; output=ops | `{"fold":false,"output":"ops","tie":"delete"}` | baseline: `equal` is `===`; ties take the delete branch; returns `ops` |
| 1870 | tie=delete; fold=true; output=ops | `{"fold":true,"output":"ops","tie":"delete"}` | `equal` lower-cases both sides before comparing |
| 1871 | tie=insert; fold=false; output=ops | `{"fold":false,"output":"ops","tie":"insert"}` | `cfg.tie === 'delete'` is false, so a tie falls through to the insert branch |
| 1872 | tie=insert; fold=true; output=ops | `{"fold":true,"output":"ops","tie":"insert"}` | both of the above |
| 1873 | tie=delete; fold=false; output=common | `{"fold":false,"output":"common","tie":"delete"}` | returns `kept.join('')` instead of `ops` |
| 1874 | tie=delete; fold=true; output=common | `{"fold":true,"output":"common","tie":"delete"}` | folded compare, `kept.join('')` — note `kept` holds b's characters |
| 1875 | tie=insert; fold=false; output=common | `{"fold":false,"output":"common","tie":"insert"}` | insert tie, `kept.join('')` |
| 1876 | tie=insert; fold=true; output=common | `{"fold":true,"output":"common","tie":"insert"}` | insert tie, folded compare, `kept.join('')` |
| 1877 | fold=false; output=length | `{"fold":false,"output":"length"}` | returns `kept.length`; no `tie` key, so ties go to insert and are unobservable |
| 1878 | fold=true; output=length | `{"fold":true,"output":"length"}` | folded compare, returns `kept.length` |

## Pitfalls the tests are designed to catch

- **Reporting a kept character from `a`.** With `fold=true` and `a='ABC'`, `b='abc'`, pushing `a[i]` gives `[['keep','A'],…]` while the oracle gives `[['keep','a'],…]`. The prompt states it: "when equal always keep target character".
- **Applying `fold` in the table but not in the walk (or the reverse).** The table and the walk must use the same `equal`, or the walk will disagree with the lengths it is reading.
- **Emitting a `replace` operation.** A substitution is a delete followed by an insert. The oracle never produces any other label.
- **Leaving the tie to chance.** `dp[i+1][j] >= dp[i][j+1]` is *not* the same as the policy: it hard-codes delete. With `cfg.tie === 'insert'` the pair `['ab','ba']` must come out as insert-first.
- **Walking the table backwards.** Filling backwards and walking backwards would produce a reversed, and generally different, script. The oracle builds its operations front-to-back from index 0.
- **Returning an array for `output=common`.** It is a joined string. `['b']` is not `'b'` under `assert.deepEqual` from `node:assert/strict`.
- **Stopping the loop when either index runs out.** The condition is `i < a.length || j < b.length` — the tail of the longer string still has to be deleted or inserted. Using `&&` silently drops it, which `{a:'abc', b:''}` catches.
- **Mutating the input.** `input.a` and `input.b` are strings and cannot be mutated, but `check` still deep-compares the whole input object afterwards.

## Checking your work

```text
node js-more/verify.cjs --id=1869
node js-more/verify.cjs --starters --id=1869
```

Hand-check `['ab','ba']` under your own `cfg.tie` before running: it is three operations, and which one comes first tells you whether your tie-break is wired up.

## Try it yourself

1. The table needs O(len(a) × len(b)) memory. Rewrite the length-only variants (1877, 1878) to keep just two rows. What do you lose, and why does it not matter for those two IDs?
2. Add a policy `tie='shorter-first'` that prefers whichever of delete/insert leaves less total work. Is it well defined? Write down a pair where it differs from both existing policies, or explain why none exists.
3. Change `output` to `'diff'`, producing unified-diff-style lines (`' b'`, `'-a'`, `'+a'`). Which part of the code changes?
4. In words: `'ABC'` against `'abc'` gives six operations with `fold=false` and three with `fold=true`. Explain why the LCS length changes from 0 to 3 without a single character changing.
