# Decimal-string arithmetic — js-more 1789–1798

**What you practise:** schoolbook arithmetic on digit strings, without ever turning a whole operand into a `Number` or a `BigInt`, plus canonicalisation, validation and an optional zero-padded output.
**Prerequisites:** string indexing and `String.prototype.padStart`; `Math.floor` and `%` for carry extraction; regular expressions with a lookahead (`/^0+(?=\d)/`); why `Number.MAX_SAFE_INTEGER` matters.
**Exercises:** 1789: op=add; pad=false, 1790: op=add; pad=true, 1791: op=difference; pad=false, 1792: op=difference; pad=true, 1793: op=subtract; pad=false, 1794: op=subtract; pad=true, 1795: op=multiply; pad=false, 1796: op=multiply; pad=true, 1797: op=maximum; pad=false, 1798: op=maximum; pad=true.

## The problem in plain words

The input is `{a, b}`, two non-empty unsigned digit strings. Compute one arithmetic operation on them and return the answer, also as a digit string.

The catch is in the prompt: "Compute add exactly without Number whole-value conversion or BigInt in your implementation". The test feeds `'999999999999999999999999'`, twenty-four nines. `Number('999999999999999999999999')` is `1e24`, which has lost the low-order digits before you have done any arithmetic at all — `Number.MAX_SAFE_INTEGER` is about 9.007 × 10^15. So the digits have to be processed one at a time, the way you were taught at school: align the operands at the right, work leftwards, carry or borrow.

"Policy" is two knobs. `op` picks the operation. `add` sums. `difference` is the absolute difference, so it never fails. `subtract` is `a - b` and throws when the result would be negative. `multiply` is the long-multiplication product. `maximum` returns whichever operand is numerically larger. `pad` decides whether the canonical answer is left-padded with zeros to the width of the wider *original* operand.

Two error cases: anything that is not a run of digits throws `TypeError('Decimal digits required')`, and a negative `subtract` throws `RangeError('Negative result')`.

## The contract you must honour

Taken from `prompts/1789.txt` and `tests/1789.cjs`:

- The return value is a string for every operation, including `maximum`.
- Results are canonical: no leading zeros, and zero itself is `'0'`. The test's expectation is `String(...)` of a `BigInt`, which is canonical by construction.
- Validation: `assert.throws(()=>solve({a:'1.2',b:'0'}),/Decimal digits/)`. A decimal point is not a digit.
- `subtract` with `a < b` throws: the test checks `if(cfg.op==='subtract'&&BigInt(a)<BigInt(b)){assert.throws(()=>solve({a,b}),/Negative result/);continue;}`. Among the five test pairs, `['4','9']` is the one that triggers it.
- `difference` is `x > y ? x-y : y-x` in the test's expectation — absolute, never throwing.
- `pad` pads to `Math.max(a.length, b.length)` where `a` and `b` are the strings as supplied. For the pair `['0012','0007']` that width is 4, even though both canonicalise to shorter strings.
- `check` clones the input and asserts `'Input must not mutate'`. Strings are immutable, so this holds as long as you do not write onto the input object.
- The test uses `BigInt` to build its expectations. That is the test's privilege, not yours — the prompt bars `BigInt` from the implementation, and the CONTRACT section's "needs source review" clause is what enforces it.

## Approach

1. Write `clean(s)` and run it on both operands first. It does two jobs: reject `!/^\d+$/.test(s)` with `TypeError('Decimal digits required')`, and strip leading zeros with `s.replace(/^0+(?=\d)/, '')`. The lookahead is what keeps `'0000'` from becoming `''`: the regex only consumes zeros that are followed by another digit.
2. `add(x, y)`: two cursors starting at the right ends, a `carry`, and a result built by prepending. `Number(x[i--] || 0)` reads a digit and steps left; past the start of the string the index yields `undefined`, which `|| 0` turns into a zero digit, so unequal lengths need no padding. The loop condition `i >= 0 || j >= 0 || carry` keeps going while either operand has digits left or a carry is outstanding.
3. `cmp(x, y)` on canonical strings: more digits wins; equal lengths compare with `<` and `>`, which for equal-length digit strings is numeric order because the digits `0`–`9` are in code-unit order. Returns `-1`, `0` or `1`.
4. `sub(x, y)`: the borrow loop, assuming `x >= y`. Take the digits, subtract the borrow, and if the result went negative add 10 and set the borrow for the next column. Finish with `clean(out)` to strip the leading zeros the borrowing left behind.
5. `multiply(x, y)`: allocate `x.length + y.length` slots, add every digit product into slot `i + j + 1`, then sweep right to left normalising carries. Accumulating first and normalising afterwards keeps every intermediate small: the largest possible slot value before normalisation is about `81 * min(x.length, y.length)`, nowhere near the safe-integer limit.
6. Dispatch on `cfg.op`, then apply `cfg.pad`.

Addition and subtraction are O(n), multiplication is O(n·m), comparison is O(n). No operation ever holds a whole number in a JavaScript `Number`.

## Worked example — 1789 Decimal-string arithmetic / scenario 1

The test drives five hand-written pairs through the same loop, quoted from line 9 of `tests/1789.cjs`:

```js
for(const [a,b] of [['0','0'],['0012','0007'],['999999999999999999999999','1'],['12345678901234567890','987654321'],['4','9']])
```

With `cfg = {"op":"add","pad":false}`, take the second pair, `{a:'0012', b:'0007'}`.

**Step 1, `clean`.** `/^\d+$/` matches both. `'0012'.replace(/^0+(?=\d)/,'')` removes `00` — the lookahead confirms a digit follows each — giving `'12'`. `'0007'` becomes `'7'`.

**Step 2, `add('12','7')`.**

| Iteration | `i`, `j` | `x[i]`, `y[j]` | `sum` | `out` | `carry` |
| --- | --- | --- | --- | --- | --- |
| start | 1, 0 | — | — | `''` | 0 |
| 1 | 1, 0 | `'2'`, `'7'` | 9 | `'9'` | 0 |
| 2 | 0, −1 | `'1'`, `undefined → 0` | 1 | `'19'` | 0 |
| exit | −1, −2 | — | — | `'19'` | 0 |

The loop stops because `i` and `j` are both negative and the carry is 0. The result is `'19'`, and with `pad: false` that is the return value. The test's expectation is `String(BigInt('0012') + BigInt('0007'))`, which is `'19'`.

**The same pair under 1790 (`pad: true`).** `Math.max('0012'.length, '0007'.length)` is 4, so `'19'.padStart(4,'0')` gives `'0019'`. Note that the width comes from `input.a` and `input.b`, the strings before `clean` stripped them — that is the only place in the function where the uncanonicalised input is read.

**The third pair, `{a:'999999999999999999999999', b:'1'}`**, is why the digit loop exists. The first iteration computes `9 + 1 + 0 = 10`, writes `0` and carries 1. The next twenty-three iterations each compute `9 + 0 + 1 = 10`, write `0` and carry 1 again. When both cursors have run off the left, the condition `i >= 0 || j >= 0 || carry` is still true because `carry` is 1, so one more iteration writes it: `0 + 0 + 1 = 1`. The result is `'1000000000000000000000000'` — twenty-five characters, exact. `Number('999999999999999999999999') + 1` gives `1e24`, which prints as `1e+24` and has never been exact.

**The fourth pair** adds `'12345678901234567890'` and `'987654321'` to `'12345678902222222211'`: the right-hand nine digits absorb the whole second operand and no carry escapes past the tenth column.

**The first and last pairs** are the small ones. `{a:'0',b:'0'}` cleans to `'0'` and `'0'`, and one iteration produces `'0'`. `{a:'4',b:'9'}` produces `'13'` — and this is the pair the other scenarios use to exercise their edge cases:

| Scenario | `{a:'4',b:'9'}` result |
| --- | --- |
| 1789 `add` | `'13'` |
| 1791 `difference` | `'5'` — `cmp('4','9')` is `-1`, so it computes `sub('9','4')` |
| 1793 `subtract` | throws `RangeError('Negative result')`; the test takes its `assert.throws` branch and skips the value check |
| 1795 `multiply` | `'36'` |
| 1797 `maximum` | `'9'` |

**The error case**, on the same line of the test:

```js
assert.throws(()=>solve({a:'1.2',b:'0'}),/Decimal digits/);
```

`clean('1.2')` fails the regex on the `.` and throws `TypeError('Decimal digits required')` before any arithmetic starts.

The reference solution, as it now reads in `solutions/1789.cjs`:

```js
function decimalArithmetic(input) {
  const clean = s => {
    if (!/^\d+$/.test(s)) throw new TypeError('Decimal digits required');
    return s.replace(/^0+(?=\d)/, '');
  };
  const a = clean(input.a);
  const b = clean(input.b);
  const add = (x, y) => {
    let i = x.length - 1;
    let j = y.length - 1;
    let carry = 0;
    let out = '';
    while (i >= 0 || j >= 0 || carry) {
      const sum = Number(x[i--] || 0) + Number(y[j--] || 0) + carry;
      out = sum % 10 + out;
      carry = Math.floor(sum / 10);
    }
    return out;
  };
  const cmp = (x, y) =>
    x.length !== y.length ? Math.sign(x.length - y.length) : x < y ? -1 : x > y ? 1 : 0;
  const sub = (x, y) => {
    // Assumes x >= y; every caller checks with cmp first.
    let borrow = 0;
    let out = '';
    let j = y.length - 1;
    for (let i = x.length - 1; i >= 0; i--) {
      let digit = Number(x[i]) - Number(y[j--] || 0) - borrow;
      borrow = digit < 0 ? 1 : 0;
      if (borrow) digit += 10;
      out = digit + out;
    }
    return clean(out);
  };
  const multiply = (x, y) => {
    const digits = Array(x.length + y.length).fill(0);
    for (let i = x.length - 1; i >= 0; i--) {
      for (let j = y.length - 1; j >= 0; j--) {
        digits[i + j + 1] += Number(x[i]) * Number(y[j]);
      }
    }
    for (let i = digits.length - 1; i > 0; i--) {
      digits[i - 1] += Math.floor(digits[i] / 10);
      digits[i] %= 10;
    }
    return clean(digits.join(''));
  };
  let result;
  if (cfg.op === 'add') {
    result = add(a, b);
  } else if (cfg.op === 'difference') {
    result = cmp(a, b) < 0 ? sub(b, a) : sub(a, b);
  } else if (cfg.op === 'subtract') {
    if (cmp(a, b) < 0) throw new RangeError('Negative result');
    result = sub(a, b);
  } else if (cfg.op === 'multiply') {
    result = multiply(a, b);
  } else {
    result = cmp(a, b) >= 0 ? a : b;
  }
  return cfg.pad ? result.padStart(Math.max(input.a.length, input.b.length), '0') : result;
}
```

## Policy matrix — what changes between the variants

`cfg.op` selects one branch of the dispatch; `cfg.pad` selects the final `padStart`. The helpers are compiled into all ten files whether or not the scenario calls them.

| ID | Variant | What differs in the prompt | What differs in the code |
| --- | --- | --- | --- |
| 1789 | op=add; pad=false | `{"op":"add","pad":false}` | `result = add(a, b)`; returned as is |
| 1790 | op=add; pad=true | `{"op":"add","pad":true}` | same branch; `padStart(Math.max(input.a.length, input.b.length), '0')` |
| 1791 | op=difference; pad=false | `{"op":"difference","pad":false}` | `cmp(a,b) < 0 ? sub(b,a) : sub(a,b)`; never throws |
| 1792 | op=difference; pad=true | `{"op":"difference","pad":true}` | same branch, padded |
| 1793 | op=subtract; pad=false | `{"op":"subtract","pad":false}` | `cmp(a,b) < 0` throws `RangeError('Negative result')`, else `sub(a,b)` |
| 1794 | op=subtract; pad=true | `{"op":"subtract","pad":true}` | same branch, padded — the throw is not padded, it is a throw |
| 1795 | op=multiply; pad=false | `{"op":"multiply","pad":false}` | `multiply(a, b)`: accumulate then normalise |
| 1796 | op=multiply; pad=true | `{"op":"multiply","pad":true}` | same branch, padded |
| 1797 | op=maximum; pad=false | `{"op":"maximum","pad":false}` | `cmp(a,b) >= 0 ? a : b` — returns a canonical operand, not a computed value |
| 1798 | op=maximum; pad=true | `{"op":"maximum","pad":true}` | same branch, padded |

`difference` and `subtract` differ in exactly one place: `difference` swaps the operands when `a < b`, `subtract` throws. `maximum` is the only operation that returns one of its inputs — cleaned, so `{a:'0012',b:'0007'}` under 1797 is `'12'`, not `'0012'`, and under 1798 is `'0012'` again by way of the padding.

## Pitfalls the tests are designed to catch

- **Converting a whole operand.** `Number(input.a) + Number(input.b)` gets the first two pairs right and the third catastrophically wrong: `1e24` versus `'1000000000000000000000000'`.
- **Reaching for `BigInt`.** It would pass every assertion. The prompt bars it from the implementation; the test uses it precisely because the test is allowed to.
- **Stripping zeros with `replace(/^0+/,'')`.** `'0'` becomes `''`, and `''` is not a canonical zero. The lookahead `(?=\d)` is what keeps the last digit.
- **Padding to the cleaned width.** `pad` uses `input.a.length` and `input.b.length`. For `['0012','0007']` that is 4; using the cleaned `'12'` and `'7'` would give 2 and produce `'19'` where `'0019'` is asserted.
- **Forgetting to canonicalise after `sub`.** Borrowing `'12' - '7'` writes a leading `0`, so `sub` ends with `clean(out)`.
- **Using `>` on raw strings to compare magnitude.** `'9' > '12'` is `true` as strings. `cmp` checks the length first, which is only valid because both operands have been canonicalised.
- **Normalising carries inside the multiply loops.** Correct, but the reference accumulates first and normalises once; doing both at once makes the bound on an intermediate harder to state.
- **Throwing the wrong error type.** The prompt names `TypeError('Decimal digits required')` and `RangeError('Negative result')`. The assertions here are regexes on the message, so they would not catch a swapped constructor — the prompt and the source review would.
- **Making `difference` throw.** Only `subtract` throws. `difference` is defined as absolute.

## Try it yourself

1. Add an `op=divmod` policy returning `[quotient, remainder]` by repeated subtraction. Which of the existing helpers can you reuse unchanged?
2. `multiply` allocates `x.length + y.length` slots but the product can be one digit shorter. Trace `'4' * '9'` and say which slot stays zero, and why `clean` is still needed.
3. Change `add` so it processes four digits at a time instead of one, using a base of 10000. What is the new bound on an intermediate sum, and does `clean` still work on the result?
4. In words: the multiplication loop adds into `digits[i + j + 1]` rather than `digits[i + j]`. Explain the off-by-one with a two-digit example, and say what the extra leading slot is for.
