# Review 03. Counting and grouping

Return to [the questions](../03-counting-and-grouping.md). A complete answer connects the chosen representation to the information the result requires.

## C03-A: three representations

A set answers membership and distinct cardinality. It cannot distinguish aab from abb because both contain the same distinct letters. A frequency table answers multiplicity and supports count differences, but a plain mapping from character to count does not encode every original position. Grouped arrays retain the actual members, including repeated members and their encounter order, at greater storage cost than counts. If the question only needs frequencies, keeping every record may be unnecessary; if it needs the records themselves, replacing groups with counts loses essential information.

Be careful with the phrase order does not matter. It may be true for comparing anagram multiplicities, false for locating the first unique character, and only partly true for grouping: the order of group labels may be unspecified while order within each group remains meaningful. Name the level of ordering you are discussing.

## C03-B: first unique

Count every character in the working indexing domain. Then scan positions from left to right and return the first position whose character count is one. Return negative one after the scan if none qualifies. For cabac, b is at position two and is the only singleton. For reappearx, x is the first singleton at position eight. Empty input has no candidate and returns negative one.

Two properties characterize an accepted index: the selected character occurs exactly once, and every earlier character occurs more than once. A third property checks the negative-one result: every character must have a count other than one. These properties make a useful independent checker for small inputs. They do not require copying the candidate algorithm's internal map, which reduces the chance of reproducing the same implementation bug in the checker.

## C03-C: safe grouping

Evaluate keyFn once per member and store the result. Use an internal Map from string labels to arrays, or an explicitly owned output-property strategy. Append each member to its chosen array in input order. If using a Map internally, converting entries with Object.fromEntries produces ordinary own data properties, including labels that would be hazardous under naive assignment. Match the expected output object shape rather than returning the internal Map without a documented API change.

The callback counter should equal the number of input members under your additional single-evaluation contract. Snapshot comparisons should show no changes to the source array or records. The returned arrays may share the original record references because grouping does not inherently promise deep cloning. A test that mutates a grouped record and then complains about shared identity would be imposing a new ownership policy, not checking the stated examples.

## C03-D: reconciliation

Count labels in each inventory, take the union of labels, and compute after count minus before count for each. Emit only nonzero differences if that is the chosen report contract. For before containing pen, pen, cup and after containing pen, cup, cup, the changes are pen negative one and cup positive one. A set comparison would report no changes and therefore fails the application.

Choose a deterministic output ordering, such as code-unit label order, and include it in tests. If labels are case-sensitive, Pen and pen remain different. If normalization is required, perform it consistently before counting and document what distinctions are intentionally erased. Do not copy the anagram exercise's case policy into an inventory system without a product requirement.

## Follow-up challenge

Suppose a grouped report must retain the first encountered spelling of each case-insensitive label. A normalized count alone cannot reconstruct that spelling. Design the accumulator to preserve both the normalized key and the first original label. This is a small example of deriving state from the eventual output rather than adding bookkeeping at random.
