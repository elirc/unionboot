# Normalize an absolute virtual path — js/batch-084-103 93

**What you practise:** collapsing a POSIX-style path with a stack, and resisting the temptation to interpret anything the specification does not mention.
**Prerequisites:** `String.prototype.split` and what it does with consecutive separators; `Array.prototype.pop` on an empty array; `String.prototype.startsWith`.
**Exercises:** 93: Normalize an absolute virtual path.

## The problem in plain words

A path such as `/a//b/../c/.` has redundancy in it: a doubled slash, a `..` that undoes the `b`, and a trailing `.` that goes nowhere. Normalising means producing the shortest path that names the same location — here, `/a/c`.

The rules are small and each one maps to a line of code. An empty segment (from `//` or a trailing `/`) means nothing. A `.` segment means "stay here". A `..` segment means "go up one", except at the root, where there is nowhere to go and it is simply ignored. The result always starts with `/` and never ends with one, unless it *is* `/`.

The word "virtual" in the title is a warning. This function touches no filesystem, resolves no symbolic links, decodes no percent-escapes and treats a backslash as an ordinary character. `%2e%2e` is *not* `..`; it is a six-character segment whose name happens to look like an escape. The test checks that.

## The contract you must honour

Taken from `tests/093-normalize-posix.cjs`:

- `solve('/a//b/../c/.')` asserts `'/a/c'`.
- `solve('/../../')` asserts `'/'`. Going above the root is a no-op, and the root keeps its single slash.
- `solve('/a/')` asserts `'/a'`. The trailing slash is dropped.
- `solve('a/b')` asserts a `TypeError`. The input must begin with `/`; a relative path is rejected, as is a non-string.
- `solve('/a/%2e%2e')` asserts `'/a/%2e%2e'` — unchanged. No URL decoding happens, so the segment is kept as a name.

## Approach

1. Reject anything that is not a string or does not start with `/`, with `throw new TypeError('Absolute path required')`.
2. Split on `/`. A leading slash produces an empty first segment; a doubled slash produces an empty middle segment; a trailing slash produces an empty last segment.
3. Walk the segments, maintaining a stack of kept components:
   - `''` or `'.'` — skip;
   - `'..'` — `pop()`, which is harmlessly a no-op when the stack is empty;
   - anything else — `push()`.
4. Return `'/' + components.join('/')`.

Step 4 is where the trailing-slash rule comes out for free. `join` puts a separator only *between* components, so the result can only end in `/` when the stack is empty — and that case is the root, which is exactly what `'/'` alone should be.

## Worked example — 93 Normalize an absolute virtual path

Input, from the first assertion: `'/a//b/../c/.'`.

`text.split('/')` gives `['', 'a', '', 'b', '..', 'c', '.']` — note the empty string at index 0 from the leading slash, and the one at index 2 from the doubled slash.

| segment | classification | stack after |
| --- | --- | --- |
| `''` | empty, skip | `[]` |
| `'a'` | component | `['a']` |
| `''` | empty, skip | `['a']` |
| `'b'` | component | `['a','b']` |
| `'..'` | up one, `pop()` | `['a']` |
| `'c'` | component | `['a','c']` |
| `'.'` | here, skip | `['a','c']` |

`'/' + ['a','c'].join('/')` is `'/a/c'`, asserted on line 4 of the test file.

The `'/../../'` case runs the same machinery: the segments are `['', '..', '..', '']`, the two `pop()` calls both act on an empty stack and do nothing, and `'/' + ''` is `'/'`.

The reference solution, as it now reads in `solutions/093-normalize-posix.cjs`:

```js
function normalizePath(text) {
  if (typeof text !== 'string' || !text.startsWith('/')) {
    throw new TypeError('Absolute path required');
  }
  const components = [];
  for (const segment of text.split('/')) {
    if (segment === '' || segment === '.') {
      continue;
    }
    if (segment === '..') {
      components.pop();
    } else {
      components.push(segment);
    }
  }
  return '/' + components.join('/');
}
```

## Variations you could build

| Variation | What would change in the code |
| --- | --- |
| Allow relative paths, resolving `..` above the start by keeping it | the `..` branch pushes `'..'` when the stack is empty or ends in `'..'`; the leading `/` becomes conditional |
| Join two paths, `resolve(base, relative)` | concatenate the segment lists before the loop; the loop itself is unchanged |
| Treat `..` above the root as an error | replace the bare `pop()` with a length check and a throw |

## Pitfalls the tests are designed to catch

- **Calling `decodeURIComponent` on segments.** `%2e%2e` would become `..` and the last assertion would return `'/'` instead of `'/a/%2e%2e'`.
- **Special-casing the trailing slash with a `replace` or a `slice`.** Unnecessary, and easy to get wrong for the root: `'/a/'` and `'/'` need opposite treatment, and the `join` handles both.
- **Throwing on `..` at the root.** The second assertion expects `'/'`, not an error.
- **Using `filter(Boolean)` to drop empty segments.** It works for `''`, but bear in mind it would also drop a segment named `'0'`, which is a legitimate directory name — a bug this test would not catch.
- **Skipping the `typeof` half of the guard.** `startsWith` on a non-string throws a `TypeError` anyway, but with a message about the method, not about the contract. The explicit check is what makes the intent readable.
- **Returning `components.join('/')` without the leading `'/'`.** The result must be absolute.

## Try it yourself

1. Add support for a `~` segment meaning "home", substituted from a second argument. Where in the loop does it belong, and does it need to run before or after the `..` handling?
2. Make the function also collapse a segment that is entirely dots, such as `'...'`. Should it? Check what POSIX says before you decide.
3. In words: this function never touches a filesystem, yet real path resolution on disk can give a different answer for the same input. Name the feature that causes the divergence and describe an example.
