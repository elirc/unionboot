# Identifier conversion — js-rest 152–155

**What you practise:** separating tokenization from rendering, so that four naming conventions share one parser.
**Prerequisites:** [08 Locate character runs](08-locate-character-runs.md) for class patterns; `String.prototype.match` and its `null` return; `Array.prototype.join`.
**Exercises:** 152: Identifier conversion: kebab, 153: Identifier conversion: snake, 154: Identifier conversion: camel, 155: Identifier conversion: pascal.

## The problem in plain words

The input is an arbitrary string — a column heading, a form label, a filename. You must turn it into a programming identifier in one of four conventions: `kebab-case`, `snake_case`, `camelCase` or `PascalCase`.

The job splits cleanly in two. First **tokenize**: chop the string into the meaningful words, throwing away whatever separated them. Then **render**: glue those words back together the way the target convention wants.

"Policy" is the rendering step. The tokenizer is identical in all four files, and it does the hard part: maximal runs of ASCII letters and digits are tokens, everything else is a separator, and repeated separators collapse.

Because every token is lowercased before rendering, the original casing of the input is discarded entirely. `Hello__WORLD 42` and `hello world 42` produce the same output in all four conventions.

## The contract you must honour

Taken from `tests/152.cjs` through `tests/155.cjs`:

- `"Hello__WORLD 42"` asserts `"hello-world-42"` for kebab, `"hello_world_42"` for snake, `"helloWorld42"` for camel and `"HelloWorld42"` for pascal. Three tokens come out of it: `hello`, `world`, `42`. The double underscore collapses to one separator, and `WORLD` is lowercased before being re-cased.
- `"---"` asserts `""` in all four. There are no tokens at all, so there is nothing to join.
- `"x"` asserts `"x"` for kebab, snake and camel, and `"X"` for pascal. This single case is what separates camel from pascal.
- The return value is a string, never an array.
- Every case ends with `assert.deepEqual(input, before, 'Input must not mutate')`. Strings are immutable, so this is automatic.
- Digits are token characters, not separators: `42` is its own token because the space before it separates it, and `world42` would be one token.

## Approach

1. Tokenize with `input.match(/[a-z0-9]+/gi)`. The `g` flag makes it return every match; `i` covers capitals; `+` makes each token maximal.
2. Handle the no-match case. `String.prototype.match` with a global regex returns `null`, not `[]`, when nothing matches — a long-standing API wart. `|| []` converts it, and every join below then produces `""`.
3. Lowercase each token: `.map(token => token.toLowerCase())`. Doing it here, once, means the renderers never have to think about the input's casing.
4. Render according to the convention:
   - kebab: `tokens.join('-')`;
   - snake: `tokens.join('_')`;
   - camel: capitalise every token except the first, then `join('')`;
   - pascal: capitalise every token, then `join('')`.
5. Return the string.

Cost: one regex scan plus one pass per render, O(n).

`capitalize` is `token => token[0].toUpperCase() + token.slice(1)`. It is safe here because the tokenizer never produces an empty token — `+` requires at least one character — so `token[0]` is always defined. That is worth stating out loud: on a token list that could contain `""`, this helper would produce `undefined` at the front of the string.

## Worked example — 152 Identifier conversion: kebab

The first input in `tests/152.cjs`, on line 2, is `"Hello__WORLD 42"`.

| index | 0–4 | 5–6 | 7–11 | 12 | 13–14 |
| --- | --- | --- | --- | --- | --- |
| text | `Hello` | `__` | `WORLD` | (space) | `42` |
| role | token | separator | token | separator | token |

The regex `/[a-z0-9]+/gi` walks left to right: it matches `Hello`, then fails on both underscores, then matches `WORLD`, then fails on the space, then matches `42`. So `match` returns `["Hello", "WORLD", "42"]` — three tokens, and the two-character separator produced no empty token between them.

| Step | Value |
| --- | --- |
| `match` | `["Hello", "WORLD", "42"]` |
| lowercase | `["hello", "world", "42"]` |
| `join('-')` | `"hello-world-42"` |

Asserted as `assert.deepEqual(solve(input),"hello-world-42")`. Snake reaches the same token list and joins with `'_'`; camel leaves `hello` alone and capitalises the rest to give `"helloWorld42"`; pascal capitalises all three to give `"HelloWorld42"`.

The second case, `"---"`, matches nothing, so `match` returns `null`, `|| []` makes it `[]`, and `[].join('-')` is `""` — asserted on line 3.

The third case, `"x"`, gives one token, `["x"]`. Kebab and snake join a single element and return `"x"` unchanged. Camel returns the first token as-is, also `"x"`. Pascal capitalises it and returns `"X"` — the one assertion in the family that tells camel and pascal apart.

The reference solution, as it now reads in `solutions/152.cjs`:

```js
function solve(input) {
  const matches = input.match(/[a-z0-9]+/gi) || [];
  const tokens = matches.map(token => token.toLowerCase());
  return tokens.join('-');
}
```

And the camel renderer from `solutions/154.cjs`, which is the only variant that treats one token differently from the rest:

```js
  const capitalize = token => token[0].toUpperCase() + token.slice(1);
  return tokens.map((token, index) => (index === 0 ? token : capitalize(token))).join('');
```

## Policy matrix — what changes between the variants

| ID | Variant | What differs in the prompt | What differs in the code |
| --- | --- | --- | --- |
| 152 | kebab | "return kebabCase identifier" | `tokens.join('-')` |
| 153 | snake | "return snakeCase identifier" | `tokens.join('_')` |
| 154 | camel | "camel lowercases first token" | capitalise where `index !== 0`, join with `''` |
| 155 | pascal | "pascal capitalizes every token" | capitalise every token, join with `''` |

## Pitfalls the tests are designed to catch

- **Forgetting that `match` returns `null`.** Without `|| []`, the `"---"` case throws `TypeError: Cannot read properties of null (reading 'map')` instead of returning `""`.
- **Splitting instead of matching.** `input.split(/[^a-z0-9]+/i)` on `"---"` yields `["", ""]`, two empty tokens, and kebab then returns `"-"` rather than `""`. `match` only ever returns real tokens, which is why it is the better tool here.
- **Not lowercasing before re-casing.** `"WORLD"` passed straight into the pascal renderer gives `"WORLD"`, so the first case returns `"HelloWORLD42"` instead of `"HelloWorld42"`.
- **Capitalising the first token in camel.** The `"x"` case asserts `"x"` for camel and `"X"` for pascal; the two files differ by exactly that condition.
- **Treating digits as separators.** `/[a-z]+/gi` drops `42` entirely, so the first case returns `"hello-world"`.
- **Using `toUpperCase()` on the whole token.** `token.toUpperCase()` gives `"WORLD"`, not `"World"`; only the first character should change.
- **Assuming a token can be empty when writing `capitalize`.** It cannot, because `+` guarantees at least one character — but if you change the tokenizer to `*`, `token[0]` becomes `undefined` and the output silently gains the text `undefined`.

## Checking your work

Run one exercise at a time:

```text
node js-rest/verify.cjs --id=152
```

Three things to check by eye first:

- Is the `|| []` there to absorb `match`'s `null`? That is the single most common crash in this family.
- Are the tokens lowercased before the renderer sees them?
- In 154, is the first token exempted from capitalisation, and in 155 is it not?

A useful self-test the suite does not include:

```js
solve("  API_v2 response  ");
```

Tokens are `api`, `v2`, `response`, so kebab gives `"api-v2-response"`, snake `"api_v2_response"`, camel `"apiV2Response"` and pascal `"ApiV2Response"`. Leading and trailing spaces must not produce empty tokens, which is the difference between `match` and `split`: a `split`-based tokenizer yields `["", "API", "v2", "response", ""]` and kebab then returns `"-api-v2-response-"`.

## Try it yourself

1. Add a `SCREAMING_SNAKE` variant. Which line changes, and does the lowercase step become redundant?
2. Make the tokenizer split `camelCaseInput` into `camel`, `case`, `input`, so round-tripping works. What does that do to the `"Hello__WORLD 42"` case?
3. Handle a leading digit: `"42 apples"` is not a valid JavaScript identifier in camel case. What would you do, and where does that belong — tokenizer or renderer?
4. In words: explain why tokenizing and rendering are kept separate here, and what would have to be duplicated four times if they were not.
