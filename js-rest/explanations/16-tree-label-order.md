# Tree label order — js-rest 164–167

**What you practise:** the three classic tree traversals plus a leaf filter, and the difference a queue makes against a stack or a recursive call.
**Prerequisites:** [03 Aggregate nested tree](03-aggregate-nested-tree.md) for the tree shape; recursion; using an array plus a read cursor as a queue.
**Exercises:** 164: Tree labels in preorder, 165: Tree labels in postorder, 166: Tree labels in level-order, 167: Tree labels in leaves-only.

## The problem in plain words

The input is `null` or a node `{label: string, children: Node[]}`. You must return every label as a flat array. The question is what *order* they come out in, and — for one variant — which labels come out at all.

Preorder records a node before descending into its children, so a parent always precedes its descendants and the root is first. Postorder records a node after all its children, so the root is last. Level-order records everything at depth 0, then everything at depth 1, and so on. Leaves-only records just the childless nodes, in depth-first order.

"Policy" is the order. Preorder, postorder and leaves-only differ by where one `push` sits inside a recursive walk; level-order is structurally different, because breadth-first cannot be expressed by recursion over children in the natural way.

Unlike family 03, this prompt does not ban recursion — it only promises the trees contain no cycles. That is why the references here recurse and the references there use an explicit stack.

## The contract you must honour

Taken from `tests/164.cjs` through `tests/167.cjs`:

- `null` asserts `[]` in all four.
- The shared tree asserts `["a","b","d","c"]` for preorder, `["d","b","c","a"]` for postorder, `["a","b","c","d"]` for level-order and `["d","c"]` for leaves-only:

  ```js
  {"label":"a","children":[{"label":"b","children":[{"label":"d","children":[]}]},{"label":"c","children":[]}]}
  ```

  In picture form:

  ```text
  a
  ├── b
  │   └── d
  └── c
  ```

- `{"label":"x","children":[]}` asserts `["x"]` in all four. A childless root is both the whole tree and a leaf.
- The return value is a flat array of label strings.
- Child order is respected: `b` comes before `c` everywhere they both appear, because `b` is listed first in `children`.
- Every case ends with `assert.deepEqual(input, before, 'Input must not mutate')` against a `structuredClone`.

## Approach

1. Guard `input === null` and return `[]`.
2. Create `labels = []`.
3. Walk, according to the variant:
   - **preorder**: a recursive `visit(node)` that pushes `node.label` and then recurses over `node.children` in order;
   - **postorder**: the same function with the push moved after the loop;
   - **leaves-only**: the same shape again, but the push is guarded by `node.children.length === 0`;
   - **level-order**: no recursion. Keep an array `queue` seeded with the root and a cursor index. Read `queue[cursor]`, push its label, append its children to the end of the queue, advance the cursor. Because the array grows while the loop condition re-reads `queue.length`, the loop naturally continues until every node has been read.
4. Return `labels`.

Cost: every variant visits each node once, O(n).

Why the level-order queue uses a cursor rather than `queue.shift()`: `shift` removes the first element and re-indexes the rest, which is O(n) per call and O(n²) overall. Moving a read index forward is O(1) and leaves the consumed nodes in the array, which costs memory but not time. Both are correct; the cursor is the habit worth building.

Why level-order cannot be a simple recursion over children: the recursive call descends immediately, so it reaches depth 2 of the first subtree before it has seen depth 1 of the second. Breadth-first needs an explicit collection that holds a whole level, and that is the queue.

## Worked example — 164 Tree labels in preorder

The first input in `tests/164.cjs` is `null`, which the guard turns into `[]` (line 2).

The second case, on line 3, is the shared tree. Trace the recursion, indenting by depth:

| Step | Call | Action | `labels` after |
| --- | --- | --- | --- |
| 1 | `visit(a)` | push `"a"` | `["a"]` |
| 2 | `visit(b)` | push `"b"` | `["a","b"]` |
| 3 | `visit(d)` | push `"d"`; no children | `["a","b","d"]` |
| 4 | back in `visit(b)` | children exhausted, return | `["a","b","d"]` |
| 5 | `visit(c)` | push `"c"`; no children | `["a","b","d","c"]` |
| 6 | back in `visit(a)` | children exhausted, return | `["a","b","d","c"]` |

Result `["a","b","d","c"]`, asserted on line 3. Notice that `d`, a grandchild, appears before `c`, a child of the root: preorder goes deep before it goes wide.

The same tree under the other policies:

- **postorder** moves the push to after the child loop, so the order of *completion* is recorded: `d` finishes first, then `b`, then `c`, then `a` — `["d","b","c","a"]`.
- **level-order** reads the queue in arrival order. Queue starts `[a]`; reading `a` appends `b, c`; reading `b` appends `d`; reading `c` appends nothing; reading `d` appends nothing. Labels come out `["a","b","c","d"]` — and this is the one variant where `c` beats `d`.
- **leaves-only** walks preorder but pushes only childless nodes: `a` has children, `b` has a child, `d` is a leaf, `c` is a leaf — `["d","c"]`.

The reference solution, as it now reads in `solutions/164.cjs`:

```js
function solve(input) {
  if (input === null) {
    return [];
  }
  const labels = [];
  const visit = node => {
    labels.push(node.label);
    for (const child of node.children) {
      visit(child);
    }
  };
  visit(input);
  return labels;
}
```

And the level-order walk from `solutions/166.cjs`, which is the structurally different one:

```js
  const queue = [input];
  for (let cursor = 0; cursor < queue.length; cursor++) {
    const node = queue[cursor];
    labels.push(node.label);
    for (const child of node.children) {
      queue.push(child);
    }
  }
```

## Policy matrix — what changes between the variants

| ID | Variant | What differs in the prompt | What differs in the code |
| --- | --- | --- | --- |
| 164 | preorder | "Return labels in preorder" | `labels.push` before the child loop |
| 165 | postorder | "Return labels in postorder" | `labels.push` after the child loop |
| 166 | level-order | "Return labels in level-order" | recursion replaced by a queue with a read cursor |
| 167 | leaves-only | "leaves-only uses depth-first order" | preorder walk with `if (node.children.length === 0)` around the push |

## Pitfalls the tests are designed to catch

- **Using a stack for level-order.** Popping from the end gives depth-first order, so 166 returns `["a","c","b","d"]` — wrong twice over. Breadth-first needs first-in-first-out.
- **Reversing children to compensate for a stack.** `stack.push(...node.children.reverse())` mutates `node.children` and fails `assert.deepEqual(input, before, 'Input must not mutate')`. `[...node.children].reverse()` is the safe form, but for these references it is not needed at all.
- **Pushing a leaf's label twice in 167.** A node with no children must be recorded once; writing both an unconditional push and a leaf-guarded push gives `["d","d","c","c"]`.
- **Treating the root as never a leaf in 167.** The third case is a childless root and asserts `["x"]`.
- **Returning nodes instead of labels.** The assertions compare against arrays of strings.
- **Missing the `null` guard.** `input.children` on `null` throws `TypeError`, failing the first case of every file.
- **Confusing preorder with leaves-only because both are depth-first.** They visit in the same order; only the push condition differs. The shared tree separates them: `["a","b","d","c"]` against `["d","c"]`.
- **Using `queue.shift()` in 166.** Correct, and the tests pass, but it is O(n²) on a wide tree. The cursor form is the same length and linear.

## Try it yourself

1. Add a `reverse-level-order` variant, deepest level first. Can you get it by changing one line of 166?
2. Rewrite 164 with an explicit stack, the way family 03 requires. What has to happen to child order, and why?
3. Add a `depths` variant returning `{label, depth}` pairs in level order. What must the queue carry?
4. In words: explain why level-order cannot be written as a plain recursion over `children`, using the shared tree to show where a recursive walk goes wrong.
