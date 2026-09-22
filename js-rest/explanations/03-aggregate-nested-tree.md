# Aggregate nested tree — js-rest 112–115

**What you practise:** folding a value over every node of an arbitrarily deep tree using an explicit stack instead of recursion.
**Prerequisites:** array `push`/`pop` as a stack; the difference between an identity seed (`0`) and a sentinel seed (`Infinity`); what a call-stack overflow is.
**Exercises:** 112: Aggregate nested tree: sum, 113: Aggregate nested tree: count, 114: Aggregate nested tree: min, 115: Aggregate nested tree: max.

## The problem in plain words

The input is either `null` or a node `{value: number, children: Tree[]}`, and each child is another node of the same shape. There is no bound on the depth: a tree can be a chain of a hundred thousand nodes, each with exactly one child.

You must visit every node exactly once and reduce all the values down to a single answer — their total, how many there are, the smallest, or the largest.

"Policy" here is the reduction: what the accumulator starts at and how each node folds into it. Everything else — the null guard, the traversal, the loop — is shared.

The prompt adds a constraint that is really the lesson: "Use a stack to handle deep trees without recursive calls." A recursive walk allocates a JavaScript call frame per level, and a deep enough tree throws `RangeError: Maximum call stack size exceeded`. An explicit array used as a stack lives on the heap, which is far larger. The visible tests are three nodes deep at most, so they cannot catch a recursive solution — but the prompt states the requirement, and the reviewer reads the source. Compare this with [16 Tree label order](16-tree-label-order.md), where the prompt does not forbid recursion and the reference uses it.

## The contract you must honour

Taken from `tests/112.cjs` through `tests/115.cjs`:

- `null` is a valid input. For 112 and 113 it asserts `0`; for 114 and 115 it asserts `null`. The empty answer is not the same across the family.
- A single node `{"value":3,"children":[]}` asserts `3` for sum, `1` for count, `3` for min and `3` for max.
- The shared three-node tree `{"value":2,"children":[{"value":-1,"children":[]},{"value":7,"children":[]}]}` asserts `8` for sum, `3` for count, `-1` for min and `7` for max. Note that 112's answer includes the negative child, so you cannot skip negatives.
- Return a plain number (or `null` for the empty case in 114 and 115), never an array or an object.
- Every case, including `null`, clones with `structuredClone` and finishes with `assert.deepEqual(input, before, 'Input must not mutate')`, so you may not splice `children` as you walk.
- Nothing in the tests inspects visit order, so any traversal order is acceptable. All four reductions are order-independent.

## Approach

1. Guard the `null` input first and return the family's empty answer. Do this before touching the accumulator, so the sentinel seed can never leak out.
2. Create the stack: `const stack = [input]`. The root is the only thing on it to begin with.
3. Seed the accumulator with the policy's identity or sentinel: `0` for sum, `0` for count, `Infinity` for min, `-Infinity` for max.
4. Loop while the stack is not empty. Pop a node, fold it into the accumulator, then push each of its children.
5. Return the accumulator.

This visits every node once, so it is O(n) time. Peak memory is the widest frontier the stack ever holds, which for a chain is 1 and for a wide shallow tree is the number of children.

Why `Infinity` works as the min seed: every finite number is smaller than `Infinity`, so the first real value always replaces it. And because the `null` case has already returned, a non-`null` tree always has at least a root, so the seed is always replaced at least once and can never be returned.

## Worked example — 112 Aggregate nested tree: sum

The first input in `tests/112.cjs` is `null`. The guard fires on the first line, `0` is returned, and the loop never starts — asserted on line 2.

The third case, on line 4, is the one that exercises the walk:

```js
{"value":2,"children":[{"value":-1,"children":[]},{"value":7,"children":[]}]}
```

Call the nodes `root(2)`, `A(-1)` and `B(7)`.

| Iteration | Stack before | Popped | `total` after | Stack after |
| --- | --- | --- | --- | --- |
| — | `[root]` | — | `0` | `[root]` |
| 1 | `[root]` | `root(2)` | `0 + 2 = 2` | `[A, B]` |
| 2 | `[A, B]` | `B(7)` | `2 + 7 = 9` | `[A]` |
| 3 | `[A]` | `A(-1)` | `9 + -1 = 8` | `[]` |
| 4 | `[]` | — | `8` | loop ends |

`pop` takes from the end, so `B` is visited before `A` even though `A` is the first child. For a sum that is irrelevant, which is why this family can use the cheap `pop` rather than a queue. The returned value is `8`, asserted on line 4 as `assert.deepEqual(solve(input),8)`.

The reference solution, as it now reads in `solutions/112.cjs`:

```js
function solve(input) {
  if (input === null) {
    return 0;
  }
  const stack = [input];
  let total = 0;
  while (stack.length > 0) {
    const node = stack.pop();
    total += node.value;
    for (const child of node.children) {
      stack.push(child);
    }
  }
  return total;
}
```

## Policy matrix — what changes between the variants

| ID | Variant | What differs in the prompt | What differs in the code |
| --- | --- | --- | --- |
| 112 | sum | "Return sum across all nodes. Empty tree returns 0." | seed `0`, fold `total += node.value` |
| 113 | count | "Return count across all nodes. Empty tree returns 0." | seed `0`, fold `nodeCount++`; `node.value` is never read |
| 114 | min | "Return min across all nodes. Empty tree returns null." | seed `Infinity`, fold `Math.min`, null guard returns `null` |
| 115 | max | "Return max across all nodes. Empty tree returns null." | seed `-Infinity`, fold `Math.max`, null guard returns `null` |

## Pitfalls the tests are designed to catch

- **Recursing.** The tests cannot see it, but the prompt requires a stack and the reviewer reads the file. A hundred-thousand-node chain is the case the requirement exists for.
- **Returning the sentinel for the empty tree.** Without the early guard, 114 returns `Infinity` for `null` input and fails `assert.deepEqual(solve(input),null)` on line 2. Seeding min with `0` instead is a subtler version of the same bug: it would return `0` for a tree whose values are all positive.
- **Returning `0` from 114 or 115 for `null`.** The empty answer differs across the family: `0` for sum and count, `null` for min and max. Copying the guard from 112 into 114 fails the very first case.
- **Skipping negative values in the sum.** The shared tree contains `-1` and asserts `8`, not `9`.
- **Reading `node.value` in 113.** Count must be independent of the values; returning the number of *distinct* values, or summing `1` only for positive nodes, breaks the three-node case, which asserts `3`.
- **Draining `children` while walking.** `stack.push(...node.children.splice(0))` empties the caller's arrays and fails `assert.deepEqual(input, before, 'Input must not mutate')`.
- **Using `stack.shift()` thinking it is required.** It converts the walk to breadth-first, which is correct but slower; nothing here needs it. Visit order matters in family 16, not here.

## Checking your work

Run one exercise at a time:

```text
node js-rest/verify.cjs --id=112
```

The tests are shallow, so three of this family's requirements can only be checked by reading your own file:

- Is there a `while (stack.length > 0)` loop and no function that calls itself? That is the prompt's central requirement, and no assertion enforces it.
- Does the `null` guard return the right empty answer for *this* variant — `0` for 112 and 113, `null` for 114 and 115?
- Is the accumulator seeded with an identity (`0`) or a sentinel (`±Infinity`) that the first real value is guaranteed to replace?

A useful self-test the suite does not include: build a chain of 200,000 nodes in a scratch file and run your solution on it. A stack-based version answers; a recursive one throws `RangeError: Maximum call stack size exceeded`.

## Try it yourself

1. Add a `depth` variant that returns the length of the longest root-to-leaf path. What has to be pushed alongside each node, and why is `Math.max` no longer enough on its own?
2. Add an `average` variant. It needs two accumulators; can you still do it in one pass?
3. Build a chain of 200,000 nodes in a scratch file and run both a recursive and the stack-based sum over it. Record what each does.
4. In words: `Infinity` works as a min seed because every finite value beats it. Name a value that would break that argument, and say why the prompt's "tree of numbers" promise rules it out.
