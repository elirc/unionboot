# js-more explanations — 1719 to 1968

Twenty-five families of ten. Each family is one algorithm restated ten times with a different **policy**: a tie goes to the oldest entry instead of the newest, a range end becomes inclusive, a boundary wraps instead of reading zero, an exponent operator becomes right-associative. The code that changes between siblings is usually one line or one comparison, and the family doc names it.

Every prompt ends with a `Semantic key` — a small JSON object such as `{"empty":"error","view":"top"}`. That object is the family's policy in machine-readable form, and it is also the `const cfg={…}` line at the top of the solution. The policy matrix in each doc decodes one row per exercise.

## How to use these docs

1. Read the family doc before you open the starter. The "contract you must honour" section is taken from the test file, so it tells you exactly what will be asserted.
2. Attempt `starters/<id>.cjs`. Run `node js-more/verify.cjs --starters --id=<id>` to see it fail, then `node js-more/verify.cjs --id=<id>` to check your work against the reference.
3. Compare with `solutions/<id>.cjs`. Every reference opens with a `// Why this works:` block naming the approach, the policy points, and any requirement the tests cannot see.
4. Finish with the policy matrix. Once you can predict the nine siblings from the one you solved, the family is done.

Two invariants hold across the whole track. Every test's `check(input, expected)` clones the input with `structuredClone` before calling `solve` and deep-compares afterwards with the message `'Input must not mutate'`. And every prompt's `CONTRACT` section ends with "Algorithmic complexity/structural sharing requirements also need source review" — where a prompt demands a stack rather than recursion, O(log n) updates, structural sharing, a binary search or no `eval`, no assertion enforces it and a reviewer reads the file instead.

## The families

Difficulty is a rough guide to how much is going on in the file, not to how hard the policy is to see: ★ is a dozen lines, ★★★★ is two or three phases plus a subtle invariant.

| Doc | IDs | Topic | Difficulty |
| --- | --- | --- | --- |
| [01 LFU cache eviction](01-lfu-cache-eviction.md) | 1719–1728 | Get/put under a capacity, evicting the least-frequently used entry; oldest or newest breaks the tie | ★★★ |
| [02 Ranked trie autocomplete](02-ranked-trie-autocomplete.md) | 1729–1738 | Build a trie, collect prefix matches, rank by score, length, recency or lexical order under a limit | ★★★ |
| [03 Weighted interval scheduling](03-weighted-interval-scheduling.md) | 1739–1748 | Maximum-value non-overlapping selection with a required gap between jobs | ★★★ |
| [04 Heap job dispatch](04-heap-job-dispatch.md) | 1749–1758 | A virtual clock plus a binary heap; priority direction and an aging bonus | ★★★ |
| [05 Union-find components](05-union-find-components.md) | 1759–1768 | Disjoint sets with full path compression; the representative is the minimum or maximum member | ★★ |
| [06 Dijkstra route policies](06-dijkstra-route-policies.md) | 1769–1778 | Shortest paths with a per-edge toll, reporting cost and path, ties by label or hop count | ★★★★ |
| [07 KMP substring matches](07-kmp-substring-matches.md) | 1779–1788 | Knuth–Morris–Pratt in O(n+m); all, disjoint, first, last or count, with optional case folding | ★★★ |
| [08 Decimal-string arithmetic](08-decimal-string-arithmetic.md) | 1789–1798 | Long arithmetic on digit strings without `Number` or `BigInt`; add, difference, subtract, multiply, maximum | ★★ |
| [09 Huffman prefix codes](09-huffman-prefix-codes.md) | 1799–1808 | Merge least-weight nodes under a defined tie key; emit the code table, the encoding, or a length | ★★★★ |
| [10 JSON wildcard selection](10-json-wildcard-selection.md) | 1809–1818 | Walk a JSON value along a path of keys and `'*'`; missing keys skip, yield `null`, or throw | ★★★ |
| [11 Wildcard topic bus](11-wildcard-topic-bus.md) | 1819–1828 | Subscribe/emit with `'*'` and `'**'` patterns, delivery order policies and collected or thrown errors | ★★★ |
| [12 Async semaphore queues](12-async-semaphore-queues.md) | 1829–1838 | A permit-counting semaphore over promises, handing the permit on in FIFO or LIFO order | ★★★★ |
| [13 Lazy iterator pipelines](13-lazy-iterator-pipelines.md) | 1839–1848 | A pull-driven pipeline that never reads past the last item the consumer asked for | ★★★ |
| [14 Persistent versioned stacks](14-persistent-versioned-stacks.md) | 1849–1858 | Immutable linked nodes with structural sharing; five read views, two empty-pop rules | ★★ |
| [15 Precedence expression parsing](15-precedence-expression-parsing.md) | 1859–1868 | A precedence-climbing parser, no `eval`; flat or standard levels, left- or right-associative `^` | ★★★★ |
| [16 LCS edit scripts](16-lcs-edit-scripts.md) | 1869–1878 | Longest common subsequence turned into keep/delete/insert operations with a tie policy | ★★★ |
| [17 Sudoku candidate validation](17-sudoku-candidate-validation.md) | 1879–1888 | Constraint groups for rows, columns, boxes and optional diagonals; candidates for one blank cell | ★★ |
| [18 Injected token-bucket limiter](18-injected-token-bucket-limiter.md) | 1889–1898 | A rate limiter over an injected virtual clock; capacity, refill rate, and monotonic-time errors | ★★ |
| [19 Bloom membership bitsets](19-bloom-membership-bitsets.md) | 1899–1908 | A bit array plus derived hash probes; deliberate false positives, never false negatives | ★★ |
| [20 Fenwick point updates](20-fenwick-point-updates.md) | 1909–1918 | Binary indexed tree; O(log n) point updates and prefix sums, sum or average, inclusive or not | ★★★ |
| [21 Segment-tree extrema](21-segment-tree-extrema.md) | 1919–1928 | Iterative segment tree carrying `{value,index}`; min or max, first or last index, three output shapes | ★★★★ |
| [22 Consistent-hash ring](22-consistent-hash-ring.md) | 1929–1938 | Virtual nodes on a modular ring; binary-search successor lookup with wrap-around | ★★★ |
| [23 Zero-one knapsack policies](23-zero-one-knapsack-policies.md) | 1939–1948 | Capacity-axis dynamic programming carrying the selection; lighter or heavier breaks a value tie | ★★★ |
| [24 Elementary cellular automata](24-elementary-cellular-automata.md) | 1949–1958 | Wolfram rules 30/54/90/110/184 as eight bits; zero-padded or wrapping boundaries | ★ |
| [25 Polynomial convolution](25-polynomial-convolution.md) | 1959–1968 | Coefficient convolution with optional modular reduction and trailing-zero trimming | ★ |

## Suggested order

The families are independent, so the ID order works. If you would rather build up one idea at a time, this sequence groups them by what they teach.

1. **Numeric and array work** — [25 Polynomial convolution](25-polynomial-convolution.md), [24 Elementary cellular automata](24-elementary-cellular-automata.md), [08 Decimal-string arithmetic](08-decimal-string-arithmetic.md). Nested loops, bit tests and carrying by hand; no data structure to build first.
2. **Data structures** — [14 Persistent versioned stacks](14-persistent-versioned-stacks.md), [19 Bloom membership bitsets](19-bloom-membership-bitsets.md), [05 Union-find components](05-union-find-components.md), [17 Sudoku candidate validation](17-sudoku-candidate-validation.md), [01 LFU cache eviction](01-lfu-cache-eviction.md), [04 Heap job dispatch](04-heap-job-dispatch.md), [20 Fenwick point updates](20-fenwick-point-updates.md), [21 Segment-tree extrema](21-segment-tree-extrema.md), [22 Consistent-hash ring](22-consistent-hash-ring.md), [02 Ranked trie autocomplete](02-ranked-trie-autocomplete.md). Start with the two smallest, then the array-backed trees.
3. **Graphs, strings and search** — [07 KMP substring matches](07-kmp-substring-matches.md), [16 LCS edit scripts](16-lcs-edit-scripts.md), [23 Zero-one knapsack policies](23-zero-one-knapsack-policies.md), [03 Weighted interval scheduling](03-weighted-interval-scheduling.md), [15 Precedence expression parsing](15-precedence-expression-parsing.md), [10 JSON wildcard selection](10-json-wildcard-selection.md), [09 Huffman prefix codes](09-huffman-prefix-codes.md), [06 Dijkstra route policies](06-dijkstra-route-policies.md). Three dynamic programs, then two recursive walks, then the two heaviest files in the track.
4. **Callbacks, laziness and async** — [18 Injected token-bucket limiter](18-injected-token-bucket-limiter.md), [11 Wildcard topic bus](11-wildcard-topic-bus.md), [13 Lazy iterator pipelines](13-lazy-iterator-pipelines.md), [12 Async semaphore queues](12-async-semaphore-queues.md). Injected time first, then delivery order, then pull-driven laziness, then promises.

Families 12, 13 and 18 are the ones where *when* something happens is asserted, not only what comes out. Read their contracts slowly.

## Running the verifier

```text
node js-more/verify.cjs --inventory          # count files, no grading
node js-more/verify.cjs --id=1849            # one exercise against its reference solution
node js-more/verify.cjs --starters --id=1849 # grade your starter instead
node js-more/verify.cjs                      # all 250 references; minutes, not seconds
node js-more/verify.cjs --starters           # all 250 starters
```

Exit code 0 is success, 1 is a grading or inventory failure, 2 is a usage error or an unknown ID. Every selected starter, solution and test passes `node --check` before anything is run, so a typo is reported as a failure of that ID rather than a crash.

Each run writes `verification-solution.json` or `verification-starter.json`, and a single-ID run additionally writes `verification-<mode>-<id>.json`; the latest run is also logged to `reference.log` or `blank.log`. Those files are output, not source — leave them alone.
