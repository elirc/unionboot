# js-rest explanations — 104 to 183

Twenty families of four. Each family is one problem restated four times with a different **policy**: a keep-first rule becomes a keep-last rule, a closed interval becomes an open one, a drop-oldest buffer becomes a reject-on-overflow buffer. The code that changes between siblings is usually one line, and the family doc names it.

## How to use these docs

1. Read the family doc before you open the starter. The "contract you must honour" section is taken from the test file, so it tells you exactly what will be asserted.
2. Attempt `starters/<id>.cjs`. Run `node js-rest/verify.cjs --starters --id=<id>` to see it fail, then `node js-rest/verify.cjs --id=<id>` to check your work against the reference.
3. Compare with `solutions/<id>.cjs`. Every reference now opens with a `// Why this works:` block naming the approach and the policy points.
4. Finish with the policy matrix. Once you can predict the three siblings from the one you solved, the family is done.

Every exercise in this track shares one invariant: the test clones the input with `structuredClone` before calling `solve` and deep-compares afterwards with the message `'Input must not mutate'`. Sorting, splicing or writing through the argument fails, in every family.

## The families

| Doc | IDs | Topic | Level |
| --- | --- | --- | --- |
| [01 Index records](01-index-records.md) | 104–107 | Fold rows into a `Map` index, sort the entries, apply a duplicate policy | 1 — start here |
| [02 Join by identifier](02-join-by-identifier.md) | 108–111 | Hash joins: inner, left, full and anti | 2 |
| [03 Aggregate nested tree](03-aggregate-nested-tree.md) | 112–115 | Fold over a tree with an explicit stack, not recursion | 2 |
| [04 Nearest point](04-nearest-point.md) | 116–119 | Argmin scan under four distance metrics, first wins ties | 1 |
| [05 Quantize to a step](05-quantize-to-a-step.md) | 120–123 | Snap numbers to a grid; four rounding modes; negative zero | 2 |
| [06 Configuration diff](06-configuration-diff.md) | 124–127 | Classify keys with `Object.hasOwn` and `Object.is` | 2 |
| [07 Best candidate](07-best-candidate.md) | 128–131 | One-pass maximum keeping every tied id, then four tie rules | 2 |
| [08 Locate character runs](08-locate-character-runs.md) | 132–135 | Maximal class runs as half-open `[start, end)` spans | 2 |
| [09 Robot navigation](09-robot-navigation.md) | 136–139 | Command interpreter with modular headings and a move table | 1 |
| [10 Multiset operations](10-multiset-operations.md) | 140–143 | Set algebra on counts: min, max, shortfall, absolute gap | 3 |
| [11 Bounded event buffer](11-bounded-event-buffer.md) | 144–147 | Capacity validation plus four overflow policies | 2 |
| [12 Interval membership](12-interval-membership.md) | 148–151 | Closed, open, left-closed and right-closed, in one filter | 1 — quickest |
| [13 Identifier conversion](13-identifier-conversion.md) | 152–155 | Tokenize once, render as kebab, snake, camel or pascal | 2 |
| [14 Positive streak](14-positive-streak.md) | 156–159 | Collect every maximal run, then select one by policy | 3 |
| [15 Square matrix sums](15-square-matrix-sums.md) | 160–163 | Shape validation and index-relation regions | 2 |
| [16 Tree label order](16-tree-label-order.md) | 164–167 | Preorder, postorder, level-order and leaves-only | 3 |
| [17 Tagged instructions](17-tagged-instructions.md) | 168–171 | A left fold over validated steps, with an audit trace | 2 |
| [18 Interpolated percentile](18-interpolated-percentile.md) | 172–175 | Sort a copy, locate a fractional position, blend neighbours | 3 |
| [19 Graph classification](19-graph-classification.md) | 176–179 | Sources, sinks, isolated and self-looped nodes from an edge list | 2 |
| [20 Compare text under normalization](20-compare-text-under-normalization.md) | 180–183 | Normalize both sides, then report the first divergence | 2 |

## Suggested order

The families are independent, so the ID order works. If you would rather build up, this sequence introduces one new idea at a time:

1. **Filters and scans** — 12 Interval membership, 04 Nearest point, 09 Robot navigation. Short files, no data structures.
2. **Maps and counting** — 01 Index records, 10 Multiset operations, 02 Join by identifier. The `Map` fold, then two things built on it.
3. **Strings and regular expressions** — 08 Locate character runs, 13 Identifier conversion, 20 Compare text under normalization.
4. **Validation and policy branches** — 05 Quantize to a step, 11 Bounded event buffer, 15 Square matrix sums, 17 Tagged instructions. Each throws a specific error message.
5. **Selection policies** — 07 Best candidate, 14 Positive streak, 06 Configuration diff.
6. **Trees, graphs and statistics** — 03 Aggregate nested tree, 16 Tree label order, 19 Graph classification, 18 Interpolated percentile.

Level is a rough guide to how much is going on in the file, not to how hard the policy is to see: 1 is a handful of lines, 3 is two phases plus an edge case.

## Running the verifier

```text
node js-rest/verify.cjs              # all 80, about five seconds
node js-rest/verify.cjs --id=104     # one exercise
node js-rest/verify.cjs --starters   # grade the starters instead of the solutions
```

The verifier syntax-checks the starter, the solution and the test before running anything, so a typo in your starter is reported as a failure of that ID rather than a crash.
