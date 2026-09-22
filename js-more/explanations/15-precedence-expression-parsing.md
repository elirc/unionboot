# Precedence expression parsing — js-more 1859–1868

**What you practise:** writing a precedence-climbing parser by hand — tokenize, then recurse on operator precedence — instead of reaching for `eval`.
**Prerequisites:** regular expressions with alternation and the `g` flag; recursion; the difference between left- and right-associative operators; `Number.isFinite`; `Object.is` and negative zero.
**Exercises:** 1859: standard/left/no unary plus, 1860: standard/right, 1861: flat/left, 1862: flat/right, 1863: standard/left/unary plus, 1864: standard/right/unary plus, 1865: flat/left/unary plus, 1866: flat/right/unary plus, 1867: standard/right + offset 1, 1868: flat/right/unary plus + offset 1.

## The problem in plain words

The input is a string such as `'2 + 3 * 4'`. The output is the number it denotes. Between those two facts sits every decision a language designer makes: which operator grabs its operands first, what happens when two operators of the same strength meet, and which strings are not expressions at all.

Two things are off the table. `eval` and `new Function` are banned by the prompt ("No eval/Function"), so you write the parser. And the grammar is small: integers and decimals, parentheses, `+ - * / ^`, and whitespace anywhere.

Everything that is not a valid expression — an empty string, two numbers side by side, a dangling operator, an unbalanced bracket, a letter, a division by zero — is reported the same way: `throw new SyntaxError('Invalid expression')`. There is no error taxonomy to learn, which is a relief, but it also means a parser that accepts something it should reject fails loudly.

"Policy" here is three knobs. `precedence` chooses between the school rule (`*` and `/` bind tighter than `+` and `-`) and a flat rule where all four share one level and the expression runs left to right. `power` makes `^` left- or right-associative. `unaryPlus` decides whether a leading `+` is legal. Two late variants add a fourth knob, `offset`, which shifts the answer.

## The contract you must honour

Taken from `tests/1859.cjs` and its siblings. The tests compute the expected value from `cfg`, so one reading covers all ten:

- `check('2 + 3 * 4', (cfg.precedence==='flat' ? 20 : 14) + extra)` — the precedence knob, where `extra` is `cfg.offset || 0`.
- `check('2 ^ 3 ^ 2', (cfg.power==='left' ? 64 : 512) + extra)` — the associativity knob. `(2^3)^2 = 64`, `2^(3^2) = 512`.
- `check('(2 + 3) * 4', 20 + extra)` — parentheses override both knobs.
- `check('-2 ^ 2', 4 + extra)` — unary minus binds tighter than `^`, so this is `(-2)^2`, not `-(2^2)`.
- `check(' 1.5 * 4 - 2 ', 4 + extra)` — leading, trailing and internal whitespace is skipped, and decimals parse.
- `check('8 / 2 / 2', 2 + extra)` — `/` is left-associative under both precedence settings.
- With `unaryPlus` true: `check('+2', 2 + extra)`. With it false: `assert.throws(()=>solve('+2'), /Invalid expression/)`.
- Six rejects, every variant: `assert.throws(()=>solve(text), /Invalid expression/)` for `''`, `'1 2'`, `'1 +'`, `'(1'`, `'1)'`, `'1a'`, `'1 / 0'`.
- The input is a string, and `check` still runs `deep(input, before, 'Input must not mutate')` — strings are immutable, so this costs you nothing, but it is there.
- The prompt says "Normalize -0" and "No eval/Function". Neither is exercised by a visible case: no test input evaluates to negative zero, and nothing inspects the source. Both are source-review requirements; the `CONTRACT` section names that explicitly.

## Approach

1. **Tokenize.** `input.match(/\d+(?:\.\d+)?|[()+*\-\/^]/g) || []` returns every number and every single-character operator, in order, and silently skips whitespace — and everything else.
2. **Validate the tokenization.** Because the regular expression skips what it does not recognize, `'1a'` tokenizes to `['1']`. Compare `tokens.join('')` with `input.replace(/\s/g,'')`: equal means nothing was skipped except whitespace. Unequal is `SyntaxError('Invalid expression')`. This single line is the whole lexical error check.
3. **Keep one cursor.** `let pos = 0` is shared by both parsing functions. Using a module- or closure-level cursor rather than passing indices around is what keeps the two functions short.
4. **`atom()` reads one operand.** A `(` recurses into `parse(0)` and demands a matching `)`. A `-` is unary minus: return `-atom()`, which is why `-2 ^ 2` is `(-2)^2` — the minus is consumed before any binary operator is looked at. A `+` is unary plus, allowed only under the policy. Anything else must start with a digit.
5. **`parse(minPrecedence)` reads one expression.** Take an atom, then loop: look at the next token; if it is not an operator, that is a syntax error; if its precedence is below `minPrecedence`, stop and let the caller handle it; otherwise consume it and recurse for the right operand.
6. **Associativity is one number.** Recursing at `level + 1` means the recursive call refuses operators of the same level, so they fall back to the outer loop and group to the left. Recursing at `level` lets the inner call take them, which groups to the right. `cfg.power` switches exactly that for `^`.
7. **Finish.** If `pos` has not reached the end, there is trailing junk (`'1)'`). If the result is not finite, something divided by zero or overflowed. Either is `SyntaxError('Invalid expression')`. Finally normalize `-0` to `0`.

## Worked example — 1859 Precedence expression parsing / scenario 1 — precedence=standard; power=left; unaryPlus=false

Input, quoted from `tests/1859.cjs`: `check('2 + 3 * 4', (cfg.precedence==='flat'?20:14)+extra)`. For 1859, `cfg.precedence` is `'standard'` and `cfg.offset` is undefined, so the expected value is `14`.

Tokens: `['2', '+', '3', '*', '4']`. Precedence: `+` and `-` are 1, `*` and `/` are 2, `^` is 3.

| Step | Call | `pos` before | Action | `left` |
| --- | --- | --- | --- | --- |
| 1 | `parse(0)` | 0 | `atom()` reads `'2'` | `2` |
| 2 | `parse(0)` | 1 | next is `'+'`, level 1 ≥ 0, consume it | `2` |
| 3 | `parse(2)` | 2 | `atom()` reads `'3'` | `3` |
| 4 | `parse(2)` | 3 | next is `'*'`, level 2 ≥ 2, consume it | `3` |
| 5 | `parse(3)` | 4 | `atom()` reads `'4'`, then `pos === tokens.length`, return `4` | — |
| 6 | `parse(2)` | 5 | `left = 3 * 4 = 12`, loop ends, return `12` | `12` |
| 7 | `parse(0)` | 5 | `left = 2 + 12 = 14`, loop ends, return `14` | `14` |

Step 3 is the one that matters. Having consumed `+` at level 1, the reference recurses with `minPrecedence = 1 + 1 = 2`. That inner call is therefore willing to take `*` (level 2) but would refuse another `+` (level 1) — which is how `2 + 3 + 4` stays left-grouped while `2 + 3 * 4` does not.

The second case, `'2 ^ 3 ^ 2'`, shows the associativity knob on the same machinery:

| Variant | Recursion level after `^` | Inner call sees the second `^` | Result |
| --- | --- | --- | --- |
| 1859, `power=left` | `3 + 1 = 4` | level 3 < 4, refuses, returns `3` | `(2^3)^2 = 64` |
| 1860, `power=right` | `3 + 0 = 3` | level 3 ≥ 3, takes it, returns `9` | `2^(3^2) = 512` |

Both numbers are asserted: `check('2 ^ 3 ^ 2', (cfg.power==='left'?64:512)+extra)`.

The reference solution, as it now reads in `solutions/1859.cjs`:

```js
function expression(input) {
  const tokens = input.match(/\d+(?:\.\d+)?|[()+*\-\/^]/g) || [];
  if (tokens.join('') !== input.replace(/\s/g, '')) {
    throw new SyntaxError('Invalid expression');
  }
  let pos = 0;

  const precedence = op => {
    if (op === '^') return 3;
    if (cfg.precedence === 'flat') return 1;
    return (op === '+' || op === '-') ? 1 : 2;
  };

  function atom() {
    const token = tokens[pos++];
    if (token === '(') {
      const inner = parse(0);
      if (tokens[pos++] !== ')') throw new SyntaxError('Invalid expression');
      return inner;
    }
    if (token === '-') return -atom();
    if (token === '+' && cfg.unaryPlus) return atom();
    if (token === undefined || !/^\d/.test(token)) throw new SyntaxError('Invalid expression');
    return Number(token);
  }

  function parse(minPrecedence) {
    let left = atom();
    while (pos < tokens.length && tokens[pos] !== ')') {
      const op = tokens[pos];
      if (!['+', '-', '*', '/', '^'].includes(op)) throw new SyntaxError('Invalid expression');
      const level = precedence(op);
      if (level < minPrecedence) break;
      pos++;
      const right = parse(level + (op === '^' && cfg.power === 'right' ? 0 : 1));
      left = op === '+' ? left + right
        : op === '-' ? left - right
        : op === '*' ? left * right
        : op === '/' ? left / right
        : left ** right;
    }
    return left;
  }

  const result = parse(0);
  if (pos !== tokens.length || !Number.isFinite(result)) {
    throw new SyntaxError('Invalid expression');
  }
  return Object.is(result, -0) ? 0 : result;
}
```

## Policy matrix — what changes between the variants

| ID | Variant | Semantic key | What differs in the code |
| --- | --- | --- | --- |
| 1859 | standard; power=left | `{"power":"left","precedence":"standard","unaryPlus":false}` | baseline: `precedence` returns 2 for `* /`; `^` recurses at `level + 1` |
| 1860 | standard; power=right | `{"power":"right","precedence":"standard","unaryPlus":false}` | `^` recurses at `level + 0` |
| 1861 | flat; power=left | `{"power":"left","precedence":"flat","unaryPlus":false}` | `precedence` returns 1 for `* /` as well, so the loop runs left to right |
| 1862 | flat; power=right | `{"power":"right","precedence":"flat","unaryPlus":false}` | both of the above |
| 1863 | standard; power=left; unaryPlus | `{"power":"left","precedence":"standard","unaryPlus":true}` | `atom` accepts a leading `'+'` and recurses instead of throwing |
| 1864 | standard; power=right; unaryPlus | `{"power":"right","precedence":"standard","unaryPlus":true}` | right-associative `^` plus the unary-plus atom |
| 1865 | flat; power=left; unaryPlus | `{"power":"left","precedence":"flat","unaryPlus":true}` | flat levels plus the unary-plus atom |
| 1866 | flat; power=right; unaryPlus | `{"power":"right","precedence":"flat","unaryPlus":true}` | all three knobs on |
| 1867 | standard; power=right; offset=1 | `{"offset":1,"power":"right","precedence":"standard","unaryPlus":false}` | the final line becomes `return (Object.is(result,-0)?0:result) + cfg.offset;` |
| 1868 | flat; power=right; unaryPlus; offset=1 | `{"offset":1,"power":"right","precedence":"flat","unaryPlus":true}` | the same `+ cfg.offset`, with the flat and unary-plus knobs on |

The three boolean-ish knobs give the eight combinations 1859–1866; 1867 and 1868 re-use two of those settings and add the offset, which the tests pick up through `const extra = cfg.offset || 0`.

## Pitfalls the tests are designed to catch

- **Trusting `match` to validate.** `'1a'.match(/\d+(?:\.\d+)?|[()+*\-\/^]/g)` is `['1']`, a perfectly good token list for the number 1. Without the `tokens.join('') !== input.replace(/\s/g,'')` comparison, `'1a'` evaluates to `1` and the assertion `assert.throws(()=>solve('1a'), /Invalid expression/)` fails.
- **Forgetting the end-of-input check.** `'1)'` parses as the expression `1` and then stops at the `)`. Only `pos !== tokens.length` catches it.
- **Letting division by zero through.** `8 / 0` is `Infinity` in JavaScript, not an exception. `!Number.isFinite(result)` is what turns `'1 / 0'` into the required `SyntaxError`.
- **Handling unary minus as a binary operator with low precedence.** That would make `-2 ^ 2` into `-(2^2) = -4`; the test asserts `4`. Treat the minus inside `atom()`, before any operator is considered.
- **Getting associativity backwards.** Recursing at `level` for every operator would make `8 / 2 / 2` into `8 / (2/2) = 8`; the test asserts `2`. Only `^` under `power=right` recurses at `level`.
- **Throwing a plain `Error`.** The assertions use `/Invalid expression/`, which a plain `Error` with that message would satisfy — but the prompt names `SyntaxError('Invalid expression')` and the message must be exactly that string.
- **Reaching for `eval`.** `eval('2 + 3 * 4')` returns `14` and passes several cases outright. It is banned by the prompt, cannot express the `flat` or `power=left` policies, and is caught by source review.
- **Dropping the `-0` normalization because no test needs it.** The prompt asks for it. `-0` and `0` are different under `assert.deepEqual` from `node:assert/strict`, so a future case would notice.

## Checking your work

```text
node js-more/verify.cjs --id=1859
node js-more/verify.cjs --starters --id=1859
```

Before running, evaluate these by hand under your own `cfg` and compare with what your code returns: `'2 + 3 * 4'`, `'2 ^ 3 ^ 2'`, `'-2 ^ 2'`, `'8 / 2 / 2'`.

## Try it yourself

1. Add `%` (remainder) at the same level as `*` and `/`. How many lines change, and does the flat policy need anything extra?
2. Make the parser return the parse tree (`{op, left, right}`) instead of a number, and evaluate the tree in a second pass. Which of the two passes does `cfg.power` now live in?
3. Add a `'!'` postfix factorial that binds tighter than `^`. Where does it belong — in `atom`, or in the `parse` loop?
4. In words: explain why `parse(level + 1)` produces left-associativity, using `8 / 2 / 2` and naming the value of `minPrecedence` in each call.
