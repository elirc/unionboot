# Review 12. Trees and global ordering

Return to [the questions](../12-tree-traversal-and-bst-order.md). A tree algorithm's complexity and correctness depend on both the node relation and the input's structural assumptions.

## C12-A: subtotal returns

The negative-two leaf returns negative two. The three leaf returns three. Its parent valued four returns seven. The root valued five returns ten after adding negative two and seven. Null returns zero, and an ordinary leaf returns its own value because the sum over no children is zero. Returning subtotals avoids a mutable accumulator shared across independent calls.

A sufficient implementation checks null, then returns node.value plus the sum of recursive child calls. It assumes the supplied finite tree shape. A cycle would prevent termination; a shared child would be counted once for each incoming path. Those cases require a graph policy, not a casual visited-set patch whose meaning is left unexplained.

The work visits each node once in an ordinary tree. Recursive auxiliary space follows the height of the active call chain. A broad shallow tree and a narrow deep tree with the same node count therefore differ in stack demand. An explicit stack can avoid language call-stack limits but still needs storage for pending work.

## C12-B: insertion and search

After inserting 8, 3, 10, 6, 1, 14, 4, the root is eight, its left child three, and its right child ten. Three has left one and right six; six has left four. Ten has right fourteen. In-order traversal yields 1, 3, 4, 6, 8, 10, 14. Inserting six again adds nothing under the duplicate-ignore rule.

Search for seven compares with eight, then three, then six, then reaches the absent right child of six. At every decision, the entire other subtree is impossible under the global ordering invariant. This justifies following one path rather than traversing all nodes. The number of comparisons depends on height, which the reference does not balance.

## C12-C: inherited bounds

A validator receives a node and an allowed open interval. Null is valid. A non-null node must have a value strictly greater than the lower bound and strictly less than the upper bound. Validate its left subtree using the current value as the new upper bound, and its right subtree using it as the new lower bound. The other bound remains inherited from ancestors.

For root ten, left child five, and five's right child twelve, the twelve node must satisfy both greater than five and less than ten. It fails the second condition. Immediate parent checks see only greater than five and miss the ancestor restriction. Use finite ordinary values for a simple numeric validator, or make boundary sentinels explicit if the domain includes infinities.

An in-order sequence being strictly increasing is another useful whole-tree property for valid finite tree structures. A bounds validator localizes the failing node and demonstrates inherited constraints directly. Neither checker should recurse forever on malformed cyclic object graphs; keep those outside the declared lab domain or add separate cycle validation.

## C12-D: shape and complexity

Inserting already sorted distinct values produces a one-sided chain in this unbalanced implementation. A search near the deepest end can inspect every node, giving linear worst-case work. A roughly balanced shape has logarithmic height and correspondingly shorter search paths. Equal sorted outputs do not imply equal costs.

Count comparisons for the same present and absent queries on two insertion orders. Record node count and observed height alongside the counts. Do not infer a universal asymptotic guarantee from one favorable shape. A self-balancing tree would require rotations or another balancing mechanism absent from this reference.

## Transfer review

A file-system size total resembles treeSum only if each child contributes once under the intended model. Symbolic links, shared storage blocks, and hard links can turn the apparent hierarchy into a graph or make physical usage differ from logical file sizes. A visited set keyed by identity changes the question to unique entities. Define the measurement before reusing the tree aggregation pattern. This is the same domain-first habit used earlier for cache identity and interval endpoints, now applied to structural recursion.
