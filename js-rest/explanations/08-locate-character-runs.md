# Locate character runs — js-rest 132–135

**What you practise:** finding every maximal run of a character class in a string and reporting half-open `[start, end)` spans.
**Prerequisites:** regular expression character classes and the `g` flag; `String.prototype.matchAll`; what a half-open interval is.
**Exercises:** 132: Locate letters runs, 133: Locate digits runs, 134: Locate whitespace runs, 135: Locate punctuation runs.

## The problem in plain words

The input is an ASCII string. You must return every maximal stretch of characters belonging to one class, as `{start, end, text}` objects in left-to-right order.

"Maximal" means a run cannot be extended: `"aabb"` scanned for letters is one run of four, not two runs of two and not four runs of one. "Half-open" means `end` is the index *after* the last character, so `end - start` is the length and `input.slice(start, end)` is the text. This is the same convention JavaScript's `slice` uses, and the same one exercise 150 calls left-closed.

"Policy" here is the character class. The prompt defines all four in terms of ASCII: letters are `A–Z/a–z`, digits are `0–9`, whitespace is JavaScript's `\s`, and punctuation is "non-alphanumeric, non-whitespace" — a negative definition, not a list of symbols.

The reason this is a regular-expression exercise rather than a loop exercise is that a greedy `+` quantifier already means "maximal". You do not have to track run boundaries by hand; the engine does it.

## The contract you must honour

Taken from `tests/132.cjs` through `tests/135.cjs`:

- The shared input `"ab12 !?"` (letters, digits, one space, two punctuation marks) asserts `[{"start":0,"end":2,"text":"ab"}]` for letters, `[{"start":2,"end":4,"text":"12"}]` for digits, `[{"start":4,"end":5,"text":" "}]` for whitespace and `[{"start":5,"end":7,"text":"!?"}]` for punctuation.
- `""` asserts `[]` in all four.
- `"x"` asserts `[{"start":0,"end":1,"text":"x"}]` for letters and `[]` for the other three.
- Each element is an object with exactly the keys `start`, `end` and `text`. `assert.deepEqual` compares own enumerable properties, so an extra `length` key would fail.
- `end` is exclusive: the two-character run `"ab"` at index 0 reports `end: 2`, not `1`.
- Indices are UTF-16 offsets, which for ASCII input is the same as character positions.
- Every case ends with `assert.deepEqual(input, before, 'Input must not mutate')`. Strings are immutable in JavaScript, so this one is free — but the check is there in every file for consistency.

## Approach

1. Write the class pattern with a `+` quantifier and the `g` flag: `/[a-z]+/gi` for letters. `+` is greedy, so it consumes as many class members as it can before stopping; that is what makes each match maximal.
2. Call `input.matchAll(pattern)`. It returns an iterator of match objects, each with `index` (the UTF-16 offset of the match) and `[0]` (the matched text). Unlike `pattern.exec` in a loop, it needs no manual `lastIndex` bookkeeping.
3. For each match push `{start: match.index, end: match.index + match[0].length, text: match[0]}`.
4. Return the collected array. An empty string yields no matches, so the array stays empty without a special case.

Cost: one linear scan of the string.

`matchAll` requires the `g` flag and throws `TypeError` without it — a useful guard rail, because a non-global regex would otherwise match once forever.

On the punctuation class: writing out `[!?.,;:]` and friends is both long and wrong, because it misses every symbol you forgot. The prompt defines punctuation as *everything else*, so the class is the negation `[^a-z0-9\s]` with the `i` flag. Negated classes are the right tool whenever the definition is "not these".

## Worked example — 132 Locate letters runs

The first input in `tests/132.cjs`, on line 2, is `"ab12 !?"`. Index it first:

| index | 0 | 1 | 2 | 3 | 4 | 5 | 6 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| char | `a` | `b` | `1` | `2` | (space) | `!` | `?` |
| class | letter | letter | digit | digit | whitespace | punct | punct |

Running `/[a-z]+/gi` over it:

| Engine step | Position | Outcome |
| --- | --- | --- |
| start scan | 0 | `a` is in the class; begin a match |
| extend | 1 | `b` is in the class; extend to length 2 |
| extend | 2 | `1` is not in the class; stop. Match is `"ab"` at index 0 |
| resume | 2 | `1`, `2`, space, `!`, `?` are all outside the class; no further match |

One match: `index` is `0`, `match[0]` is `"ab"`, so the pushed object is `{start: 0, end: 0 + 2, text: "ab"}` — exactly the assertion on line 2.

The other three exercises run the same trace with a different class and pick out a different stretch of the same table: digits find `"12"` at 2–4, whitespace finds `" "` at 4–5, punctuation finds `"!?"` at 5–7. Together they tile the whole string, which is a good check that the four classes partition ASCII.

The second case, `""`, produces no matches and returns `[]` (line 3). The third, `"x"`, is a one-character run for letters — `{start: 0, end: 1, text: "x"}` — and no match at all for the other three (line 4).

The reference solution, as it now reads in `solutions/132.cjs`:

```js
function solve(input) {
  const runPattern = /[a-z]+/gi;
  const runs = [];
  for (const match of input.matchAll(runPattern)) {
    runs.push({
      start: match.index,
      end: match.index + match[0].length,
      text: match[0],
    });
  }
  return runs;
}
```

## Policy matrix — what changes between the variants

| ID | Variant | What differs in the prompt | What differs in the code |
| --- | --- | --- | --- |
| 132 | letters | "maximal runs of letters"; "Letters A–Z/a–z" | pattern is `/[a-z]+/gi` |
| 133 | digits | "maximal runs of digits"; "digits 0–9" | pattern is `/[0-9]+/g` |
| 134 | whitespace | "maximal runs of whitespace"; "whitespace JS \s" | pattern is `/\s+/g` |
| 135 | punctuation | "punctuation means non-alphanumeric, non-whitespace" | pattern is the negated `/[^a-z0-9\s]+/gi` |

## Pitfalls the tests are designed to catch

- **Reporting an inclusive `end`.** The letters case asserts `end: 2` for a run covering indices 0 and 1. Returning the last index, `1`, fails on the first assertion of every exercise that finds a run.
- **Dropping the `+`.** `/[a-z]/gi` matches single characters, so `"ab12 !?"` yields two runs, `{0,1,"a"}` and `{1,2,"b"}`, instead of one. `assert.deepEqual` compares array length first.
- **Dropping the `g` flag.** `matchAll` throws `TypeError: matchAll must be called with a global RegExp`, which surfaces as a failure rather than a wrong answer.
- **Reusing one regex literal across calls with `exec`.** A global regex carries `lastIndex` between calls, so a second call on a new string starts mid-way. `matchAll` sidesteps this by cloning the regex internally; a hand-rolled `exec` loop must reset `lastIndex` itself.
- **Listing punctuation characters by hand in 135.** `[!?]` passes the visible test, because the only punctuation in `"ab12 !?"` is `!` and `?`. It fails on `"a-b"`, and it contradicts the prompt's definition.
- **Forgetting the `i` flag in 132 or 135.** `/[a-z]+/g` misses capitals entirely; in 135 the negated class `[^a-z0-9\s]` without `i` treats every capital letter as punctuation. The visible data is lower case, so neither bug shows up in the tests.
- **Returning arrays instead of objects.** The assertion compares against `{"start":0,"end":2,"text":"ab"}`; `[0,2,"ab"]` is not deep-equal to it.

## Checking your work

Run one exercise at a time:

```text
node js-rest/verify.cjs --id=132
```

Three things to check by eye first:

- Does the pattern carry both `+` and `g`? Without `+` every run is split into single characters; without `g`, `matchAll` throws.
- Is `end` computed as `match.index + match[0].length`, not `+ length - 1`?
- For 132 and 135, is the `i` flag present? The visible data is lower case, so the tests cannot see a missing one.

A useful self-test the suite does not include:

```js
solve("AB  cd!!");
```

Letters should give two runs, `{start:0,end:2,text:"AB"}` and `{start:4,end:6,text:"cd"}`; whitespace one run of length 2 at 2–4; punctuation one run of length 2 at 6–8; digits none. Missing the `i` flag drops `AB` from the letters answer and adds it to the punctuation answer.

## Try it yourself

1. Add a `words` variant where a run is letters and digits together. Which existing pattern does it most resemble, and what does it do to the four-way partition of `"ab12 !?"`?
2. Rewrite 133 as an index loop with no regular expression. Which part gets longer, and where does the off-by-one risk move to?
3. Feed a non-ASCII string such as `"héllo"` to 132 and record what happens to the run boundaries. What would `\p{L}` with the `u` flag change?
4. In words: explain why the punctuation class is defined negatively, and name one character that a hand-written positive list would almost certainly miss.
