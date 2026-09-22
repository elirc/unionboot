# js/batch-084-103 — explanations index

Twenty standalone exercises. There are no shared families in this track, so each
exercise gets its own document. Every document follows the same shape: the
problem in plain words, the contract taken from the test file, the approach, a
worked trace of one real test case, variations you could build, the pitfalls the
tests are designed to catch, and a few extensions to try.

Read the document, attempt the starter, run the verifier, then compare with the
readable reference in `solutions/`.

Run one exercise with `node js/batch-084-103/verify.cjs --id=<n>`, or the whole
track with `node js/batch-084-103/verify.cjs`. Add `--starters` to grade your own
work instead of the reference.

## Every exercise

| Doc | ID | Exported function | Topic | Difficulty |
| --- | --- | --- | --- | --- |
| [01-adjacent-groups.md](01-adjacent-groups.md) | 84 | `groupRuns` | Runs of equal neighbours; `Object.is` | ★☆☆ |
| [02-zip-longest.md](02-zip-longest.md) | 85 | `zipLongest` | Index bounds versus `??` | ★☆☆ |
| [03-stable-partition.md](03-stable-partition.md) | 86 | `partition` | Stable split; exact callback counts | ★☆☆ |
| [04-window-sums.md](04-window-sums.md) | 87 | `windowSums` | Sliding window, O(n) | ★★☆ |
| [05-range-sum-index.md](05-range-sum-index.md) | 88 | `rangeSumIndex` | Prefix sums; closures; snapshots | ★★☆ |
| [06-lower-bound.md](06-lower-bound.md) | 89 | `lowerBound` | Binary search, half-open interval | ★★☆ |
| [07-sorted-compaction.md](07-sorted-compaction.md) | 90 | `compactSorted` | Two pointers; in place, O(1) space | ★★☆ |
| [08-decode-runs.md](08-decode-runs.md) | 91 | `decodeRuns` | Validate before allocating; two error types | ★★☆ |
| [09-literal-regex.md](09-literal-regex.md) | 92 | `escapeRegex` | Escaping regex metacharacters | ★★☆ |
| [10-normalize-posix.md](10-normalize-posix.md) | 93 | `normalizePath` | Path segments on a stack | ★★☆ |
| [11-version-compare.md](11-version-compare.md) | 94 | `compareVersions` | Component-wise compare with `BigInt` | ★★☆ |
| [12-extended-gcd.md](12-extended-gcd.md) | 95 | `extendedGcd` | Extended Euclid; loop invariants | ★★★ |
| [13-fraction-normalize.md](13-fraction-normalize.md) | 96 | `normalizeFraction` | Canonical rationals; sign then gcd | ★★☆ |
| [14-base-encode.md](14-base-encode.md) | 97 | `encodeBase` | Positional notation by hand | ★★☆ |
| [15-matrix-transpose.md](15-matrix-transpose.md) | 98 | `transpose` | Axis swap; shallow copy semantics | ★☆☆ |
| [16-spiral-traversal.md](16-spiral-traversal.md) | 99 | `spiral` | Four shrinking boundaries; edge guards | ★★★ |
| [17-increasing-subsequence.md](17-increasing-subsequence.md) | 100 | `lisLength` | Patience tails, O(n log n) | ★★★ |
| [18-edit-distance.md](18-edit-distance.md) | 101 | `editDistance` | 2-D DP compressed to a rolling row | ★★★ |
| [19-choose-sum.md](19-choose-sum.md) | 102 | `chooseSum` | Backtracking; sound versus unsound prunes | ★★★ |
| [20-graph-reachability.md](20-graph-reachability.md) | 103 | `reachable` | BFS; mark on enqueue | ★★☆ |

Difficulty is a reading guide, not a measurement: ★☆☆ is one idea applied
directly, ★★☆ needs a technique plus its edge cases, ★★★ needs an invariant you
have to state before the code makes sense.

## Suggested order, grouped by theme

**Arrays — traversal and two pointers (84, 85, 86, 90, 87).** Start here. Each
one is a single pass with a small amount of carried state. 84 introduces
`Object.is`; 85 introduces the difference between a missing slot and a stored
`undefined`; 86 is about how often a callback is allowed to run; 90 introduces
the read/write pointer pair; 87 introduces the sliding window.

**Search and index structures (89, 88, 100).** 89 is the binary search the rest
of the track reuses, so do it before 100. 88 pays a setup cost to make queries
constant time. 100 puts a binary search inside a loop and is the hardest of the
three.

**Strings and parsing (91, 92, 93, 94).** All four are "validate carefully, then
transform". 91 is about the order of validation and allocation, 92 about an
explicit escape set, 93 about a segment stack, 94 about comparing numerically
rather than textually.

**BigInt arithmetic (95, 96, 97).** Do 95 before 96, because 96 reuses the
Euclidean loop. 94 is useful preparation for all three if you have not met
`BigInt` before.

**Matrices (98, 99).** 98 is a gentle introduction to index arithmetic over
nested arrays; 99 is the same data structure with a much more demanding
traversal.

**Dynamic programming and search (101, 102, 103).** 101 is a table compressed to
a row, 102 is exhaustive search with pruning, 103 is graph traversal. 100 fits
naturally alongside 101 if you want the two DP-flavoured exercises together.

There are no async exercises in this batch; every function here is synchronous
and side-effect free.
