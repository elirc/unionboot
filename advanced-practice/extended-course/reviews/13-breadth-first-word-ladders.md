# Review 13. Breadth-first word ladders

Return to [the questions](../13-breadth-first-word-ladders.md). The shortest-path guarantee comes from the combination of unit-cost edges, FIFO processing, and discovery-time marking.

## C13-A: levels and convergence

Cold begins at level one. Cord is discovered at level two. Card and word are discovered at level three. Ward is discovered from whichever of those two is processed first at level four. The other branch sees ward already marked and does not enqueue it again. Warm is discovered at level five. There are five words and four substitutions in either shortest ladder.

FIFO processing ensures no level-four word is processed before all queued level-three words. When ward is first discovered, every possible shorter predecessor level has already had its opportunity to discover it. That is why its assigned level is minimal. A depth-first worklist does not provide that ordering guarantee.

## C13-B: explicit graph oracle

For a small set of equal-length words, compare every pair position by position and connect those differing exactly once. Add begin as a vertex if needed, and enforce the same end-membership policy as the candidate. A level search on this explicit graph provides a useful independent check of substitution-based neighbor generation.

The worked dictionary returns five. A direct one-letter transformation returns two words. An unreachable but present target returns zero after exploration, while the reference rejects an absent target before exploration. Equal begin and end with that word present returns one. The reference returns zero when it is absent because its guard runs first; if your extension chooses a different equal-endpoint rule, label and test that change explicitly.

Duplicate dictionary strings should not create duplicate semantic vertices. A Set handles that in the reference. Uppercase, variable-length, or broader Unicode transformations require a new neighbor definition; the lowercase substitution loop does not establish those behaviors. The oracle should not quietly accept a broader domain than the candidate and call every disagreement an algorithm defect.

## C13-C: predecessor reconstruction

When discovering an unseen neighbor, store its predecessor as the current word and its distance as current distance plus one. On reaching end, walk predecessor links backward until begin, then reverse that collected list. Assigning predecessors only on first discovery preserves the BFS shortest path. Replacing them on later encounters can create a different or invalid reconstruction if done without a consistent distance rule.

The path checker should verify its first and last words, dictionary membership for required words, one-character differences between neighbors, and length equal to the independently computed minimum. If any shortest path is acceptable, compare these properties rather than requiring one arbitrarily chosen branch. If deterministic path selection is required, specify neighbor ordering and test it.

A predecessor table stores one path, not every shortest path. Returning all shortest ladders requires retaining multiple eligible predecessors and can produce much more output. Do not infer that richer capability from a single-parent table.

## C13-D: worklist replacement

Use an array with a head index. Enqueue by pushing. Dequeue by reading queue at head and incrementing head while head is smaller than queue length. This preserves FIFO order without shifting the remaining array on every removal. A long-running reusable queue may need to clear consumed entries or compact storage, but a bounded search can discard the entire worklist after completion.

Count enqueues and dequeues separately from candidate generation. With discovery-time marking, each reachable word is enqueued at most once. The reference still constructs many candidate strings for every processed word, so reducing queue overhead does not remove neighbor-generation cost. A complete performance discussion names both components.

## Transfer review

If substitutions have unequal costs, the first discovered path need not be cheapest. FIFO explores by edge count, not total weight. A weighted shortest-path algorithm requires a different frontier priority and relaxation rule. This is a useful boundary test for your understanding: changing the edge cost model changes the proof, even if the word-generation function stays identical. Do not advertise BFS as a universal shortest-route solver without its unit-cost assumption.
