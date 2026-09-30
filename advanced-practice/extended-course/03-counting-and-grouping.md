# 03. Counting, grouping, and preserving the right information

Read [word counts](../../04-word-count.js), [first unique character](../../13-first-unique-char.js), [anagrams](../../16-anagram.js), and [groupBy](../../25-group-by.js). These exercises look similar because they build lookup structures. Their outputs preserve different information. A frequency table preserves multiplicity, a group preserves members and their order, and a first-unique answer preserves a position in the original sequence. Choosing a data structure is a decision about which information can safely be discarded.

## A count is not a set

The strings aab and abb contain the same set of letters but different multiplicities. Exercise 16 correctly expects them not to be anagrams. A Set can establish which distinct letters occur, but it cannot establish how many times they occur. If you compress the input to a set before answering the anagram question, the lost information cannot be reconstructed afterward.

A frequency table can answer whether two normalized strings have the same multiplicity for every letter. It cannot by itself tell you which unique character occurred first unless the structure preserves enough ordering information. Exercise 13 returns an index. A reliable simple approach counts occurrences, then scans the original string in order to find the first count of one. The second scan is not wasteful duplication: it uses the original order that the count operation intentionally ignored.

Exercise 25 preserves every member within a group. The examples show odd numbers in their encounter order and words under their first letter in encounter order. Sorting each group would introduce a new policy. A key function can inspect a record and choose a grouping label; it should not be called additional times merely because a concise expression repeats it. If the callback has a counter, repeated evaluation becomes observable. Even for a pure callback, computing once makes the algorithm easier to reason about.

## Worked trace: counting before selecting

Consider the string reappear. Its characters, in order, are r, e, a, p, p, e, a, r. Every character appears twice, so the result is negative one. Now append x at the end. The first eight positions still have counts of two, and the final x has count one. The correct index is eight. A function that returns as soon as it first encounters a currently unseen character would return zero, because it has not yet observed the second r. Uniqueness is a statement about the complete input, not about the prefix seen so far.

For a different example, use cabac. Counts are c two, a two, b one. The second pass reaches c and rejects it, reaches a and rejects it, then accepts b at index two. The order in which keys happen to be enumerated from an object is not the proof. The original string supplies the position order directly.

Keep these exercises to their demonstrated simple character domain while learning the algorithm. JavaScript strings have code-unit indexing, and iteration forms can treat supplementary characters differently. A production requirement for user-perceived characters needs a separately specified segmentation and indexing policy. Do not claim that passing ASCII examples establishes that policy. You can explore Unicode later without obscuring the counting invariant now.

## Object keys need ownership discipline

The original verifier includes constructor as an input word and as a grouping key. An ordinary object inherits a constructor property. A naive expression that reads counts[word] and assumes any existing value is a numeric count can encounter that inherited function. A truthiness fallback is therefore not a safe substitute for an ownership test. The same problem occurs when a grouping implementation expects groups[key] to be an array.

One approach is to use a Map internally and construct the required plain-object result safely. Another is to check own properties explicitly and define output properties in a way that preserves arbitrary labels. A null-prototype object avoids inherited lookups, but it is not automatically equivalent to the ordinary object expected by a strict deep-equality assertion. Representation choices must respect both data semantics and the output shape actually required by the task.

The starter's examples do not establish behavior for every possible key returned by keyFn. For this chapter, use string labels and include inherited-name adversaries. If you want object-identity grouping, specify a Map-returning extension rather than coercing arbitrary objects into strings and calling the result identity-safe. Exercise 27 will give object identity a different, explicit role.

## Laboratory: a small information-loss audit

Build an anagram checker twice in a scratch file: once with sets and once with counts. Use listen and silent as a positive case, then aab and abb as the counterexample. Record why the positive case does not distinguish the algorithms. Add a case where one string contains an extra repeated letter, and a case using the prompt's case-and-space normalization.

Next, build a first-unique implementation that counts first. For every output index, assert both that the selected character occurs once and that no earlier character occurs once. These two properties jointly express first unique. Checking only uniqueness permits a later unique character to pass. Checking only an index copied from a reference makes it harder to understand why the result is right.

For grouping, use records with an explicit sequence field. Group by team and assert that each group's sequence values appear in the same relative order as the input. Include two groups, one empty input, and constructor as a label. Snapshot the input array and record objects before the call. Your grouping should allocate group arrays without mutating source records.

## Debugging case: normalization expands the promise

A learner removes every nonletter before checking anagrams because that is a familiar palindrome technique. Exercise 16 says to ignore case and spaces. Removing punctuation silently makes a broader equivalence relation: a-b and ab can become equal under the learner's policy even though punctuation removal was never requested. More aggressive normalization is not automatically more correct. Write the exact normalization pipeline in the contract, then test that pipeline. Keep an optional punctuation-insensitive variant under a distinct function name.

## Graded exercises

**C03-A:** Explain which information a Set, a count table, and grouped arrays preserve. Give one question each representation can answer and one it cannot answer alone. Six points require concrete counterexamples rather than general labels such as efficient or flexible.

**C03-B:** Implement and test first unique with the two properties above. Five points require an all-repeated case, an early unique case, a late unique case, empty input, and the correct original index.

**C03-C:** Write groupBy tests with constructor and a callback-call counter. Five points require safe labels, encounter order, no source mutation, and one callback evaluation per member in your chosen implementation contract.

**C03-D:** Design a count reconciliation report between two inventories. Return labels whose counts differ and their signed differences. Four points require retaining multiplicity and specifying output ordering. This is a transfer exercise, not an existing repository function.

## Hints, before the review

For C03-B, separate complete frequency knowledge from position selection. For C03-C, distinguish an inherited property from an owned group even when both reads return something truthy. For C03-D, take the union of labels and treat an absent count as zero only because that meaning belongs to this inventory contract. Read [the review](reviews/03-counting-and-grouping.md) after writing your own reconciliation example.
