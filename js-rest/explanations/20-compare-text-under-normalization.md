# Compare text under normalization — js-rest 180–183

**What you practise:** normalising two strings before comparing them, and reporting the first position where they diverge in the normalized space.
**Prerequisites:** `String.prototype.toLowerCase` and `replace` with a global regex; string indexing; `Math.min`.
**Exercises:** 180: Compare text under strict normalization, 181: Compare text under ignore-case normalization, 182: Compare text under ignore-space normalization, 183: Compare text under alphanumeric normalization.

## The problem in plain words

The input is `{a, b}`, two strings. You must report whether they are equal and, if not, the index of the first character where they differ.

Before any of that, both strings pass through a normalizer — a rule for deciding which differences do not count. Comparing user input usually wants case ignored. Comparing code or identifiers usually wants whitespace ignored. Comparing a licence key wants everything but letters and digits stripped. Comparing a checksum wants nothing ignored at all.

"Policy" is the normalizer. The comparison that follows is identical in all four files.

The crucial detail is that the reported index is an index into the **normalized** strings. For strict and ignore-case that is also a position in the original, because neither rule changes length. For ignore-space and alphanumeric it is not: characters have been deleted, so the index no longer points where a reader of the original would expect.

## The contract you must honour

Taken from `tests/180.cjs` through `tests/183.cjs`:

- `{"a":"A b!","b":"ab"}` asserts `{"equal":false,"firstDifference":0}` for strict, `{"equal":false,"firstDifference":1}` for ignore-case, `{"equal":false,"firstDifference":0}` for ignore-space and `{"equal":true,"firstDifference":-1}` for alphanumeric. All four policies are visible in this one case.
- `{"a":"x","b":"xy"}` asserts `{"equal":false,"firstDifference":1}` in all four. `"x"` is a prefix of `"xy"`, and the mismatch is reported at the shorter string's length — there is no character at index 1 in `a` to compare.
- `{"a":"","b":""}` asserts `{"equal":true,"firstDifference":-1}` in all four.
- The return value is an object with exactly the keys `equal` and `firstDifference`. `firstDifference` is `-1` when and only when `equal` is `true`.
- Every case ends with `assert.deepEqual(input, before, 'Input must not mutate')`. Strings are immutable, so this is automatic.

## Approach

1. Define the normalizer as a single arrow function and apply it to both strings. Keeping it in one named place is what makes the four files differ by one line.
2. Walk an index forward while both strings still have a character at that index and the two characters agree:
   `while (index < Math.min(a.length, b.length) && a[index] === b[index]) index++;`
   The `Math.min` bound is the prefix rule: the loop stops at the end of the shorter string, leaving `index` equal to that length.
3. Compute `equal` by comparing the whole normalized strings, not by asking whether the loop ran off the end. A prefix relationship makes the loop finish without a mismatch but the strings are still unequal.
4. Return `{equal, firstDifference: equal ? -1 : index}`.

Cost: O(n) for normalisation plus O(n) for the scan.

The four normalizers:

| Policy | Normalizer | Changes length? |
| --- | --- | --- |
| strict | `text => text` | no |
| ignore-case | `text => text.toLowerCase()` | no |
| ignore-space | `text => text.replace(/\s/g, "")` | yes |
| alphanumeric | `text => text.toLowerCase().replace(/[^a-z0-9]/g, "")` | yes |

Order matters in the last one. Lowercasing must come first: applied the other way round, `[^a-z0-9]` would delete every capital letter rather than fold it, so `"A b!"` would normalize to `"b"` instead of `"ab"` and the first test case would report a difference instead of equality.

## Worked example — 181 Compare text under ignore-case normalization

The first input in `tests/181.cjs`, on line 2, is `{"a":"A b!","b":"ab"}`. This case tells all four policies apart, so it is worth running through each.

Normalising under ignore-case:

| Original | After `toLowerCase()` |
| --- | --- |
| `"A b!"` | `"a b!"` |
| `"ab"` | `"ab"` |

Now the scan:

| index | `index < min(4, 2)` | `a[index]` | `b[index]` | agree? |
| --- | --- | --- | --- | --- |
| 0 | `0 < 2`, yes | `"a"` | `"a"` | yes, advance |
| 1 | `1 < 2`, yes | `" "` | `"b"` | **no**, stop |

The loop exits with `index === 1`. `"a b!" === "ab"` is `false`, so `equal` is `false` and `firstDifference` is `1`. That is the assertion `{"equal":false,"firstDifference":1}`.

The same input under the other three policies:

- **strict** leaves `"A b!"` and `"ab"` alone. Position 0 is `"A"` against `"a"` — different, so the loop never advances and the answer is `firstDifference: 0`.
- **ignore-space** gives `"Ab!"` and `"ab"`. Position 0 is `"A"` against `"a"` — still different, so again `0`. Case was not folded.
- **alphanumeric** gives `"ab"` and `"ab"`. The loop runs to the bound, the strings are equal, and the answer is `{"equal":true,"firstDifference":-1}`.

The second case, `{"a":"x","b":"xy"}`, is the prefix case. Every normalizer leaves it as `"x"` and `"xy"`. The loop bound is `min(1, 2) = 1`; at index 0 both are `"x"`, so the index advances to 1; `1 < 1` is false, so the loop stops. The strings are not equal, so `firstDifference` is `1` — the shorter string's length, exactly as the prompt says.

The reference solution, as it now reads in `solutions/181.cjs`:

```js
function solve(input) {
  const normalize = text => text.toLowerCase();
  const a = normalize(input.a);
  const b = normalize(input.b);
  let index = 0;
  while (index < Math.min(a.length, b.length) && a[index] === b[index]) {
    index++;
  }
  const equal = a === b;
  return { equal, firstDifference: equal ? -1 : index };
}
```

## Policy matrix — what changes between the variants

| ID | Variant | What differs in the prompt | What differs in the code |
| --- | --- | --- | --- |
| 180 | strict | "Normalize with no changes" | `const normalize = text => text` |
| 181 | ignore-case | "Normalize with lowercase only" | `text => text.toLowerCase()` |
| 182 | ignore-space | "Normalize with remove all whitespace only" | `text => text.replace(/\s/g, "")` |
| 183 | alphanumeric | "lowercase and remove all characters except ASCII letters/digits" | `text => text.toLowerCase().replace(/[^a-z0-9]/g, "")` |

## Pitfalls the tests are designed to catch

- **Deriving `equal` from the loop.** Concluding "no mismatch found, therefore equal" reports `{"equal":true,"firstDifference":-1}` for `{"a":"x","b":"xy"}`, which asserts `false` and `1`. The lengths must be compared too, and `a === b` does that in one operation.
- **Returning the mismatch index when the strings are equal.** `firstDifference` must be `-1` exactly when `equal` is `true`; the empty-string case asserts it.
- **Bounding the loop by only one length.** `index < a.length` reads `b[index]` past the end of `b`, which is `undefined` — it happens to stop the loop, but it stops it for the wrong reason and breaks as soon as you reorder the comparison.
- **Normalising only one side.** Applying the rule to `a` and not `b` makes ignore-case report a difference at 0 for `{"a":"A b!","b":"ab"}` and fails 181.
- **Stripping non-alphanumerics before lowercasing in 183.** `"A b!".replace(/[^a-z0-9]/g, "")` is `"b"`, because the capital `A` is not in `[a-z]`. The first case then reports `{"equal":false,"firstDifference":0}` instead of the asserted `true` and `-1`.
- **Reporting an index into the original string.** For 182 and 183 the normalized string is shorter, and the prompt is explicit that "index is in normalized strings".
- **Using `\s` in a character class negation for 182.** `replace(/\s/g, "")` and `replace(/\s+/g, "")` both work here; `replace(/ /g, "")` does not, because `\s` covers tabs and newlines too.

## Checking your work

Run one exercise at a time:

```text
node js-rest/verify.cjs --id=180
```

Three things to check by eye first:

- Is `equal` computed as `a === b` on the normalized strings, rather than inferred from the loop finishing?
- Is the loop bounded by `Math.min(a.length, b.length)`?
- In 183, does `toLowerCase()` run before the `[^a-z0-9]` strip?

A useful self-test the suite does not include:

```js
solve({a: "Hello World", b: "helloworld"});
```

Strict reports a difference at 0 (`H` against `h`). Ignore-case normalizes to `"hello world"` and `"helloworld"` and reports 5, where the space meets `w`. Ignore-space normalizes to `"HelloWorld"` and `"helloworld"` and reports 0 again, because case was not folded. Alphanumeric normalizes both to `"helloworld"` and reports equality with `-1`. One input, three different verdicts, and the only thing that changed is the normalizer.

## Try it yourself

1. Add a `trim-only` variant that removes leading and trailing whitespace but keeps the inside. Which test case changes?
2. Make the function also return the differing characters at `firstDifference`. What must it return when one string has run out?
3. Reporting an index into the normalized string is awkward for a user. Add a second field that maps it back to a position in the original `a`. What has the normalizer got to record?
4. In words: explain why lowercasing must precede the `[^a-z0-9]` strip in 183, and give a two-character input that proves it.
