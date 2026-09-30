# 12. Tree traversal and global ordering invariants

Read [tree sum](../../28-tree-sum.js), [binary search tree](../../58-binary-search-tree.js), and their references in [SOLUTIONS.md](../../SOLUTIONS.md) and [round-two implementations](../../solutions/round2-remaining.cjs). Both structures are trees, but one organizes arbitrary children for aggregation while the other imposes a numeric ordering relation. Traversal shape and ordering meaning are separate concerns.

## Structural recursion mirrors the input

A general tree node contains one value and an array of child trees. Its total is its own value plus the total of each child. Null represents an empty tree and contributes zero. A leaf has an empty children array, whose sum is zero, so no separate leaf formula is required. The same rule applies recursively at every depth.

A proof follows the structure: assume each child call returns the correct sum of that child's subtree. Adding those results and the current value accounts for every node in the current tree exactly once. The empty case anchors the argument. This is different from hoping recursion eventually finishes. Termination relies on the input being a finite acyclic tree with smaller child subtrees, not an arbitrary object graph containing cycles.

If two parents point to the same child object, the input is no longer an ordinary tree by ownership. The simple recursive algorithm visits the shared object once through each path and counts it more than once. A visited set would change that behavior to count unique object identities. Neither interpretation should be adopted silently; define whether the application models path occurrences or unique entities before adding graph-style deduplication.

## Worked trace: sum return values, not global guesses

Use a root valued 5 with two children: a leaf valued negative two and a node valued 4 whose only child is a leaf valued 3. The negative-two leaf returns negative two. The inner leaf returns three. Its parent returns seven. The root returns five plus negative two plus seven, which is ten. A diagram of call returns makes the aggregation visible without a mutable global accumulator.

A shared global total can also compute sums if carefully reset, but it creates extra state that can leak between calls or interfere with reentrant use. A return-based function naturally supports calling treeSum on two different trees independently. Test a nonempty tree followed by null and another nonempty tree; stale global state can make the later results wrong even when a single sample passes.

The call stack uses space proportional to tree height for a straightforward recursive traversal. A balanced tree and a long chain with the same node count have different heights. JavaScript engines have finite call stacks, so arbitrarily deep input can overflow even when the algorithm is mathematically linear. An explicit stack is a useful extension when depth is untrusted, but the original exercise specifically practices recursion.

## A BST invariant applies to entire subtrees

Exercise 58 requires every value in a node's left subtree to be smaller than the node and every value in its right subtree to be larger. Checking only the immediate child values is insufficient. A left child may be smaller than the root while one of that child's right descendants is larger than the root, violating the global rule.

For example, root ten with left child five and that child's right child twelve passes immediate comparisons at each link: five is less than ten, twelve is greater than five. Yet twelve lies in ten's left subtree and violates its upper bound. A validator needs inherited bounds or an equivalent globally ordered traversal check, not only local parent comparisons.

The supplied BST insertion follows comparisons down one path and ignores duplicates. In-order traversal visits left subtree, current value, then right subtree. Under the strict ordering invariant, that sequence is strictly increasing. A duplicate should not appear twice in toArray. The sample includes a repeated thirty specifically to demonstrate the duplicate policy.

## Worked trace: insertion order changes shape

Insert 8, 3, 10, 6, 1, 14, 4. Eight becomes the root. Three goes left, ten right. Six goes left from eight then right from three. One goes left from eight and left from three. Fourteen goes right from eight then right from ten. Four goes left from eight, right from three, and left from six. In-order traversal yields 1, 3, 4, 6, 8, 10, 14 regardless of the shape's unevenness.

Searching for seven follows eight left, three right, six right, then null. Each comparison discards one subtree because the invariant rules it out. The work is proportional to the height traversed. This unbalanced BST does not promise logarithmic height. Inserting sorted values can create a chain and make a search linear. Do not describe every binary search tree operation as logarithmic without a balancing assumption.

A sorted output is a strong observable check but not a complete inspection of every implementation detail. A fake implementation could store values in a Set and sort on toArray, satisfying some public examples without practicing the intended tree structure. If the learning objective includes actual node links and search paths, inspect that representation or instrument comparisons in your scratch implementation. Keep functional API checks separate from algorithm-choice evidence.

## Laboratory: shape-sensitive tests

For treeSum, build a leaf, null, the mixed-sign worked tree, and two independent trees called in succession. Freeze the nodes and children arrays to catch accidental writes. Compare a recursive result with a simple explicit-stack sum for a bounded small fixture. Use a separate depth experiment only at modest sizes and do not intentionally exhaust the runtime stack as a routine check.

For BST, insert the worked sequence, insert one duplicate, and compare toArray with a sorted distinct copy of the input. Check membership for present endpoints and an absent interior value. Build a second tree from the same values in sorted order and compare outputs, then count search comparisons in both shapes. The output can be identical while path lengths differ.

Write an independent bounds validator for your own node representation. Each recursive call receives an exclusive lower and upper bound. A node must lie strictly between them; left inherits the lower bound and uses the current value as upper, while right does the reverse. Test the malformed ten-five-twelve structure to prove the validator rejects a global violation that local checks miss. Use ordinary finite values for these fixtures; a broader numeric domain needs its own ordering policy.

## Debugging case: traversal order is swapped

A learner visits the node before its left child and calls the result in-order. On a tree with only a root, every traversal looks the same. On root two with left one and right three, the output two, one, three exposes the mistake. The name of a traversal is a sequence of actions, not a label attached after implementation. State left, node, right before writing the recursive function.

## Graded exercises

**C12-A:** Trace the mixed-sign tree sum with return values on every edge. Four points require null and leaf cases and no leaked global state.

**C12-B:** Draw the worked BST after every insertion and list the search path for seven. Five points require strict subtree ordering and duplicate omission.

**C12-C:** Build the inherited-bounds validator and reject ten-five-twelve. Five points require explaining why immediate comparisons are insufficient.

**C12-D:** Compare balanced-looking and sorted insertion orders using comparison counts. Four points require distinguishing node count, height, functional result, and worst-case complexity.

## Hints, before the review

For C12-A, each call returns a subtotal to its parent. For C12-C, an ancestor's restriction remains active at every descendant. For C12-D, the reference performs no balancing rotations. Read [the review](reviews/12-tree-traversal-and-bst-order.md) after writing the height assumption beside every complexity claim.
