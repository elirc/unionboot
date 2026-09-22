# Join by identifier — js-rest 108–111

**What you practise:** implementing the four relational joins by hand, using hash lookups instead of nested loops.
**Prerequisites:** [01 Index records](01-index-records.md) for `Map`-based indexing; `Set` for de-duplication; numeric `sort` comparators.
**Exercises:** 108: inner join by identifier, 109: left join by identifier, 110: full join by identifier, 111: anti join by identifier.

## The problem in plain words

You get `{left: [{id, value}], right: [{id, value}]}`. The ids are numbers and are unique within each side, but an id may appear on one side, the other, or both. Think of two spreadsheets that describe the same customers from different systems.

A join decides which identifiers survive into the result and what to do about the side that has no row. Three of the four variants return rows shaped `[id, leftValueOrNull, rightValueOrNull]`, where `null` means "this side had nothing for this id". The fourth, the anti join, returns two-element rows because by construction the right side is always absent.

"Policy" here is the membership rule: inner keeps ids present on both sides, left keeps ids present on the left, full keeps every id seen anywhere, anti keeps ids the left has and the right lacks. The rest of the code — index, collect ids, sort, build rows — is identical.

The naive way to do this is a nested loop: for every left row, scan the whole right side. That is O(n·m). The whole point of the exercise is the hash-join shape: index each side once, then answer every membership question in constant time.

## The contract you must honour

Taken from `tests/108.cjs` through `tests/111.cjs`:

- Rows are ordered by id ascending, numerically. The shared second case uses ids 1, 2, 3.
- 108 inner: `{"left":[{"id":1,"value":"a"},{"id":2,"value":"b"}],"right":[{"id":2,"value":"B"},{"id":3,"value":"C"}]}` asserts `[[2,"b","B"]]`. Id 1 is dropped because the right side lacks it; id 3 is dropped because the left side lacks it.
- 109 left: the same input asserts `[[1,"a",null],[2,"b","B"]]`. Id 1 survives with a `null` right value; id 3 is still dropped.
- 110 full: the same input asserts `[[1,"a",null],[2,"b","B"],[3,null,"C"]]`. Every id survives.
- 111 anti: the same input asserts `[[1,"a"]]` — two elements, no `null` slot.
- `{"left":[],"right":[]}` asserts `[]` in all four.
- `{"left":[],"right":[{"id":7,"value":"x"}]}` asserts `[]` for 108, 109 and 111, and `[[7,null,"x"]]` for 110. This is the case that separates full from the rest.
- Every case ends with `assert.deepEqual(input, before, 'Input must not mutate')` against a `structuredClone`, so neither array may be sorted in place.

## Approach

1. Build `leftValueById` as `new Map(input.left.map(row => [row.id, row.value]))`. `new Map(...)` accepts an array of pairs, and `.map` produces a new array, so the input is untouched. Do the same for the right side.
2. Collect the candidate ids: `[...new Set([...leftValueById.keys(), ...rightValueById.keys()])]`. The `Set` removes the ids that appear on both sides; the spread turns it back into an array you own.
3. Sort those ids with `(a, b) => a - b`. They are numbers, so the default string sort would order 10 before 2.
4. Walk the sorted ids and apply the membership policy. Skip the ids the policy rejects.
5. For a surviving id, build the row. `map.has(id) ? map.get(id) : null` is deliberate: a stored value could legitimately be `undefined`, and `map.get(id) ?? null` would turn that into `null` too. Asking `has` first keeps "absent" and "present but empty" distinct.

Cost: O(n + m) to index, O(k log k) to sort the k distinct ids, O(k) to build rows.

## Worked example — 108 inner join by identifier

The first input in `tests/108.cjs` is `{"left":[],"right":[]}`: both maps are empty, the union of keys is empty, the loop never runs, and `[]` is returned — asserted on line 2.

The interesting case is the second, on line 3:

```js
{"left":[{"id":1,"value":"a"},{"id":2,"value":"b"}],"right":[{"id":2,"value":"B"},{"id":3,"value":"C"}]}
```

| Step | State |
| --- | --- |
| index left | `leftValueById = {1→"a", 2→"b"}` |
| index right | `rightValueById = {2→"B", 3→"C"}` |
| key spread | `[1, 2, 2, 3]` — note the duplicate 2 |
| `new Set` | `{1, 2, 3}` |
| spread + sort | `[1, 2, 3]` |

Now the loop, one row per candidate id:

| id | left has | right has | inner policy | row pushed |
| --- | --- | --- | --- | --- |
| 1 | yes | no | rejected | — |
| 2 | yes | yes | accepted | `[2, "b", "B"]` |
| 3 | no | yes | rejected | — |

Result: `[[2,"b","B"]]`, which is what line 3 asserts. The third case, an empty left with one right row, produces candidate ids `[7]`, fails the inner test, and returns `[]`.

The reference solution, as it now reads in `solutions/108.cjs`:

```js
function solve(input) {
  const leftValueById = new Map(input.left.map(row => [row.id, row.value]));
  const rightValueById = new Map(input.right.map(row => [row.id, row.value]));
  const allIds = [...new Set([...leftValueById.keys(), ...rightValueById.keys()])];
  allIds.sort((a, b) => a - b);
  const rows = [];
  for (const id of allIds) {
    if (!(leftValueById.has(id) && rightValueById.has(id))) {
      continue;
    }
    rows.push([
      id,
      leftValueById.has(id) ? leftValueById.get(id) : null,
      rightValueById.has(id) ? rightValueById.get(id) : null,
    ]);
  }
  return rows;
}
```

## Policy matrix — what changes between the variants

| ID | Variant | What differs in the prompt | What differs in the code |
| --- | --- | --- | --- |
| 108 | inner | "Implement a inner join" | keep only when `left.has(id) && right.has(id)` |
| 109 | left | "Implement a left join" | keep only when `left.has(id)` |
| 110 | full | "Implement a full join" | no membership test at all; every candidate id is emitted |
| 111 | anti | "Return left-only `[id, leftValue]` rows" | keep when `left.has(id) && !right.has(id)`, and the row is two elements instead of three |

## Pitfalls the tests are designed to catch

- **Sorting a side in place.** `input.left.sort(...)` fails `assert.deepEqual(input, before, 'Input must not mutate')` on every case. Sort the id array you built instead.
- **Default sort on numeric ids.** `allIds.sort()` compares `10 < 2` as strings. The visible ids are single digits so the tests pass, but the prompt says ids are numeric and the reviewer reads the comparator.
- **Iterating only the left side for a full join.** 110's third case, `{"left":[],"right":[{"id":7,"value":"x"}]}`, asserts `[[7,null,"x"]]`. A loop over `input.left` alone returns `[]` and fails only that one case.
- **Emitting a three-element row from the anti join.** 111 asserts `[[1,"a"]]`. `assert.deepEqual` compares array length, so `[1,"a",null]` fails.
- **Using `map.get(id) ?? null` instead of checking `has`.** It gives the same answer for these tests, but it silently collapses a stored `undefined` into "absent". Once a value can legitimately be `undefined`, the two are different facts.
- **Duplicate ids in the candidate list.** Concatenating the key lists without a `Set` emits id 2 twice for the shared case, producing `[[2,"b","B"],[2,"b","B"]]` for the inner join.
- **Forgetting that 111 still has to sort.** The prompt says "sorted by id" for the anti join too, and the id list it filters is the same sorted union.

## Checking your work

Run one exercise at a time:

```text
node js-rest/verify.cjs --id=108
```

Before you run it, read your own file for these three things:

- The only array you sort should be the id list you built with `new Set(...)`. Anything reached through `input` is off limits.
- The sort comparator must be `(a, b) => a - b`, not the default. Ids are numbers.
- For 111, count the elements you push. Two, not three.

A useful self-test the suite does not include: give both sides ids `[2, 10]` with distinct values and check the row order. A default sort puts `10` first and the bug is invisible on single-digit data.

## Try it yourself

1. Add a `right join` variant. Which single expression changes, and which test case would separate it from the left join?
2. The unique-ids promise is doing real work. Drop it: make the left side able to repeat an id, and decide what an inner join should produce. How does the row count change?
3. Replace the `Set` union with a single pass that walks the left ids and then appends only the right ids the left lacks. Is it shorter? Is it clearer?
4. In words: the anti join returns two-element rows. Argue for and against making it return `[id, leftValue, null]` for consistency with its three siblings.
