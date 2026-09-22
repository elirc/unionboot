# KMP substring matches — js-more 1779–1788

**What you practise:** the Knuth-Morris-Pratt prefix function, a single left-to-right scan that never backtracks over the text, and five different projections of the same hit list.
**Prerequisites:** string indexing and `String.prototype.slice`; `Array(n).fill(0)`; the `??` operator; [02 Ranked trie autocomplete](02-ranked-trie-autocomplete.md) for "the prompt names the structure even when the test cannot see it".
**Exercises:** 1779: output=all; fold=false, 1780: output=all; fold=true, 1781: output=disjoint; fold=false, 1782: output=disjoint; fold=true, 1783: output=first; fold=false, 1784: output=first; fold=true, 1785: output=last; fold=false, 1786: output=last; fold=true, 1787: output=count; fold=false, 1788: output=count; fold=true.

## The problem in plain words

The input is `{text, pattern}`, both ASCII strings. Find where `pattern` occurs inside `text` and report the occurrences according to the policy.

The naive way is to try every starting offset and compare character by character, which costs O(n·m) in the worst case — a text of a million `a`s and a pattern of a thousand `a`s makes that concrete. KMP gets it down to O(n+m) by precomputing, for each position of the pattern, how far back it can fall on a mismatch without missing anything.

That precomputed table is the *prefix function*. `prefix[i]` is the length of the longest proper prefix of `pattern[0..i]` that is also a suffix of it. For `ababd` it is `[0,0,1,2,0]`: after matching `abab`, the first two characters `ab` are also the last two, so a mismatch at the fifth character can resume with two characters already matched instead of starting over.

"Policy" is two knobs. `fold` lower-cases both strings before searching, making the match case-insensitive. `output` picks what to return: `all` gives every offset including overlapping ones, `disjoint` skips past each match so occurrences cannot overlap, `first` and `last` give a single index or `-1`, and `count` gives a number.

The empty pattern is a deliberate edge case: it matches at every boundary from `0` to `text.length` inclusive, in every mode — including `disjoint`.

## The contract you must honour

Taken from `prompts/1779.txt` and `tests/1779.cjs`:

- The return type depends on `cfg.output`: an array of numbers for `all` and `disjoint`, a single number for `first`, `last` and `count`.
- `first` and `last` return `-1` when there is no match, not `null` and not `undefined`. The reference uses `hits[0] ?? -1` and `hits.at(-1) ?? -1`.
- Indices are UTF-16 offsets — the position in the string as JavaScript indexes it.
- The empty pattern matches every boundary `0..text.length`. The test runs `{text:'',pattern:''}` and `{text:'abc',pattern:''}`, which under `output: 'all'` assert `[0]` and `[0,1,2,3]`.
- `disjoint` "greedily skips consumed pattern": after a match at offset `i`, the next search resumes at `i + pattern.length`. The oracle does this with `i += p.length - 1` inside a `for` loop that also increments.
- `fold: false` means exact case. The test's `{text:'ABabaBa',pattern:'aba'}` is the case that separates the two settings.
- `check` clones the input and asserts `'Input must not mutate'`. Strings are immutable in JavaScript, so this is satisfied as long as you do not write new properties onto the input object.
- The prompt says "KMP search". The test's `oracle` is a plain `slice`-and-compare loop that agrees on every one of the seven cases, so the test cannot tell the two apart. The CONTRACT section covers this: "Algorithmic complexity/structural sharing requirements also need source review". The O(n+m) property is a requirement of the exercise even though it is not asserted.

## Approach

1. Apply `cfg.fold` first: `const text = cfg.fold ? input.text.toLowerCase() : input.text`, same for the pattern. Everything downstream works on these locals, so `input` is never touched.
2. Handle the empty pattern before anything else: `hits = Array.from({length: text.length + 1}, (_, i) => i)`. This has to be special-cased because the search loop below can never set `j === pattern.length` when `pattern.length` is `0`, and because `disjoint` would otherwise try to skip zero characters forever.
3. Build the prefix array. Walk `i` from 1 to the end of the pattern with a second cursor `j` holding the current border length. On a mismatch, fall back with `j = prefix[j-1]` until either `j` is 0 or the characters agree; if they agree, `j++`. Store `prefix[i] = j`.
4. Search. Walk `i` over the text with the same falling-back `j`. When `j` reaches `pattern.length`, a match ends at `i`, so it started at `i - j + 1`; push that.
5. After a match, set `j` for the next round: `0` under `disjoint`, so the next occurrence cannot overlap, or `prefix[j-1]` otherwise, so an overlapping occurrence is still found.
6. Project the hit list according to `cfg.output`.

The text cursor `i` only ever increases. `j` only decreases via the prefix table, and each decrease is paid for by an earlier increase, so the total work in both loops is linear: O(m) to build the table, O(n) to scan. That is the O(n+m) the prompt asks for.

## Worked example — 1779 KMP substring matches / scenario 1

`tests/1779.cjs` runs seven hand-written inputs through the same `check`, each compared against the in-test `oracle`:

```js
for(const input of [{text:'',pattern:''},{text:'abc',pattern:''},{text:'ABabaBa',pattern:'aba'},{text:'aaaaa',pattern:'aa'},{text:'ababcababd',pattern:'ababd'},{text:'a',pattern:'long'},{text:'abc',pattern:'z'}])check(input,oracle(input));
```

**The fifth input, `{text:'ababcababd',pattern:'ababd'}`**, is the one that shows why KMP exists.

Building the prefix array for `ababd`:

| `i` | `j` on entry | `pattern[i]` vs `pattern[j]` | Action | `prefix[i]` |
| --- | --- | --- | --- | --- |
| 1 | 0 | `b` vs `a` | `j` is 0, no fallback possible; no match | 0 |
| 2 | 0 | `a` vs `a` | match, `j` becomes 1 | 1 |
| 3 | 1 | `b` vs `b` | match, `j` becomes 2 | 2 |
| 4 | 2 | `d` vs `a` | mismatch, fall back `j = prefix[1] = 0`; `d` vs `a` still no | 0 |

So `prefix = [0,0,1,2,0]`.

Now the scan over `ababcababd` (indices 0–9):

| `i` | char | `j` on entry | What happens | `j` after |
| --- | --- | --- | --- | --- |
| 0 | `a` | 0 | matches `pattern[0]` | 1 |
| 1 | `b` | 1 | matches `pattern[1]` | 2 |
| 2 | `a` | 2 | matches `pattern[2]` | 3 |
| 3 | `b` | 3 | matches `pattern[3]` | 4 |
| 4 | `c` | 4 | mismatch: `j = prefix[3] = 2`; `c` vs `pattern[2]='a'` mismatch: `j = prefix[1] = 0`; `c` vs `a` no | 0 |
| 5 | `a` | 0 | matches | 1 |
| 6 | `b` | 1 | matches | 2 |
| 7 | `a` | 2 | matches | 3 |
| 8 | `b` | 3 | matches | 4 |
| 9 | `d` | 4 | matches; `j === 5 === pattern.length` → push `9 - 5 + 1 = 5`; `j = prefix[4] = 0` | 0 |

`hits` is `[5]`, and with `output: 'all'` that is the return value. The important row is `i = 4`. The text cursor does not move back to 1 and start again; it stays at 4 while `j` falls from 4 to 2 to 0. A naive search would have restarted at offsets 1, 2, 3 and 4 in turn.

**The fourth input, `{text:'aaaaa',pattern:'aa'}`**, is the one that separates `all` from `disjoint`. `prefix` for `aa` is `[0,1]`.

Under `output: 'all'` (1779), after a match `j` becomes `prefix[1] = 1`, so one character stays matched and the next text character completes another occurrence:

| `i` | `j` on entry | Result | `j` after |
| --- | --- | --- | --- |
| 0 | 0 | match char, `j = 1` | 1 |
| 1 | 1 | `j` reaches 2 → push `0` | 1 |
| 2 | 1 | `j` reaches 2 → push `1` | 1 |
| 3 | 1 | `j` reaches 2 → push `2` | 1 |
| 4 | 1 | `j` reaches 2 → push `3` | 1 |

`hits` is `[0,1,2,3]`.

Under `output: 'disjoint'` (1781), the only change is `j = 0` after a push:

| `i` | `j` on entry | Result | `j` after |
| --- | --- | --- | --- |
| 0 | 0 | `j = 1` | 1 |
| 1 | 1 | `j` reaches 2 → push `0` | 0 |
| 2 | 0 | `j = 1` | 1 |
| 3 | 1 | `j` reaches 2 → push `2` | 0 |
| 4 | 0 | `j = 1` | 1 |

`hits` is `[0,2]`. The occurrence at offset 1 is not reported because offset 0 already consumed the character at index 1.

**The third input, `{text:'ABabaBa',pattern:'aba'}`**, is the one that separates `fold=false` from `fold=true`. With `fold: false` the text is searched as written: `A`, `B`, `a`, `b`, `a`, `B`, `a`. The only place three consecutive characters spell `aba` exactly is offsets 2–4, so `hits` is `[2]`. With `fold: true` (1780) both strings are lower-cased, the text becomes `abababa`, and the overlapping occurrences at 0, 2 and 4 all match — `hits` is `[0,2,4]`.

**The first two inputs** exercise the empty pattern. `{text:'',pattern:''}` produces `Array.from({length:1},(_,i)=>i)` — `[0]`. `{text:'abc',pattern:''}` produces `[0,1,2,3]`: four boundaries in a three-character string. Under `output: 'first'` those become `0` and `0`; under `count`, `1` and `4`.

**The last two inputs** have no match at all. `{text:'a',pattern:'long'}` never lets `i` reach a point where `j` could hit 4, and `{text:'abc',pattern:'z'}` never matches a single character. Both give `hits = []`, which is `[]` under `all`, `-1` under `first` and `last` — this is where the `?? -1` earns its place — and `0` under `count`.

The reference solution, as it now reads in `solutions/1779.cjs`:

```js
function kmp(input) {
  const text = cfg.fold ? input.text.toLowerCase() : input.text;
  const pattern = cfg.fold ? input.pattern.toLowerCase() : input.pattern;
  let hits = [];
  if (!pattern.length) {
    hits = Array.from({length: text.length + 1}, (_, i) => i);
  } else {
    const prefix = Array(pattern.length).fill(0);
    for (let i = 1, j = 0; i < pattern.length; i++) {
      while (j && pattern[i] !== pattern[j]) j = prefix[j - 1];
      if (pattern[i] === pattern[j]) j++;
      prefix[i] = j;
    }
    for (let i = 0, j = 0; i < text.length; i++) {
      while (j && text[i] !== pattern[j]) j = prefix[j - 1];
      if (text[i] === pattern[j]) j++;
      if (j === pattern.length) {
        hits.push(i - j + 1);
        j = cfg.output === 'disjoint' ? 0 : prefix[j - 1];
      }
    }
  }
  if (cfg.output === 'first') return hits[0] ?? -1;
  if (cfg.output === 'last') return hits.at(-1) ?? -1;
  if (cfg.output === 'count') return hits.length;
  return hits;
}
```

## Policy matrix — what changes between the variants

`cfg.fold` appears in the two lines that pick up the strings. `cfg.output` appears twice: once inside the search loop, deciding the post-match fallback, and once at the end, deciding the projection.

| ID | Variant | What differs in the prompt | What differs in the code |
| --- | --- | --- | --- |
| 1779 | output=all; fold=false | `{"fold":false,"output":"all"}` | exact case; after a match `j = prefix[j-1]`; returns `hits` |
| 1780 | output=all; fold=true | `{"fold":true,"output":"all"}` | both strings lower-cased first; otherwise as 1779 |
| 1781 | output=disjoint; fold=false | `{"fold":false,"output":"disjoint"}` | exact case; after a match `j = 0`; returns `hits` |
| 1782 | output=disjoint; fold=true | `{"fold":true,"output":"disjoint"}` | lower-cased; after a match `j = 0` |
| 1783 | output=first; fold=false | `{"fold":false,"output":"first"}` | overlapping scan; returns `hits[0] ?? -1` |
| 1784 | output=first; fold=true | `{"fold":true,"output":"first"}` | lower-cased; returns `hits[0] ?? -1` |
| 1785 | output=last; fold=false | `{"fold":false,"output":"last"}` | overlapping scan; returns `hits.at(-1) ?? -1` |
| 1786 | output=last; fold=true | `{"fold":true,"output":"last"}` | lower-cased; returns `hits.at(-1) ?? -1` |
| 1787 | output=count; fold=false | `{"fold":false,"output":"count"}` | overlapping scan; returns `hits.length` |
| 1788 | output=count; fold=true | `{"fold":true,"output":"count"}` | lower-cased; returns `hits.length` |

Only `disjoint` changes the search itself. `first`, `last` and `count` all scan with overlaps and then project, which is why `count` on `{text:'aaaaa',pattern:'aa'}` is `4` and not `2`.

## Pitfalls the tests are designed to catch

- **Writing the naive scan.** It agrees on all seven cases. It is still the wrong answer: the prompt says KMP and the CONTRACT says the complexity requirement needs source review.
- **Forgetting the empty pattern.** With `pattern.length === 0` the search loop's `j === pattern.length` test is `0 === 0` before any character is read, and `prefix[j-1]` is `prefix[-1]`. The guard before the loop is not optional.
- **Getting the empty-pattern count wrong.** `'abc'` has four boundaries, not three: the length is `text.length + 1`.
- **Skipping the empty pattern under `disjoint`.** The prompt says the empty pattern matches every boundary "in every mode, including disjoint", so the special case comes before the policy, not after.
- **Computing the offset as `i`.** The match *ends* at `i`; it starts at `i - j + 1`. With pattern `ababd` matching at text index 9, the answer is 5.
- **Resetting `j` to 0 on every mismatch.** That turns KMP into the naive scan with extra steps and, worse, can miss occurrences that overlap the failed attempt.
- **Lower-casing only one side.** `fold` applies to both `text` and `pattern`; the `ABabaBa` case with pattern `aba` would still find offset 2 if only the text were folded, but a pattern like `ABA` would not.
- **Mutating the input to fold.** `input.text = input.text.toLowerCase()` fails `'Input must not mutate'`. Assign to a local.
- **Using `hits[0] || -1`.** A match at offset `0` is falsy, so `||` would report `-1` for `{text:'abc',pattern:'a'}`. The reference uses `??`, which only falls through on `null` and `undefined`.
- **Returning an array for `count` or a number for `all`.** The five outputs have three different return types.

## Try it yourself

1. Add an `output=ranges` policy returning `[start, end)` pairs. Which line of the search loop changes, and does the empty-pattern branch need a different shape?
2. Build the prefix array for `aabaaab` by hand, then check it against the loop in the reference. Which index first needs more than one fallback step?
3. Make `disjoint` skip only when the pattern is non-empty, and explain why the reference does not need that check.
4. In words: the search loop's `while` can execute many times in a single iteration of the `for`, yet the whole scan is still O(n). Explain the accounting argument — what increases, what decreases, and by how much in total.
