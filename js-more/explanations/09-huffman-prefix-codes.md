# Huffman prefix codes — js-more 1799–1808

**What you practise:** building a Huffman tree by repeatedly merging the two least-weight nodes, assigning prefix-free codes by descent, and reporting the result as a table, as a bit length, or as both.
**Prerequisites:** [01 LFU cache eviction](01-lfu-cache-eviction.md) for frequency counting with a `Map`; comparator chaining; recursion over a binary tree; `Math.ceil` for rounding bits up to bytes.
**Exercises:** 1799: tie=ascending; output=table; zero=0, 1800: tie=ascending; output=table; zero=1, 1801: tie=ascending; output=both; zero=0, 1802: tie=ascending; output=both; zero=1, 1803: output=length; unit=bits, 1804: tie=descending; output=table; zero=0, 1805: tie=descending; output=table; zero=1, 1806: tie=descending; output=both; zero=0, 1807: tie=descending; output=both; zero=1, 1808: output=length; unit=bytes.

## The problem in plain words

The input is an ASCII string. Count how often each character occurs, then build a code for each character such that no code is a prefix of another. Frequent characters get short codes, rare ones get long codes; that is what makes the encoded message shorter than a fixed-width one.

The construction is Huffman's: start with one leaf per distinct symbol, weighted by its frequency. Repeatedly remove the two lightest nodes and join them under a new node whose weight is their sum. The node removed first becomes the left child. When one node is left, it is the root; the code for a symbol is the sequence of edge labels from the root down to its leaf.

Two nodes can weigh the same, and then the removal order would be arbitrary — which would make the codes arbitrary too. The prompt pins it down: ties are broken by each node's key, where a node's key is its leaf symbols sorted and concatenated. `tie=ascending` takes the smaller key first, `tie=descending` the larger.

"Policy" here is three knobs, and one of the ten scenarios drops two of them. `tie` is the ordering just described. `zero` is which bit labels a left edge — `'0'` or `'1'`, with the right edge taking the other. `output` selects the shape of the answer: the `[symbol, code]` table sorted by symbol, the encoded length, or both the table and the encoded bit string. Scenarios 5 and 10 (1803 and 1808) report only a length and therefore carry a `unit` knob, `bits` or `bytes`, instead of `tie` and `zero`.

Edge cases: the empty string yields `[]` (or `0`), and a string of one distinct character makes the root a leaf with no edges at all, so its code would be empty — the prompt fixes it at a single bit.

## The contract you must honour

Taken from `prompts/1799.txt`, `prompts/1803.txt` and the matching tests:

- `output=table` returns an array of `[symbol, code]` pairs sorted by symbol in code-unit order.
- `output=both` returns `{codes, bits}`, where `bits` is the whole input re-encoded: `[...input].map(ch => table.get(ch)).join('')`.
- `output=length` returns a number: `bits.length` under `unit: 'bits'`, `Math.ceil(bits.length / 8)` under `unit: 'bytes'`.
- The empty string returns `[]`, `{codes:[],bits:''}` or `0` depending on the output mode. The test's first case is `''`.
- A singleton alphabet gets a one-bit code. `'aaaa'` asserts `[['a','0']]` under 1799 and `[['a','1']]` under 1800.
- Ties in the merge order use the sorted concatenated leaf-symbol key. The test's `oracle` builds the same key with `Object.keys(codes).sort().join('')` and uses the identical comparator, so the two agree by construction — the tie rule is genuinely observable, not decorative.
- `check` clones the input and asserts `'Input must not mutate'`. The input is a string, so this holds trivially.
- The prompt says "repeatedly merge two least-weight nodes". That is the structural requirement the CONTRACT section covers with "needs source review".

One detail worth stating because it looks like an oversight and is not. In 1803 and 1808 the `cfg` object has no `tie` key, so the comparator's `cfg.tie === 'ascending'` test is `false` and the key tie-break runs descending. The prompt for 1803 says "ties ascending (length invariant)" — and the parenthesis is the point: which of two equal-weight nodes is merged first changes the shape of the tree but never the total number of encoded bits, so a length-only scenario cannot tell the difference. The test's oracle reads `cfg.tie` the same way and lands on the same trees.

## Approach

1. Count: `for (const ch of input) counts.set(ch, (counts.get(ch) || 0) + 1)`. A `Map` keeps every character a literal key.
2. Seed the queue with one node per symbol: `{symbol, weight, key: symbol}`. A leaf is recognised later by `node.symbol !== undefined`.
3. Write `compare(left, right)`: weight ascending, then the key in the direction `cfg.tie` selects. Because a node's key lists all of its leaf symbols and each symbol belongs to exactly one node, no two live nodes can have the same key — the ordering is total.
4. While more than one node remains: sort the queue, `shift()` twice, and push a parent `{left, right, weight: left.weight + right.weight, key: [...left.key + right.key].sort().join('')}`. Sorting the concatenated characters is what makes the key canonical regardless of merge history.

   Re-sorting the array before each removal is a priority order rather than a binary heap. It is O(k log k) per merge instead of O(log k), which at these alphabet sizes is irrelevant, and it states "take the two least-weight nodes" in one line.
5. Assign codes with a recursive `walk(node, bits)`. At a leaf, store `bits || cfg.zero` — the `||` is the singleton rule, because only the root-as-leaf case reaches here with `bits === ''`. At an internal node, descend left with `bits + cfg.zero` and right with `bits + oneBit`, where `oneBit` is the other label.
6. Sort the table by symbol, build the encoded `bits` string, and return whichever shape `cfg.output` names.

Counting is O(n) in the text length. The merge loop runs k−1 times for k distinct symbols. Encoding is O(n) again.

## Worked example — 1799 Huffman prefix codes / scenario 1

The test runs six hand-written strings, quoted from the last line of `tests/1799.cjs`:

```js
for(const text of ['', 'aaaa', 'ab', 'abcde', 'abbcccdddd', 'banana bandana'])check(text,oracle(text));
```

Take `'abbcccdddd'`, with `cfg = {"output":"table","tie":"ascending","zero":"0"}`. The counts are `a`:1, `b`:2, `c`:3, `d`:4.

| Merge | Queue sorted by `compare` | Removed first (left) | Removed second (right) | New node |
| --- | --- | --- | --- | --- |
| 1 | `a`(1), `b`(2), `c`(3), `d`(4) | `a`(1) | `b`(2) | weight 3, key `ab` |
| 2 | `ab`(3), `c`(3), `d`(4) | `ab`(3) | `c`(3) | weight 6, key `abc` |
| 3 | `d`(4), `abc`(6) | `d`(4) | `abc`(6) | weight 10, key `abcd` — the root |

Merge 2 is the tie. `ab` and `c` both weigh 3, so `compare` falls through to the keys: `'ab' < 'c'`, and under `tie: 'ascending'` that returns `-1`, so `ab` sorts first and becomes the left child.

Now `walk(root, '')`, with left edges labelled `'0'` and right edges `'1'`:

| Node reached | `bits` on entry | Action |
| --- | --- | --- |
| root (internal) | `''` | descend left with `'0'`, right with `'1'` |
| `d` (leaf) | `'0'` | `table.set('d','0')` |
| `abc` (internal) | `'1'` | descend left with `'10'`, right with `'11'` |
| `ab` (internal) | `'10'` | descend left with `'100'`, right with `'101'` |
| `a` (leaf) | `'100'` | `table.set('a','100')` |
| `b` (leaf) | `'101'` | `table.set('b','101')` |
| `c` (leaf) | `'11'` | `table.set('c','11')` |

Sorted by symbol, the return value is

```js
[['a','100'],['b','101'],['c','11'],['d','0']]
```

The codes are prefix-free: `'0'` is `d` and nothing else starts with `0`; `'11'` is `c`; `'100'` and `'101'` are `a` and `b`. Frequencies and lengths move opposite ways, which is the whole point — `d` occurs four times and costs one bit, `a` occurs once and costs three.

The encoded length is `1×3 + 2×3 + 3×2 + 4×1 = 19` bits, which is what 1803 returns for this string, and `Math.ceil(19/8) = 3`, which is what 1808 returns. A fixed-width code for four symbols would need 2 bits each, or 20 bits.

**The same string under the other knobs.**

| Scenario | Result for `'abbcccdddd'` |
| --- | --- |
| 1799 `tie=ascending, zero=0` | `[['a','100'],['b','101'],['c','11'],['d','0']]` |
| 1800 `tie=ascending, zero=1` | `[['a','011'],['b','010'],['c','00'],['d','1']]` — every bit flipped |
| 1804 `tie=descending, zero=0` | `[['a','110'],['b','111'],['c','10'],['d','0']]` — merge 2 takes `c` first, so `c` becomes the left child of `abc` |
| 1801 `output=both, zero=0` | `{codes: [...as 1799], bits: '1001011011111110000'}` |
| 1803 `unit=bits` | `19` |
| 1808 `unit=bytes` | `3` |

1804 is the tie policy made visible. The tree has a different shape — `c` and the `ab` subtree swap sides — and for this string every code happens to keep its length, so the encoded message is still 19 bits.

The invariant the 1803 prompt names is narrower than "the codes are the same". What the tie policy can never change is the *total* encoded length, because that total equals the sum of the weights of the nodes created by the merges, and both policies merge the same multiset of weights in the same order. Individual code lengths are not protected: with weights 1, 2, 3, 3 the two tie choices give code lengths 3, 3, 2, 1 and 2, 2, 2, 2 respectively, and both encode to 18 bits. That is exactly why a length-only scenario can ship without a `tie` knob.

**The small cases.** `''` produces an empty `counts`, an empty `queue`, no merges, and `queue.length` is 0 so `walk` is never called: the table stays empty and `codes` is `[]`. `'aaaa'` produces a single leaf; the `while` loop's condition `queue.length > 1` is false immediately, so `walk(queue[0], '')` is called on a leaf and stores `'' || cfg.zero`, which is `'0'`. `'ab'` produces one merge with `a` as the left child, so the codes are `'0'` and `'1'`.

**The longest case**, `'banana bandana'`, has counts `a`:6, `n`:4, `b`:2, `d`:1, `' '`:1, and 1799 gives `[[' ','1000'],['a','0'],['b','101'],['d','1001'],['n','11']]`. The space and `d` are the rarest and get four bits each; `a` is the most frequent and gets one.

The reference solution, as it now reads in `solutions/1799.cjs`:

```js
function huffman(input) {
  const counts = new Map();
  for (const ch of input) counts.set(ch, (counts.get(ch) || 0) + 1);
  const queue = [...counts].map(([symbol, weight]) => ({symbol, weight, key: symbol}));
  const compare = (left, right) =>
    left.weight - right.weight ||
    (left.key < right.key ? (cfg.tie === 'ascending' ? -1 : 1) :
     left.key > right.key ? (cfg.tie === 'ascending' ? 1 : -1) :
     0);
  while (queue.length > 1) {
    queue.sort(compare);
    const left = queue.shift();
    const right = queue.shift();
    queue.push({
      left,
      right,
      weight: left.weight + right.weight,
      key: [...left.key + right.key].sort().join(''),
    });
  }
  const table = new Map();
  const oneBit = cfg.zero === '0' ? '1' : '0';
  function walk(node, bits) {
    if (node.symbol !== undefined) {
      table.set(node.symbol, bits || cfg.zero);
    } else {
      walk(node.left, bits + cfg.zero);
      walk(node.right, bits + oneBit);
    }
  }
  if (queue.length) walk(queue[0], '');
  const codes = [...table].sort((left, right) => (left[0] < right[0] ? -1 : 1));
  const bits = [...input].map(ch => table.get(ch)).join('');
  if (cfg.output === 'table') return codes;
  if (cfg.output === 'length') return cfg.unit === 'bytes' ? Math.ceil(bits.length / 8) : bits.length;
  return {codes, bits};
}
```

`solutions/1803.cjs` and `solutions/1808.cjs` are the same function with the bit labels written as literals, because their `cfg` has no `zero` key: left edges are `'0'`, right edges `'1'`, and the singleton code is `'0'`.

## Policy matrix — what changes between the variants

| ID | Variant | What differs in the prompt | What differs in the code |
| --- | --- | --- | --- |
| 1799 | tie=ascending; output=table; zero=0 | `{"output":"table","tie":"ascending","zero":"0"}` | smaller key merges first; left edge `'0'`; returns `codes` |
| 1800 | tie=ascending; output=table; zero=1 | `…"zero":"1"` | same tree; left edge `'1'`, so every code is bitwise inverted |
| 1801 | tie=ascending; output=both; zero=0 | `…"output":"both","zero":"0"` | same tree and codes; returns `{codes, bits}` |
| 1802 | tie=ascending; output=both; zero=1 | `…"output":"both","zero":"1"` | inverted labels; returns `{codes, bits}` |
| 1803 | output=length; unit=bits | `{"output":"length","unit":"bits"}` | no `zero`/`tie` keys: labels are literal, comparator's tie branch runs descending; returns `bits.length` |
| 1804 | tie=descending; output=table; zero=0 | `…"tie":"descending"` | larger key merges first, changing the tree shape; left edge `'0'` |
| 1805 | tie=descending; output=table; zero=1 | `…"tie":"descending","zero":"1"` | descending merge order, inverted labels |
| 1806 | tie=descending; output=both; zero=0 | `…"output":"both"` | descending merge order; returns `{codes, bits}` |
| 1807 | tie=descending; output=both; zero=1 | `…"output":"both","zero":"1"` | descending merge order, inverted labels, `{codes, bits}` |
| 1808 | output=length; unit=bytes | `{"output":"length","unit":"bytes"}` | as 1803, but `Math.ceil(bits.length / 8)` |

`tie` changes which subtree sits on which side, `zero` changes the labels on the edges, and neither changes the total encoded bit count — which is why the two length scenarios need neither knob. `output` is the only knob that changes the return type.

## Pitfalls the tests are designed to catch

- **Leaving the singleton code empty.** `'aaaa'` makes the root a leaf, `bits` is `''`, and an empty code encodes nothing. The `bits || cfg.zero` fallback is asserted by `[['a','0']]`.
- **Crashing on the empty string.** `queue` is empty, so `queue[0]` is `undefined`; the `if (queue.length)` guard is what keeps `walk` from being called on it.
- **Breaking ties by insertion order.** `Array.prototype.sort` is stable, so an incomplete comparator silently falls back to the order the symbols were first seen — which is the text's order, not the prompt's rule. The `'abbcccdddd'` case has an exact weight tie at merge 2 and catches it.
- **Building the node key from the merge order.** The key is the *sorted* concatenation: `[...left.key + right.key].sort().join('')`. Using `left.key + right.key` unsorted makes the key depend on history, and two runs that reach the same set of symbols could then compare differently.
- **Detecting a leaf with `!node.left`.** A leaf here is `node.symbol !== undefined`. A symbol could legitimately be a falsy-looking character, and internal nodes always have both children, so the explicit `symbol` test is the safe one.
- **Swapping left and right.** "First removed is left child" — the node that `shift()` returns first takes the `cfg.zero` label. Reversing it produces valid prefix codes of the same lengths, and a different table.
- **Encoding before sorting the table, or sorting the table with a bare `sort()`.** `codes` is sorted by symbol with an explicit comparator; `bits` is built from the `table` `Map`, which is unaffected by that sort.
- **Rounding bits to bytes with `bits.length / 8`.** 19 bits is 3 bytes, not 2.375. `Math.ceil` is the rule.

## Try it yourself

1. Add a `decode` helper that turns a `bits` string back into the original text using the table. Which property of the codes makes a single left-to-right pass enough?
2. Replace the sort-per-merge queue with a binary heap keyed by `compare`. Confirm 1799 and 1804 still produce the tables above, and say which part of `compare` the heap makes harder to keep correct.
3. Compute the fixed-width cost (`ceil(log2(alphabet)) × text.length`) alongside the Huffman cost and report the saving. For which of the six test strings is the saving zero?
4. In words: 1799 and 1804 give `c` a two-bit code either way but attach it to a different side of the tree. Explain why the *total* bit count is identical under both tie policies, using the weights of the nodes created at each merge — and then find a frequency multiset for which the individual code lengths do differ.
