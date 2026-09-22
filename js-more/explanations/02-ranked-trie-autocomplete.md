# Ranked trie autocomplete — js-more 1729–1738

**What you practise:** building a prefix tree, collecting a subtree without recursion, and ordering the hits by a swappable ranking policy with a fixed tie-break.
**Prerequisites:** [01 LFU cache eviction](01-lfu-cache-eviction.md) for `Map` as a keyed store; `String.prototype.startsWith` and what "code-unit order" means; comparator chaining with `||`; `Array.prototype.slice` as a copying operation.
**Exercises:** 1729: rank=score; limit=2, 1730: rank=score; limit=4, 1731: rank=shortest; limit=2, 1732: rank=shortest; limit=4, 1733: rank=longest; limit=2, 1734: rank=longest; limit=4, 1735: rank=recent; limit=2, 1736: rank=recent; limit=4, 1737: rank=lexical; limit=2, 1738: rank=lexical; limit=4.

## The problem in plain words

You are given `{words: [{word, score}], prefix}`. The words are unique ASCII strings, the scores are finite numbers, and the prefix is a string. Return the words that start with the prefix, ranked, cut to a limit.

A trie — a prefix tree — is the data structure the prompt asks for. Every node stands for one prefix of the alphabet seen so far; its children are keyed by the next character. The word `ape` becomes a chain root → `a` → `p` → `e`, and `apple` shares the first two of those nodes. Finding every word with prefix `ap` is then a matter of walking two characters down and collecting everything underneath, instead of scanning all the words and testing each one.

"Policy" here is the ranking. `score` puts the highest score first. `shortest` and `longest` order by word length. `recent` treats a later position in `input.words` as more recent. `lexical` applies no primary ordering at all. Whatever the primary order, equal candidates are broken by code-unit order on the word itself, and the result is cut to `limit` entries.

Two edge cases are called out by the prompt and exercised by the test. An empty prefix matches every word, including the empty string as a word. A prefix nobody has returns `[]`.

## The contract you must honour

Taken from `prompts/1729.txt` and `tests/1729.cjs`:

- Input is `{words, prefix}`; the return value is an array of word strings, not of records.
- `check({words:[],prefix:''},[])` is the first assertion in the test: no words means `[]`, not `undefined`.
- The test loops over five prefixes — `''`, `'a'`, `'ap'`, `'apple'`, `'missing'` — against the same seven words, and computes the expected array inline with the same comparator the solution uses. `'missing'` matches nothing and asserts `[]`.
- The word list includes `{word:'',score:7}`. With `prefix:''` the empty word is a match, so the terminal record for it has to live on the root node.
- At most `cfg.limit` words come back. The test slices its own expectation with `expected.slice(0,cfg.limit)`, so returning more is a failure even when the extra entries are correctly ordered.
- Ties break lexically: the test's comparator ends with `||(a.word<b.word?-1:1)`.
- `check` clones the input and asserts `'Input must not mutate'` afterwards. You may not sort `input.words` and you may not write an index onto the caller's row objects — the reference copies each row with `{...row, index}`.
- The prompt's CONTRACT adds that the structural requirement "needs source review": the reviewer expects an actual trie, not `input.words.filter(w => w.word.startsWith(prefix))`. A filter would pass every assertion in `tests/1729.cjs`; it is still the wrong answer for this exercise.

## Approach

1. Build the trie. A node is `{children: new Map(), terminal: null}`. A `Map` keyed by character keeps every character literal and avoids the prototype keys a plain object would inherit.
2. Insert each word with `forEach`, so you have its `index` in `input.words`. Walk the characters, creating missing child nodes, and store `{...row, index}` on the final node's `terminal`. The copy is what keeps the input clean; the `index` is what `rank: 'recent'` later sorts on, since the trie itself has forgotten the input order.
3. Walk the prefix from the root. If a character has no child, no word has that prefix — return `[]` immediately. An empty prefix skips the loop entirely and leaves you at the root.
4. Collect the subtree. Push the landing node on a stack; while the stack is not empty, pop a node, record its `terminal` if it has one, and push its children. An explicit stack rather than recursion keeps the depth bound off the call stack. Collection order is arbitrary, which is fine because the next step sorts.
5. Sort with `primary(left, right) || lexical(left, right)`. `primary` is a chain on `cfg.rank`; for `lexical` it returns `0` so the tie-break becomes the whole ordering.
6. `slice(0, cfg.limit)` and map each record to its `word`.

Building the trie is O(total characters). The prefix walk is O(prefix length). Collection is O(nodes below the landing point). The sort is O(m log m) in the number of matches.

## Worked example — 1729 Ranked trie autocomplete / scenario 1

The word list, quoted from line 9 of `tests/1729.cjs`:

```js
const words=[{word:'apple',score:2},{word:'a',score:9},{word:'atom',score:4},{word:'apricot',score:8},{word:'ape',score:2},{word:'z',score:99},{word:'',score:7}];
```

Their input positions are `apple` 0, `a` 1, `atom` 2, `apricot` 3, `ape` 4, `z` 5, `''` 6. Each one's terminal record is `{word, score, index}`.

After insertion the interesting part of the trie looks like this. Only nodes that carry a terminal are annotated.

```text
root                      terminal: {word:'', score:7, index:6}
├── a                     terminal: {word:'a', score:9, index:1}
│   ├── p
│   │   ├── p → l → e     terminal: {word:'apple', score:2, index:0}
│   │   ├── r → i → c → o → t   terminal: {word:'apricot', score:8, index:3}
│   │   └── e             terminal: {word:'ape', score:2, index:4}
│   └── t → o → m         terminal: {word:'atom', score:4, index:2}
└── z                     terminal: {word:'z', score:99, index:5}
```

Take the third prefix of the test loop, `'ap'`, with `cfg = {"rank":"score","limit":2}`.

| Step | State |
| --- | --- |
| prefix walk, `'a'` | root has a child `a`; `node` moves to it |
| prefix walk, `'p'` | that node has a child `p`; `node` moves to it |
| stack start | `[p-node]` |
| pop `p`, no terminal | push children: `[p-of-apple, r-of-apricot, e-of-ape]` |
| pop `e` | terminal → `found = [ape]` |
| pop `r`… | walk down `ricot`, terminal → `found = [ape, apricot]` |
| pop `p`… | walk down `ple`, terminal → `found = [ape, apricot, apple]` |

The pop order depends on how the children were inserted; it does not matter, because the sort comes next.

| Candidate | score | word |
| --- | --- | --- |
| `apricot` | 8 | `apricot` |
| `ape` | 2 | `ape` |
| `apple` | 2 | `apple` |

`primary` is `right.score - left.score`, so `apricot` leads. `ape` and `apple` both score 2, so `primary` returns `0` and `lexical` decides: `'ape' < 'apple'` because the fourth character `e` precedes `p`. The sorted order is `['apricot', 'ape', 'apple']`, and `slice(0, 2)` gives `['apricot', 'ape']`.

The test asserts this by recomputing the same expectation on line 10 and calling `check({words,prefix}, expected.slice(0,cfg.limit).map(x=>x.word))`.

The other four prefixes in the same loop, for scenario 1:

| Prefix | Matches | Sorted by score, then lexically | Result after `slice(0,2)` |
| --- | --- | --- | --- |
| `''` | all seven, including `''` | `z`(99), `a`(9), `apricot`(8), `''`(7), `atom`(4), `ape`(2), `apple`(2) | `['z','a']` |
| `'a'` | `apple`, `a`, `atom`, `apricot`, `ape` | `a`(9), `apricot`(8), `atom`(4), `ape`(2), `apple`(2) | `['a','apricot']` |
| `'apple'` | `apple` only | `apple` | `['apple']` |
| `'missing'` | none — the walk falls off at `'m'` | — | `[]` |

The `'missing'` row is the one that exercises the early return: the root has children `a` and `z`, so `node.children.get('m')` is `undefined` and the function returns `[]` before any collecting happens.

The reference solution, as it now reads in `solutions/1729.cjs`:

```js
function trie(input) {
  const root = {children: new Map(), terminal: null};
  input.words.forEach((row, index) => {
    let node = root;
    for (const ch of row.word) {
      if (!node.children.has(ch)) {
        node.children.set(ch, {children: new Map(), terminal: null});
      }
      node = node.children.get(ch);
    }
    node.terminal = {...row, index};
  });
  let node = root;
  for (const ch of input.prefix) {
    node = node.children.get(ch);
    if (!node) return [];
  }
  const found = [];
  const stack = [node];
  while (stack.length) {
    const current = stack.pop();
    if (current.terminal) found.push(current.terminal);
    for (const child of current.children.values()) stack.push(child);
  }
  const lexical = (left, right) => (left.word < right.word ? -1 : left.word > right.word ? 1 : 0);
  const primary = (left, right) =>
    cfg.rank === 'score' ? right.score - left.score :
    cfg.rank === 'shortest' ? left.word.length - right.word.length :
    cfg.rank === 'longest' ? right.word.length - left.word.length :
    cfg.rank === 'recent' ? right.index - left.index :
    0;
  found.sort((left, right) => primary(left, right) || lexical(left, right));
  return found.slice(0, cfg.limit).map(entry => entry.word);
}
```

## Policy matrix — what changes between the variants

Each prompt's `Semantic key` sets two knobs. `rank` selects which branch of `primary` is live; `limit` is the argument to `slice`.

| ID | Variant | What differs in the prompt | What differs in the code |
| --- | --- | --- | --- |
| 1729 | rank=score; limit=2 | `{"limit":2,"rank":"score"}` | `primary` is `right.score - left.score`; `slice(0, 2)` |
| 1730 | rank=score; limit=4 | `{"limit":4,"rank":"score"}` | same comparator; `slice(0, 4)` |
| 1731 | rank=shortest; limit=2 | `{"limit":2,"rank":"shortest"}` | `primary` is `left.word.length - right.word.length`; `slice(0, 2)` |
| 1732 | rank=shortest; limit=4 | `{"limit":4,"rank":"shortest"}` | same comparator; `slice(0, 4)` |
| 1733 | rank=longest; limit=2 | `{"limit":2,"rank":"longest"}` | length comparison flips to `right - left`; `slice(0, 2)` |
| 1734 | rank=longest; limit=4 | `{"limit":4,"rank":"longest"}` | same comparator; `slice(0, 4)` |
| 1735 | rank=recent; limit=2 | `{"limit":2,"rank":"recent"}` | `primary` is `right.index - left.index`, so the last-listed word wins; `slice(0, 2)` |
| 1736 | rank=recent; limit=4 | `{"limit":4,"rank":"recent"}` | same comparator; `slice(0, 4)` |
| 1737 | rank=lexical; limit=2 | `{"limit":2,"rank":"lexical"}` | `primary` returns `0`, so `lexical` alone orders; `slice(0, 2)` |
| 1738 | rank=lexical; limit=4 | `{"limit":4,"rank":"lexical"}` | same comparator; `slice(0, 4)` |

For prefix `'a'` on the shared word list, the five ranks give visibly different heads: `score` → `a`, `shortest` → `a`, `longest` → `apricot`, `recent` → `ape` (index 4 is the latest match), `lexical` → `a`. `index` is only consulted by `recent`, but it is recorded in every variant because the same body ships to all ten files.

## Pitfalls the tests are designed to catch

- **Skipping the trie.** `input.words.filter(w => w.word.startsWith(input.prefix))` passes all five assertions. The prompt names the structure, and the CONTRACT section says structural requirements "also need source review".
- **Forgetting the empty word.** `{word:'',score:7}` has no characters, so its terminal is written directly onto the root. If you only set terminals on nodes created inside the character loop, the `''` prefix case comes back one word short.
- **Recording `index` on the caller's objects.** `row.index = index` mutates the input and fails `'Input must not mutate'`. Copy with `{...row, index}`.
- **Sorting `input.words`.** Same failure, for the same reason. The reference never sorts anything but the freshly built `found` array.
- **Dropping the lexical tie-break.** `ape` and `apple` both score 2. Without the `|| lexical(...)` clause the result depends on the stack pop order, which depends on `Map` insertion order — the `'ap'` case is exactly the case that catches it.
- **Treating `recent` as "earliest".** `recent means reverse input position`, so the comparator is `right.index - left.index`. Getting the sign backwards flips the whole 1735/1736 result.
- **Slicing before sorting.** `found.slice(0,cfg.limit).sort(...)` cuts arbitrary candidates and then orders the survivors. Sort first.
- **Returning the records.** The expectation is `.map(x=>x.word)` — an array of strings. Returning `{word, score}` objects fails `deepEqual`.

## Try it yourself

1. Add a rank `score-then-shortest` that orders by score descending and breaks score ties by length before falling back to lexical. How many lines of `primary` change?
2. Store a per-node count of terminals in the subtree during insertion, then use it to return early once `limit` words have been collected. For which of the five ranks is that early exit actually safe?
3. Make the prefix match case-insensitively without lower-casing `input.words` in place. Where does the copy have to happen?
4. In words: the reference collects the whole subtree and then sorts. For `rank: 'lexical'` a trie can produce the answer in order with no sort at all. Describe that traversal, and say what has to be true of the children `Map` for it to work.
