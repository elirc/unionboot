# Polynomial convolution — js-more 1959–1968

**What you practise:** multiplying polynomials by convolving their coefficient arrays, with an optional modular reduction and an optional trim of trailing zeros.
**Prerequisites:** polynomials as coefficient arrays in ascending exponent order; nested loops with an accumulating index; JavaScript's `%` on negative numbers; `Array.prototype.at`.
**Exercises:** 1959: modulus=0; trim=false, 1960: modulus=0; trim=true, 1961: modulus=2; trim=false, 1962: modulus=2; trim=true, 1963: modulus=5; trim=false, 1964: modulus=5; trim=true, 1965: modulus=7; trim=false, 1966: modulus=7; trim=true, 1967: modulus=11; trim=false, 1968: modulus=11; trim=true.

## The problem in plain words

A polynomial is stored as an array of coefficients in *ascending* exponent order: `[1, 2, 3]` means `1 + 2x + 3x²`. Multiplying two polynomials means multiplying every term of one by every term of the other and collecting the results by exponent — and because `x^i × x^j = x^(i+j)`, the coefficient at index `i+j` of the answer collects `a[i] * b[j]`. That operation on two arrays is called a convolution.

The width follows from the exponents: a polynomial of degree `d₁` times one of degree `d₂` has degree `d₁ + d₂`, so the result has `a.length + b.length - 1` coefficients. An empty array is not the zero polynomial here — it is no polynomial at all, and the prompt says either input empty yields `[]`.

"Policy" is two knobs. `modulus` reduces every coefficient into the range `0 … modulus-1`, which is what you want when the coefficients live in a finite field; `0` means no reduction. `trim` removes trailing zero coefficients, shrinking `[−6, 8, 0, 0]` to `[−6, 8]`; with `trim=false` the full width is kept even when the top coefficients are zero.

Those two choices are not cosmetic. "Untrimmed, no modulus" is what you want if the array is a fixed-width signal buffer and every slot means something. "Trimmed, modulus p" is what you want if the array is a polynomial over a finite field, where the degree is a property of the value and a leading zero coefficient would be a lie about it. The same eight lines of arithmetic serve both, which is the point of the family.

## The contract you must honour

Taken from `tests/1959.cjs` and its siblings, which check six pairs against an independent oracle built with `reduce`:

```js
for (const [a, b] of [[[],[]], [[0],[1]], [[1,2,3],[4,5]], [[1,-1],[1,1]], [[-3,4,0],[2,0]], [[-1,7,2],[5,-4,3]]])
  check({a, b}, oracle(a, b));
```

- The result is a plain array of numbers, ascending exponent order, the same convention as the input.
- `{a:[], b:[]}` gives `[]`. So does any pair where one side is empty — the oracle's first line is `if (!a.length || !b.length) return [];`.
- Width without trimming is exactly `a.length + b.length - 1`. For `{a:[-3,4,0], b:[2,0]}` that is four coefficients, `[-6, 8, 0, 0]`, even though the last two are zero.
- With `trim=true` the same input gives `[-6, 8]`. Trimming applies after the modular reduction, and it can empty the array: `{a:[0], b:[1]}` gives `[0]` untrimmed and `[]` trimmed.
- With a modulus, coefficients are non-negative. The oracle uses `((x % cfg.modulus) + cfg.modulus) % cfg.modulus`, so `{a:[-3,4,0], b:[2,0]}` under modulus 5 is `[4, 3, 0, 0]`, not `[-1, 3, 0, 0]`.
- `check` clones the input with `structuredClone` and finishes with `deep(input, before, 'Input must not mutate')`.
- The prompt states the inputs are "finite integer polynomial coefficients … values small enough for exact JS arithmetic", so no overflow handling is required.

## Approach

1. Return `[]` immediately if either input is empty. Doing this first means the width expression never has to cope with a negative length.
2. Allocate `out` with `a.length + b.length - 1` zeros.
3. Double loop: for every `i` in `a` and `j` in `b`, `out[i + j] += a[i] * b[j]`. That single line is the entire multiplication. Cost: O(len(a) × len(b)).
4. Reduce: `out.map(x => cfg.modulus ? ((x % cfg.modulus) + cfg.modulus) % cfg.modulus : x)`. The double `%` is not superstition — see the pitfalls.
5. Trim, if the policy says so: `while (reduced.length && reduced.at(-1) === 0) reduced.pop();`. The length guard is what stops it from popping an empty array forever.
6. Return the result. Nothing has been written to `input.a` or `input.b`; `out` was allocated locally and `map` produced a fresh array.

## Worked example — 1959 Polynomial convolution / scenario 1 — modulus=0; trim=false

Take the third pair from the test list, `{a: [1,2,3], b: [4,5]}` — that is `(1 + 2x + 3x²)(4 + 5x)`.

Width: `3 + 2 - 1 = 4`, so `out` starts as `[0, 0, 0, 0]`.

| `i` | `j` | `a[i] * b[j]` | Lands at | `out` after |
| --- | --- | --- | --- | --- |
| 0 | 0 | `1 × 4 = 4` | 0 | `[4, 0, 0, 0]` |
| 0 | 1 | `1 × 5 = 5` | 1 | `[4, 5, 0, 0]` |
| 1 | 0 | `2 × 4 = 8` | 1 | `[4, 13, 0, 0]` |
| 1 | 1 | `2 × 5 = 10` | 2 | `[4, 13, 10, 0]` |
| 2 | 0 | `3 × 4 = 12` | 2 | `[4, 13, 22, 0]` |
| 2 | 1 | `3 × 5 = 15` | 3 | `[4, 13, 22, 15]` |

For 1959 `cfg.modulus` is 0, so the `map` leaves every coefficient alone, and `cfg.trim` is false, so nothing is popped. The result is `[4, 13, 22, 15]`, that is `4 + 13x + 22x² + 15x³`. Multiplying the two polynomials by hand agrees: `4 + 5x + 8x + 10x² + 12x² + 15x³`.

Two rows collide at index 1 and two at index 2 — that is the convolution doing its job. The `+=` matters; an `=` would keep only the last contribution and produce `[4, 8, 12, 15]`.

The other five pairs in the test exercise the policies and the edge cases. Under scenario 1's `cfg` (`modulus: 0`, `trim: false`) they come out like this:

| `a` | `b` | Result | What it is there for |
| --- | --- | --- | --- |
| `[]` | `[]` | `[]` | the empty guard; without it the width would be `-1` |
| `[0]` | `[1]` | `[0]` | a zero coefficient that survives because `trim` is off |
| `[1,2,3]` | `[4,5]` | `[4,13,22,15]` | two collisions per middle index |
| `[1,-1]` | `[1,1]` | `[1,0,-1]` | `(1-x)(1+x) = 1 - x²`; the middle term cancels to exactly 0 |
| `[-3,4,0]` | `[2,0]` | `[-6,8,0,0]` | negative coefficients and two trailing zeros |
| `[-1,7,2]` | `[5,-4,3]` | `[-5,39,-21,13,6]` | the widest case, 3 + 3 − 1 = 5 coefficients |

Changing one knob at a time on the fifth row shows what each policy does. `[-3,4,0] × [2,0]` is `[-6, 8, 0, 0]` here; under `trim=true` (1960) it becomes `[-6, 8]`; under `modulus=5` (1963) it becomes `[4, 3, 0, 0]`, with `-6` wrapping up to `4` and `8` down to `3`; under both (1964) it becomes `[4, 3]`.

The second row is the case that needs the `reduced.length &&` guard: `[0] × [1]` is `[0]` untrimmed and `[]` trimmed, so the trimming loop has to cope with emptying the array completely.

The fourth row is worth noticing for a different reason. `[1,-1] × [1,1]` produces a middle coefficient of exactly `0` — `1×1 + (-1)×1` — which `trim` will not touch because it is not at the end. Only trailing zeros go.

The test does not list these results. It calls `check({a, b}, oracle(a, b))`, where the oracle computes each coefficient independently with `a.reduce((sum, x, i) => sum + x * (b[degree - i] ?? 0), 0)` — the same sum, gathered per output index rather than scattered from the inputs.

The reference solution, as it now reads in `solutions/1959.cjs`:

```js
function polynomial(input) {
  if (!input.a.length || !input.b.length) {
    return [];
  }
  const out = Array(input.a.length + input.b.length - 1).fill(0);
  for (let i = 0; i < input.a.length; i++) {
    for (let j = 0; j < input.b.length; j++) {
      out[i + j] += input.a[i] * input.b[j];
    }
  }
  const reduced = out.map(x => (cfg.modulus ? ((x % cfg.modulus) + cfg.modulus) % cfg.modulus : x));
  if (cfg.trim) {
    while (reduced.length && reduced.at(-1) === 0) {
      reduced.pop();
    }
  }
  return reduced;
}
```

## Policy matrix — what changes between the variants

`cfg.modulus` appears once, in the `map`; `cfg.trim` once, as the `if` around the `while`.

| ID | Variant | Semantic key | What differs in the code |
| --- | --- | --- | --- |
| 1959 | modulus=0; trim=false | `{"modulus":0,"trim":false}` | baseline: `0` is falsy, so the `map` is the identity; nothing is popped |
| 1960 | modulus=0; trim=true | `{"modulus":0,"trim":true}` | exact coefficients, then trailing zeros popped |
| 1961 | modulus=2; trim=false | `{"modulus":2,"trim":false}` | every coefficient becomes 0 or 1 — arithmetic over GF(2) |
| 1962 | modulus=2; trim=true | `{"modulus":2,"trim":true}` | GF(2) plus trimming; most results shrink |
| 1963 | modulus=5; trim=false | `{"modulus":5,"trim":false}` | coefficients in `0..4`; `-6` becomes `4` |
| 1964 | modulus=5; trim=true | `{"modulus":5,"trim":true}` | the same, then trimmed |
| 1965 | modulus=7; trim=false | `{"modulus":7,"trim":false}` | coefficients in `0..6` |
| 1966 | modulus=7; trim=true | `{"modulus":7,"trim":true}` | coefficients in `0..6`, then trimmed |
| 1967 | modulus=11; trim=false | `{"modulus":11,"trim":false}` | coefficients in `0..10` |
| 1968 | modulus=11; trim=true | `{"modulus":11,"trim":true}` | coefficients in `0..10`, then trimmed |

Five moduli × two trim settings. The ordering of the two steps matters and is fixed: reduce first, then trim — a coefficient that is a non-zero multiple of the modulus becomes 0 and only then becomes trimmable.

## Pitfalls the tests are designed to catch

- **`out[i + j] = a[i] * b[j]`.** Overwriting instead of accumulating loses every collision. `[1,2,3] × [4,5]` is the case that shows it.
- **`x % cfg.modulus` alone.** JavaScript's remainder keeps the sign of the dividend: `-6 % 5` is `-1`, not `4`. The oracle reduces into `0 … m-1`, so the `((x % m) + m) % m` form is required, and `{a:[-3,4,0], b:[2,0]}` under any non-zero modulus catches it.
- **Treating `modulus: 0` as a real modulus.** `x % 0` is `NaN`. The falsy check on `cfg.modulus` is what makes 0 mean "no reduction".
- **Computing the width before the empty check.** With both inputs empty, `0 + 0 - 1` is `-1`, and `Array(-1)` throws `RangeError: Invalid array length`. Return `[]` first, or clamp with `Math.max(0, …)`.
- **Trimming before reducing.** Under modulus 5, a coefficient of `10` is not zero until it is reduced. Reducing second would leave a trailing zero in place.
- **Trimming without the length guard.** `reduced.at(-1)` on an empty array is `undefined`, which is not `=== 0`, so the loop does stop — but the guard states the intent and protects the `[0]` case from depending on that subtlety.
- **Trimming leading zeros too.** Only *trailing* zeros go: those are the high-degree terms. `[0, 1]` is `x`, and dropping its first coefficient would change the polynomial.
- **Reusing `out` as the reduced array.** `out.map(...)` returns a new array, which is what `reduced` holds; popping from `out` instead would trim the unreduced values.
- **Writing into `input.a` or `input.b`.** `check` deep-compares the input afterwards with the message `'Input must not mutate'`.

## Checking your work

```text
node js-more/verify.cjs --id=1959
node js-more/verify.cjs --starters --id=1959
```

Multiply `(1 + 2x + 3x²)(4 + 5x)` on paper and compare all four coefficients. Then check `{a:[-3,4,0], b:[2,0]}` under your own `cfg` — it is the pair that exercises the sign, the trailing zeros and the width all at once.

## Try it yourself

1. Rewrite the double loop as the oracle does it — one `reduce` per output index — and confirm the results are identical. Which version reads better, and which allocates less?
2. Add a policy `trim='both'` that also drops leading zeros. What would the caller have to be told for the result to remain meaningful?
3. The double loop is O(n²). Look up Karatsuba multiplication and say which of these ten variants would benefit at the sizes the tests use.
4. In words: explain why the result width is `a.length + b.length - 1` by naming the highest and lowest exponent that can appear.
