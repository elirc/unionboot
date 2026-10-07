# unionboot — JavaScript exercise pack

This README covers the **83 standalone root exercises** (`01-temperature.js` … `83-async-pipeline.js`),
ordered easy → harder. Those files need no dependencies and no test runner — just you, the file, and
`node`.

The repository has grown well beyond them into a multi-language pack (TypeScript, React, C#,
ASP.NET Core and SQL tracks with their own verifiers). See
[What else is in this repository](#what-else-is-in-this-repository) at the end, and
`START-HERE.txt` for the full inventory.

## How to work

1. Open an exercise file in your editor (e.g. `01-temperature.js`).
2. Write your code where the `// your code here` marker is.
3. Run it and compare against the `// expected:` comments:

   ```
   node 01-temperature.js
   ```

4. Stuck for a while? The full solutions are in `SOLUTIONS.md` — but earn
   the peek: try 10 minutes of debugging first, and prefer reading the
   solution over copying it. `SOLUTIONS.md` now covers all 83 exercises,
   each with the reference code, a "Why it works" explanation and a
   worked trace of the exercise file's own sample input.

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
| 34 | two-sum.js | single-pass Map lookup | ⭐⭐ |
| 35 | move-zeroes.js | two pointers, in place | ⭐⭐ |
| 36 | max-subarray.js | Kadane's algorithm | ⭐⭐⭐ |
| 37 | roman-to-int.js | value tables + lookahead | ⭐⭐ |
| 38 | int-to-roman.js | greedy with a value table | ⭐⭐ |
| 39 | string-compression.js | run-length encoding | ⭐⭐ |
| 40 | longest-unique-substring.js | sliding window | ⭐⭐⭐ |
| 41 | longest-common-prefix.js | strings & early exit | ⭐⭐ |
| 42 | merge-sorted.js | two pointers | ⭐⭐ |
| 43 | primes-sieve.js | Sieve of Eratosthenes | ⭐⭐⭐ |
| 44 | power-set.js | bitmask or recursion | ⭐⭐⭐ |
| 45 | permutations.js | backtracking | ⭐⭐⭐ |
| 46 | rotate-array.js | reversal trick, in place | ⭐⭐⭐ |
| 47 | debounce.js | timers & closures | ⭐⭐⭐ |
| 48 | throttle.js | timers & closures | ⭐⭐ |
| 49 | fibonacci-memo.js | recursion → memo → loop | ⭐⭐⭐ |
| 50 | clone-deep.js | recursion, cycles, Dates | ⭐⭐⭐⭐ |
| 51 | product-except-self.js | prefix/suffix products | ⭐⭐⭐ |
| 52 | unique-paths.js | dynamic programming grid | ⭐⭐⭐ |
| 53 | climbing-stairs.js | DP, fibonacci in disguise | ⭐⭐ |
| 54 | coin-change.js | dynamic programming | ⭐⭐⭐ |
| 55 | sqlite-free-json-db.js | classes, files, JSON | ⭐⭐⭐ |
| 56 | bank-account.js | private fields, getters, errors | ⭐⭐⭐ |
| 57 | linked-list.js | pointers via object references | ⭐⭐⭐ |
| 58 | binary-search-tree.js | recursion + invariant | ⭐⭐⭐ |
| 59 | binary-search.js | the O(log n) classic | ⭐⭐ |
| 60 | promise-all.js | promise bookkeeping | ⭐⭐⭐ |
| 61 | all-settled.js | fulfilled vs rejected records | ⭐⭐⭐ |
| 62 | concurrency-pool.js | async scheduling with a limit | ⭐⭐⭐⭐ |
| 63 | async-reduce.js | sequential async steps | ⭐⭐ |
| 64 | with-timeout.js | timer lifecycle & microtasks | ⭐⭐⭐ |
| 65 | abortable-delay.js | AbortSignal cleanup | ⭐⭐⭐⭐ |
| 66 | query-parse.js | string splitting & decoding | ⭐⭐⭐ |
| 67 | pagination.js | clamping & off-by-one | ⭐⭐ |
| 68 | stable-multi-sort.js | comparators & stable ties | ⭐⭐⭐ |
| 69 | object-path.js | own properties vs truthiness | ⭐⭐⭐ |
| 70 | flatten-object.js | recursion with a path prefix | ⭐⭐⭐ |
| 71 | unflatten-object.js | validation then construction | ⭐⭐⭐⭐ |
| 72 | merge-intervals.js | sort then merge | ⭐⭐⭐ |
| 73 | peak-overlap.js | sweep line | ⭐⭐⭐ |
| 74 | top-k-words.js | counting + two-level sort | ⭐⭐⭐ |
| 75 | running-median.js | binary-search insertion | ⭐⭐⭐ |
| 76 | transaction-cart.js | atomic edits on a draft | ⭐⭐⭐⭐ |
| 77 | state-machine.js | closures + graph validation | ⭐⭐⭐ |
| 78 | undo-redo.js | one array, one cursor | ⭐⭐⭐⭐ |
| 79 | queue-class.js | O(1) FIFO with a head index | ⭐⭐⭐ |
| 80 | validation-schema.js | rule cascades & error order | ⭐⭐⭐⭐ |
| 81 | topo-sort.js | Kahn topological sort (BFS) | ⭐⭐⭐⭐ |
| 82 | rolling-average.js | ring buffer + running sum | ⭐⭐ |
| 83 | async-pipeline.js | capstone: async + error trap | ⭐⭐⭐⭐ |

## Suggested path

- **Warm-up (day 1–2):** 01–08, then 09, 14, 25.
- **Core (day 3–5):** 10–16, 28, 22 — these teach the array/string/stack
  patterns that show up in every interview.
- **Objects & functions (day 6–8):** 17, 18, 19, 23, 24, 26, 27.
- **Async (day 9–10):** 20, 21 — do 20 twice: once with `async/await`,
  once with raw `.then()`.
- **Boss level:** 29, 30, 31, 32, 33.

The path above stops at 33; exercises 34–83 were added later. Grouped by the topic column in the
table:

- **Array and string patterns (day 11–13):** 34, 35, 37, 38, 39, 41, 42, 46, 59 — single-pass maps,
  two pointers, value tables, binary search.
- **Windows, prefixes and sweeps (day 14–15):** 36, 40, 51, 72, 73, 82 — Kadane, sliding window,
  prefix/suffix products, interval merge, sweep line, ring buffer.
- **Recursion, backtracking and DP (day 16–18):** 43, 44, 45, 49, 52, 53, 54 — sieve, subsets,
  permutations, memoization, grid and coin DP.
- **Data structures and classes (day 19–20):** 55, 56, 57, 58, 79 — file-backed JSON store, private
  fields, linked list, BST invariant, O(1) queue.
- **Async and timers (day 21–22):** 47, 48, 60, 61, 62, 63, 64, 65 — debounce/throttle,
  `Promise.all`/`allSettled` by hand, a concurrency pool, timeouts, `AbortSignal`.
- **Objects, parsing and policies (day 23–25):** 50, 66, 67, 68, 69, 70, 71, 74, 75, 80 — deep
  clone with cycles, query parsing, pagination edges, stable sorts, own-property paths,
  (un)flattening, top-k, running median, validation cascades.
- **State and graphs (day 26–27):** 76, 77, 78, 81 — transactional cart, state machine,
  undo/redo, Kahn topological sort.
- **Capstone:** 83 — async pipeline with an error trap.

**Check yourself:** after each group, run every file in it with `node` and confirm every
`// expected:` line matches before opening `SOLUTIONS.md`.

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

## Independent advanced practice

Use the [six-chapter engineering route](advanced-practice/README.md) for placement, worked traces, debugging counterexamples, independent exercises, and a reviewable capstone. It connects the existing starters and capstone verifier without replacing your answers. A longer 24-chapter version lives in [advanced-practice/extended-course/](advanced-practice/extended-course/README.md).

## What else is in this repository

`START-HERE.txt` is the authoritative map; this section only points to it. According to that file,
the integrated inventory is 3384 exercises: 1718 web exercises with IDs 001–1718 (the 83 root
files, `js/batch-084-103/`, `js-rest/`, `ts/`, `react/`, `mixed-data/`, `mixed-react/`,
`react-more/`, `ts-more/`, `ts-final/`, `react-junior/`, `react-300/`), two C# files with 583
exercises each (`CSHARP-583.cs`, `CSHARP-MORE-583.cs`), 300 ASP.NET Core exercises
(`dotnet-web-300/`) and 200 SQL exercises (`sql-200/`). It also states that the expansion folders
(for example `ts-next/`, `react-next/`, `js-more/`, `sql-more/`, `dotnet-web-more/`) are in
progress and not part of that inventory or the root verification.

Unlike the root exercises, these tracks have verifiers, declared in `package.json`:

| Script | What it runs |
| --- | --- |
| `npm run verify:original` | the root exercises (`verify-original.cjs`, `verify-39-50.cjs`, `verify-missing.cjs`) |
| `npm run verify:js` | `js/batch-084-103/` and `js-rest/` |
| `npm run check:ts` / `verify:ts` | TypeScript type-check and the `ts`, `ts-more`, `ts-final` verifiers |
| `npm run verify:react` | the five React tracks |
| `npm run verify:csharp` | both C# files (needs the .NET 10 SDK) |
| `npm run verify:sql` | `sql-200/` against in-memory `node:sqlite` |
| `npm run verify:dotnet-web` | `dotnet-web-300/` |
| `npm run verify:all` | everything in the integrated inventory (`verify-all.cjs`) |

Those need `npm ci` first (the TypeScript, React and test dependencies in `package.json`).
`verification-report.json` holds the result of the most recent completed full run (its
`generatedAt` is 2026-09-17); it is a record of that run, not of the current tree, so re-run
`npm run verify:all` after changing anything.

Long-form explanations for some tracks are in `js-more/explanations/`, `js-rest/explanations/` and
`js-capstones/explanations/`; `fabledocs/` holds the plan and specification those explanations were
written to.
