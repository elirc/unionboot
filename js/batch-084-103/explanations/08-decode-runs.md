# Decode explicit run records — js/batch-084-103 91

**What you practise:** validating a whole input before producing any output, and using two distinct error types to mean two distinct things.
**Prerequisites:** array destructuring in a `for…of` head; `Number.isSafeInteger`; `String.prototype.repeat`; the difference between `TypeError` and `RangeError`.
**Exercises:** 91: Decode explicit run records.

## The problem in plain words

The input is a list of `[text, count]` pairs — a run-length encoding written out explicitly. `[['ab',2],['!',1]]` decodes to `'abab!'`. Your job is to produce that concatenation.

The interesting part is the guard rail. A tiny input can describe an enormous output: `[['a', 1e9]]` is three array cells and a gigabyte of string. So the function takes a `maxLength` budget, defaulting to `10000`, and must reject an over-budget request *before* allocating anything.

That ordering is the exercise. It is why the reference makes two passes: the first one only counts, the second one only builds.

Two error types carry two different meanings. A run whose shape is wrong — a non-string text, a negative or fractional count — is a `TypeError`, because the argument is the wrong kind of thing. A well-formed request that is simply too big is a `RangeError`, because the value is out of the allowed range. `maxLength` itself being malformed is also a `RangeError`.

## The contract you must honour

Taken from `tests/091-decode-runs.cjs`:

- `solve([['ab',2],['!',1]])` asserts `'abab!'`. Runs are concatenated in input order.
- `solve([['x',0]],0)` asserts `''`. A count of `0` is legal and contributes nothing, and a `maxLength` of `0` is legal too.
- `solve([])` asserts `''`.
- `solve([['a',-1]])` asserts a `TypeError` — a negative count.
- `solve([['ab',3]],5)` asserts a `RangeError`. The output would be 6 UTF-16 units against a budget of 5.
- `solve([['ab',3]],6)` asserts `'ababab'`, so the comparison is `total > maxLength`, not `>=`. Exactly hitting the budget is allowed.
- The length that is budgeted is `text.length * count` summed over the runs, i.e. UTF-16 code units, which is what `String.prototype.length` reports.

## Approach

1. Validate `maxLength` first: it must be a nonnegative safe integer, otherwise `throw new RangeError('Invalid limit')`.
2. First pass. For each `[text, count]`:
   - reject a non-string `text`, or a `count` that is not a safe integer, or a negative `count`, with `throw new TypeError('Invalid run')`;
   - add `text.length * count` to a running total;
   - if the running total exceeds `maxLength`, `throw new RangeError('Output too long')`.
3. Second pass. Map each run to `text.repeat(count)` and `join('')`.

Checking the total inside the loop means the budget trips as soon as it is passed, rather than after the whole list has been scanned.

## Worked example — 91 Decode explicit run records

Input, from the fifth assertion: `runs = [['ab',3]]`, `maxLength = 5`.

| step | check | result |
| --- | --- | --- |
| `maxLength` | `Number.isSafeInteger(5)` and `5 >= 0` | passes |
| run `['ab',3]` shape | `'ab'` is a string; `3` is a safe integer and not negative | passes |
| running total | `0 + 'ab'.length * 3` = `0 + 2 * 3` = `6` | — |
| budget | `6 > 5` | throw `RangeError('Output too long')` |

Nothing is ever repeated or joined: the function leaves before the second pass. Asserted on line 7 of the test file as `assert.throws(()=>solve([['ab',3]],5),RangeError)`.

Change the budget to `6` and the same input reaches the second pass: `'ab'.repeat(3)` is `'ababab'`, and joining a one-element array gives `'ababab'` — line 8.

The reference solution, as it now reads in `solutions/091-decode-runs.cjs`:

```js
function decodeRuns(runs, maxLength = 10000) {
  if (!Number.isSafeInteger(maxLength) || maxLength < 0) {
    throw new RangeError('Invalid limit');
  }
  let totalLength = 0;
  for (const [text, count] of runs) {
    if (typeof text !== 'string' || !Number.isSafeInteger(count) || count < 0) {
      throw new TypeError('Invalid run');
    }
    totalLength += text.length * count;
    if (totalLength > maxLength) {
      throw new RangeError('Output too long');
    }
  }
  return runs.map(([text, count]) => text.repeat(count)).join('');
}
```

## Variations you could build

| Variation | What would change in the code |
| --- | --- |
| Budget in code points rather than UTF-16 units | `text.length` becomes `[...text].length`, which is O(text) per run |
| Return a generator that yields chunks lazily | the budget check stays where it is; the second pass becomes `yield text.repeat(count)` |
| Accept a compact string format such as `'ab2!1'` | a parsing step before the validation loop; the two passes are unchanged |

## Pitfalls the tests are designed to catch

- **Building the string first and measuring afterwards.** It returns the right answers, but it defeats the entire purpose — and the header states the order explicitly, so the reviewer reads the source.
- **Swapping the two error types.** `assert.throws(fn, TypeError)` and `assert.throws(fn, RangeError)` each name a constructor, and `RangeError` is not an instance of `TypeError`.
- **Using `>=` for the budget comparison.** `solve([['ab',3]],6)` must succeed, and `6 >= 6` would reject it.
- **Using `Number.isInteger` instead of `Number.isSafeInteger`.** Not distinguished by this test, but a count above 2^53 cannot be trusted arithmetically, which is why the header names the safe-integer check.
- **Allowing a negative `maxLength`.** The guard checks both the type and the sign.
- **Rejecting a count of `0`.** The second assertion needs `['x',0]` to be legal and to contribute `''`.

## Try it yourself

1. Add an optional `maxRuns` and decide which error type it should use. What makes your answer consistent with the two already here?
2. Make the function report *which* run overflowed, without changing the error type. What would that do to the existing assertions?
3. In words: `text.length * count` can exceed `Number.MAX_SAFE_INTEGER` for a large enough count, even though each factor is safe. Explain what the running total would then be worth, and what the validation would have to become.
