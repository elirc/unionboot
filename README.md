# unionboot — JavaScript exercise pack

33 standalone exercises, ordered easy → harder. No dependencies, no test
runner — just you, the file, and `node`.

## How to work

1. Open an exercise file in your editor (e.g. `01-temperature.js`).
2. Write your code where the `// your code here` marker is.
3. Run it and compare against the `// expected:` comments:

   ```
   node 01-temperature.js
   ```

4. Stuck for a while? The full solutions are in `SOLUTIONS.md` — but earn
   the peek: try 10 minutes of debugging first, and prefer reading the
   solution over copying it.

## Order of exercises

| # | File | Topic | Difficulty |
|---|------|-------|------------|
| 01 | temperature.js | functions & return values | ⭐ |
| 02 | initials.js | strings & arrays | ⭐ |
| 03 | second-largest.js | arrays & Sets | ⭐ |
| 04 | word-count.js | objects as maps | ⭐ |
| 05 | fizzbuzz.js | loops & conditionals | ⭐ |
| 06 | counter-closure.js | closures | ⭐ |
| 07 | honor-roll.js | filter / map / sort / reduce | ⭐⭐ |
| 08 | shopping-cart.js | reduce + business rules | ⭐⭐ |
| 09 | capitalize.js | strings & map | ⭐ |
| 10 | flatten.js | arrays | ⭐⭐ |
| 11 | palindrome.js | strings | ⭐⭐ |
| 12 | chunk.js | arrays & slicing | ⭐⭐ |
| 13 | first-unique-char.js | objects as maps | ⭐⭐ |
| 14 | digital-root.js | while loops & digit math | ⭐⭐ |
| 15 | reverse-words.js | strings & arrays | ⭐⭐ |
| 16 | anagram.js | sorting or maps | ⭐⭐ |
| 17 | lru-cache.js | classes & Map ordering | ⭐⭐⭐ |
| 18 | event-emitter.js | classes, callbacks | ⭐⭐⭐ |
| 19 | deep-equal.js | recursion | ⭐⭐⭐ |
| 20 | async-sequence.js | promises & async/await | ⭐⭐⭐ |
| 21 | retry.js | promises & timers | ⭐⭐⭐ |
| 22 | stack-queue.js | stack (balanced brackets) | ⭐⭐⭐ |
| 23 | todo-reducer.js | pure functions & immutability | ⭐⭐⭐ |
| 24 | prototype-chain.js | classes, inheritance, `this` | ⭐⭐⭐ |
| 25 | group-by.js | higher-order functions | ⭐⭐ |
| 26 | pipeline.js | function composition | ⭐⭐⭐ |
| 27 | memoize.js | closures + Map cache | ⭐⭐⭐ |
| 28 | tree-sum.js | recursion on trees | ⭐⭐ |
| 29 | csv-parse.js | strings → objects | ⭐⭐⭐ |
| 30 | random-pick.js | closures + randomness | ⭐⭐⭐ |
| 31 | template-engine.js | strings, regex, data lookup | ⭐⭐⭐⭐ |
| 32 | diff-arrays.js | Sets & efficiency | ⭐⭐⭐ |
| 33 | word-ladder.js | BFS over a graph | ⭐⭐⭐⭐ |

## Suggested path

- **Warm-up (day 1–2):** 01–08, then 09, 14, 25.
- **Core (day 3–5):** 10–16, 28, 22 — these teach the array/string/stack
  patterns that show up in every interview.
- **Objects & functions (day 6–8):** 17, 18, 19, 23, 24, 26, 27.
- **Async (day 9–10):** 20, 21 — do 20 twice: once with `async/await`,
  once with raw `.then()`.
- **Boss level:** 29, 30, 31, 32, 33.

## Concepts cheat-sheet

Things you'll likely need, in the order they appear:

- Template literals: `` `Hello ${name}` ``
- `arr.map(f)` / `arr.filter(f)` / `arr.reduce(f, init)` — all non-mutating
- `[...new Set(arr)]` — dedupe
- `arr.sort((a, b) => a - b)` — numeric sort (default sort is *string* sort!)
- `Object.entries(obj)` → `[key, value]` pairs
- `str.split("")` / `arr.join("—")`
- `str.replace(/pattern/g, ...)` — regex with global flag
- Closures: a function remembers the variables in scope where it was created
- `class X extends Y { constructor() { super(); } }`
- `new Promise((resolve, reject) => ...)` + `async/await` + `try/catch`
- `setTimeout(fn, ms)`
- A stack = an array with `push()` and `pop()`
- BFS = a queue: array with `push()` and `shift()`, loop `while (queue.length)`
