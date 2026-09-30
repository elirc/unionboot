# 13. Breadth-first search through an implicit word graph

Read [word ladder](../../33-word-ladder.js), section 33 of [SOLUTIONS.md](../../SOLUTIONS.md), and the exercise 33 assertions in [the original verifier](../../verify-original.cjs). The task returns the shortest number of words in a valid ladder, including both endpoints. This is a graph problem even though the input does not contain an explicit adjacency list. Words are vertices, and a permitted one-letter substitution defines an edge.

## Define what an edge means

For this chapter, use lowercase ASCII words of equal length, matching the reference's generated substitutions. Two distinct words are neighbors when they differ at exactly one position and the resulting candidate is allowed by the dictionary policy. A dictionary Set gives membership lookup and removes duplicate dictionary entries. It does not itself contain the graph's edges; those are generated during the search.

The reference constructs candidates by visiting every position and trying letters a through z. It tries 26 substitutions at each position, including the unchanged letter, but the seen check prevents re-enqueuing the current word. The effective nonself possibilities are at most 25 per position. This distinction matters when explaining the actual code rather than repeating a simplified description of the algorithm.

The reference also rejects immediately if end is absent from the dictionary. Its begin-equals-end sample includes that word in the dictionary and returns one. If begin equals end but the dictionary omits it, the reference's early guard returns zero. The starter does not explore that boundary fully. Record this as reference behavior and choose an explicit policy before extending the API, rather than presenting the sample as proof of every equal-endpoint case.

## Why FIFO produces shortest lengths

The initial queue entry is begin at level one because the result counts words, not edges. When a word at level k discovers an unseen neighbor, that neighbor is queued at level k plus one. A FIFO queue processes all previously queued level-k words before the newly appended next-level words. Therefore the first time a word is discovered, no shorter route to it remains unexplored.

Mark a word seen when enqueuing it, not only when removing it from the queue. Several words in one level may share a neighbor. If they all enqueue that neighbor before it is marked, the queue contains redundant work. Marking at discovery records that the shortest known level is already established. A visited set is not just a guard against cycles; its timing also controls duplicate frontier entries.

Depth-first traversal explores one path deeply before alternatives and does not have this shortest-level guarantee. It can find a valid ladder quickly yet miss a shorter one. A visited set alone does not convert DFS into BFS. The worklist ordering and the distance invariant must agree.

## Worked trace with converging branches

Use begin cold, end warm, and dictionary cord, card, ward, word, warm. Cold reaches cord at level two. Cord reaches card and word at level three. Card reaches ward at level four. Word also neighbors ward, but ward has already been discovered at that level and is not enqueued again. Ward reaches warm at level five. The shortest length is five words.

Both cold, cord, card, ward, warm and cold, cord, word, ward, warm are valid shortest ladders. The current function returns only the length, so it need not choose one path for output. If you extend it to return a path, store a predecessor when a word is first discovered. The selected path can depend on neighbor iteration order unless you add a deterministic tie policy. A single numeric result hides that additional choice.

The dictionary is not mutated by the reference because it builds a Set from the input list. A common alternative deletes discovered words from a working dictionary Set. That can also be correct if the Set is a private copy, but deleting entries from a caller-owned collection would change the ownership contract. Keep the algorithm's scratch state separate from the supplied input.

## An implicit graph still has costs

Suppose V dictionary words become reachable and each has length L. Generating candidates performs about 26L attempts per processed word. Constructing a candidate with string slices can require work proportional to L, so a careful explanation of this reference includes string construction cost rather than declaring every candidate constant time. Dictionary lookup is only one part of the operation.

The reference also uses array.shift for its queue. Chapter 11 introduced a head-index or two-stack queue to avoid repeatedly shifting a large array. Replacing the worklist representation in a scratch extension can improve queue overhead while preserving BFS order. Do not claim the existing implementation already has the ideal adjacency-list linear bound without accounting for these choices.

A pattern-index extension can group words by templates such as c?ld, replacing one position with a marker. Words sharing a pattern become candidate neighbors. That can reduce repeated dictionary scans, but it introduces preprocessing, bucket storage, and a policy for avoiding repeated bucket expansion. State the tradeoff and preserve equal-length and character-domain assumptions. Optimizing neighbor discovery is separate from proving shortest-path order.

## Laboratory: compare explicit and implicit graphs

Create a small dictionary of equal-length lowercase words. Build an explicit graph by comparing every pair and connecting pairs with exactly one differing position. This pairwise approach is slow for large dictionaries but clear for a bounded oracle. Include begin as a vertex even if it is not listed, while applying the chosen end-membership rule consistently. Run a straightforward level search on this explicit graph and compare lengths with your substitution-based implementation.

Use the worked converging-branches dictionary, an unreachable target that is present in a disconnected component, a target absent from the dictionary, a one-step ladder, and the equal-endpoint sample. Record which behaviors come from the written prompt, existing examples, and a chosen extension policy. These categories prevent a test suite from quietly redefining ambiguous boundaries.

Instrument enqueues in your scratch BFS. Every word should enter the queue at most once when marked at discovery. Temporarily move marking to dequeue time and use the converging-branches graph to observe repeated enqueues. Restore the correct implementation after the experiment. The final length may remain correct despite duplicate work, so the enqueue count is the observation that exposes this particular defect.

## Debugging case: counting edges instead of words

A learner initializes begin at distance zero and returns the distance when end is reached. For a one-letter transformation, the result is one, but exercise 33 asks for two words including begin and end. The traversal may be otherwise correct. Fix the public counting convention by initializing the word count at one or converting an edge distance at return, and explain which quantity each variable represents. Renaming a variable level does not resolve an unstated unit.

## Graded exercises

**C13-A:** Trace queue levels and discoveries for cold to warm. Five points require both converging branches and exactly one enqueue of ward.

**C13-B:** Build the explicit small-graph oracle and compare five boundary cases. Five points require matching dictionary policy and a distinction between words and edges.

**C13-C:** Implement predecessor reconstruction as a separate extension. Four points require a valid returned path, minimal length, and a documented tie policy or explicit allowance for any shortest path.

**C13-D:** Replace shift with a head-index worklist and count queue operations. Four points require unchanged answers and an explanation that neighbor-generation cost remains separate.

## Hints, before the review

For C13-A, discovery fixes the shortest level under FIFO processing. For C13-B, compare character positions directly rather than reuse substitution generation. For C13-C, assign the predecessor on first discovery. Read [the review](reviews/13-breadth-first-word-ladders.md) after drawing the graph and labeling every edge as one substitution.
