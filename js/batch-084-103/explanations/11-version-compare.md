# Compare numeric version components — js/batch-084-103 94

**What you practise:** comparing dotted numeric versions correctly, including components too large for a JavaScript `Number`.
**Prerequisites:** regular-expression anchors `^` and `$`; `BigInt` and its literals (`0n`); `Number.MAX_SAFE_INTEGER`; the `??` operator.
**Exercises:** 94: Compare numeric version components.

## The problem in plain words

A version string here is a run of digit groups separated by single dots: `1`, `1.2`, `9.0.14`. You must return `-1`, `0` or `1` — the usual comparator convention — saying whether the first version sorts before, with, or after the second.

Comparing them as strings is wrong: `'2.0' < '1.99'` is false as text, and `'10' < '9'` is true as text. They have to be compared component by component, numerically.

Two normalisation rules come with the format. Leading zeros carry no meaning, so `1.02.0` and `1.2` are the same version. Trailing zero components carry no meaning either, so `1.2` and `1.2.0` are equal — which means the two versions do not have to have the same number of components.

The last rule is the one that rules out `Number`. The header says components can exceed `Number` precision. Above `Number.MAX_SAFE_INTEGER` (2^53 − 1) consecutive integers stop being distinguishable as doubles, so `BigInt` is used instead.

## The contract you must honour

Taken from `tests/094-version-compare.cjs`:

- `solve('1.02.0','1.2')` asserts `0`: leading zeros ignored, trailing zero component ignored.
- `solve('2.0','1.99')` asserts `1`. The first components decide it, and `2 > 1` numerically even though `'2' > '1.99'` is a different question as text.
- `solve('1.2','1.2.1')` asserts `-1`. The missing third component counts as zero, and `0 < 1`.
- `solve('9007199254740993','9007199254740992')` asserts `1`. Those two integers differ by 1 and sit just above `Number.MAX_SAFE_INTEGER`; as doubles they are the same value.
- `solve('1..2','1')` asserts a `TypeError`. An empty component is not a version.
- The return values are exactly `-1`, `0` and `1`, so a raw subtraction is not an acceptable result.

## Approach

1. Validate each argument with `/^\d+(\.\d+)*$/` — one digit group, then any number of further groups each preceded by a single dot — and reject a non-string as well. Failure is `throw new TypeError('Invalid version')`. The anchors are load-bearing: without them the pattern would match a substring of `'1..2'`.
2. Split on `.` and map each component through `BigInt`. `BigInt('02')` is `2n`, so leading zeros disappear here.
3. Loop to the greater of the two component counts. Read component `i` from each side, substituting `0n` when the index is past the end.
4. On the first pair that differs, return `-1` or `1`.
5. If the loop finishes, the versions are equal: return `0`.

Treating a missing component as `0n` is what makes trailing zero components invisible, with no separate trimming step.

## Worked example — 94 Compare numeric version components

Input, from the first assertion: `a = '1.02.0'`, `b = '1.2'`.

Parsing: `'1.02.0'` passes the pattern and splits into `['1','02','0']`, which maps to `[1n, 2n, 0n]`. `'1.2'` maps to `[1n, 2n]`.

`componentCount` is `Math.max(3, 2)` = `3`.

| `i` | left component | right component | equal? |
| --- | --- | --- | --- |
| 0 | `1n` | `1n` | yes, continue |
| 1 | `2n` (from `'02'`) | `2n` | yes, continue |
| 2 | `0n` | past the end, so `0n` | yes, continue |

The loop ends without a difference, so `0` is returned. Asserted on line 4 of the test file.

The reference solution, as it now reads in `solutions/094-version-compare.cjs`:

```js
function compareVersions(a, b) {
  function parse(version) {
    if (typeof version !== 'string' || !/^\d+(\.\d+)*$/.test(version)) {
      throw new TypeError('Invalid version');
    }
    return version.split('.').map(BigInt);
  }
  const left = parse(a);
  const right = parse(b);
  const componentCount = Math.max(left.length, right.length);
  for (let i = 0; i < componentCount; i++) {
    const leftPart = left[i] ?? 0n;
    const rightPart = right[i] ?? 0n;
    if (leftPart !== rightPart) {
      return leftPart < rightPart ? -1 : 1;
    }
  }
  return 0;
}
```

## Variations you could build

| Variation | What would change in the code |
| --- | --- |
| Require exactly three components, as strict semver does | the pattern becomes `/^\d+\.\d+\.\d+$/` and the padding with `0n` becomes unnecessary |
| Support a prerelease suffix such as `1.2.0-rc.1` | a second pattern and a second comparison stage; a prerelease sorts *before* the same version without one |
| Sort an array of versions | pass this function straight to `Array.prototype.sort` — it already returns the comparator convention |

## Pitfalls the tests are designed to catch

- **Parsing components with `Number` or `parseInt`.** The fourth assertion compares two integers above `Number.MAX_SAFE_INTEGER`; as doubles they are equal, so the function would return `0` instead of `1`.
- **Dropping the anchors from the pattern.** `/\d+(\.\d+)*/ .test('1..2')` is true, because it matches the leading `1`, so the fifth assertion would not throw.
- **Comparing the split strings directly.** `'02' !== '2'` as text, so `solve('1.02.0','1.2')` would report a difference.
- **Returning `leftPart - rightPart`.** That is a `BigInt`, and it is not one of `-1`, `0`, `1`; `assert.equal` compares with `===` after type checks and would fail.
- **Trimming trailing zeros by hand before comparing.** It works, but the `?? 0n` padding already does it and cannot get the empty-version edge case wrong.
- **Comparing lengths first as a tiebreak.** `'1.2'` and `'1.2.0'` have different lengths and must compare equal.

## Try it yourself

1. Write `maxVersion(list)` using this comparator. How many comparisons does it make?
2. Extend the parser to accept and ignore a leading `v`, as in `v1.2.0`. Which line changes?
3. In words: `BigInt` and `Number` cannot be mixed with `<` without coercion rules coming into play. Explain what `1n < 2` evaluates to and why the reference never relies on that behaviour.
