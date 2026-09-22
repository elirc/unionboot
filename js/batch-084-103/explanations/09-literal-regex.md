# Escape literal regex input — js/batch-084-103 92

**What you practise:** neutralising the characters a regular-expression engine treats as syntax, so that arbitrary text can be matched literally.
**Prerequisites:** the `RegExp` constructor versus `/…/` literal syntax; `Set` membership; spreading a string with `[...text]`.
**Exercises:** 92: Escape literal regex input.

## The problem in plain words

Users type search terms. If you drop a term straight into `new RegExp(term)`, a `.` matches any character, a `?` makes the previous thing optional, and an unbalanced `(` is a syntax error. Searching for the literal text `a.b` would wrongly match `axb`.

Escaping fixes that. Put a backslash in front of every character the engine treats as syntax, and the engine matches the character itself. `a.b` becomes `a\.b`, which matches only `a.b`.

The backslash itself is on the list, and it has to be. If it were not escaped, a user searching for `\d` would end up searching for any digit.

One character is deliberately *not* on the list: the forward slash. It only needs escaping inside `/…/` literal syntax, where it would otherwise end the literal. In the `RegExp` constructor the pattern is an ordinary string, so a slash is just a slash. The header says this outright.

## The contract you must honour

Taken from `tests/092-literal-regex.cjs`:

- The result is a pattern string, not a `RegExp`. The test wraps it itself: `new RegExp('^' + solve(text) + '$')`.
- With `text = 'a.b+[x](y)?'`, that anchored pattern must `.test(text)` true. That covers `.`, `+`, `[`, `]`, `(`, `)` and `?` in one go.
- `new RegExp('^' + solve('a.b') + '$').test('axb')` must be false. Escaping must actually change the meaning, not just pass text through.
- `solve('hello')` asserts `'hello'` exactly. Ordinary characters are returned untouched, so a blanket escape of everything would fail.
- `solve('')` asserts `''`.
- The last case takes `slash = String.fromCharCode(92)` — a single backslash — and requires the anchored pattern to match it. Leaving the backslash unescaped builds the pattern `^\$`, in which the backslash escapes the anchor and the regex matches the one-character string `$` instead. So this assertion only passes if the backslash is escaped.

## Approach

1. Build a `Set` of the characters that need escaping: `.` `*` `+` `?` `^` `$` `{` `}` `(` `)` `|` `[` `]` and the backslash.
2. Walk the input one character at a time.
3. Emit `backslash + character` for a member of the set, and the character unchanged otherwise.
4. Join the pieces back into a string.

The reference writes the backslash as `String.fromCharCode(92)` so that the character is unambiguous both in the source and inside the string literal.

Iteration uses `[...text]`, which walks code points rather than UTF-16 code units. None of the escapable characters lives outside the Basic Multilingual Plane, so this does not change which characters get escaped — it just avoids splitting an astral character into two halves on the way through.

## Worked example — 92 Escape literal regex input

Input, from the first assertion: `'a.b+[x](y)?'`.

| character | in the set? | emitted |
| --- | --- | --- |
| `a` | no | `a` |
| `.` | yes | `\.` |
| `b` | no | `b` |
| `+` | yes | `\+` |
| `[` | yes | `\[` |
| `x` | no | `x` |
| `]` | yes | `\]` |
| `(` | yes | `\(` |
| `y` | no | `y` |
| `)` | yes | `\)` |
| `?` | yes | `\?` |

Joined, the result is the pattern `a\.b\+\[x\]\(y\)\?`. The test builds `^a\.b\+\[x\]\(y\)\?$` and asserts on line 4 that it matches the original string `a.b+[x](y)?`.

The reference solution, as it now reads in `solutions/092-literal-regex.cjs`:

```js
function escapeRegex(text) {
  const backslash = String.fromCharCode(92);
  const special = new Set('.*+?^$' + '{}()|[]' + backslash);
  return [...text]
    .map((character) => (special.has(character) ? backslash + character : character))
    .join('');
}
```

## Variations you could build

| Variation | What would change in the code |
| --- | --- |
| Escape for `/…/` literal syntax too | add `/` to the set; nothing else moves |
| Escape for a glob matcher instead | a different, much shorter set: `*`, `?`, `[`, `]` |
| Build the anchored `RegExp` and return it | the function returns a `RegExp`, and the caller loses the ability to compose the pattern |

## Pitfalls the tests are designed to catch

- **Forgetting the backslash.** The last assertion passes a lone backslash. Left unescaped it is swallowed by the `$` the test appends, and the resulting regex matches something else entirely, so the `assert.ok` fails.
- **Escaping the backslash last.** If you escape `.` first and the backslash afterwards, the backslashes you just inserted get escaped again. Handling each input character exactly once, as the reference does, sidesteps the ordering question entirely.
- **Escaping everything.** `solve('hello')` must return `'hello'`, so a rule of "backslash before every character" fails, even though the anchored patterns would still match.
- **Missing `[` or `]`.** They are in the set on purpose: an unbalanced `[` opens a character class and is a syntax error.
- **Returning a `RegExp`.** The test concatenates the result into a larger pattern string.
- **Using `text.split('')` and assuming it is the same as `[...text]`.** It is not, for characters outside the Basic Multilingual Plane, which `split('')` cuts in half.

## Try it yourself

1. `-` is special inside a character class but not outside one. Would adding it to the set break any assertion here? Would it break anything at all?
2. Write the inverse, `unescapeRegex`, and say what it should do with a backslash followed by an ordinary letter.
3. In words: modern JavaScript has a `RegExp.escape` proposal. Compare its escape set with the one used here and explain any difference you find, rather than assuming the two must match.
