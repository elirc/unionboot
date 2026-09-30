# 21. Three-way merge as a decision system

Read [capstone 3439's prompt](../../js-capstones/prompts/3439.txt), [its tests](../../js-capstones/tests/3439.cjs), and [its reference](../../js-capstones/solutions/3439.cjs). Earlier chapters established presence and safe keys. This chapter focuses on the complete decision system: how a common ancestor distinguishes independent edits, which properties can be proved per key, and why local-wins conflict resolution is intentionally asymmetric.

## The base explains intent that two snapshots cannot

Local and remote snapshots alone show disagreement but not which side changed. Suppose local says blue and remote says green. If base says blue, only remote changed and green should win. If base says green, only local changed and blue should win. If base says red, both changed differently and the contract records a conflict, keeping local blue. The same two visible snapshots can require different classifications depending on their ancestor.

For each key, represent missing as a distinct state. Compare local and remote first; agreement is accepted even if both differ from base. Otherwise, if local equals base, accept remote. Otherwise, if remote equals base, accept local. Only after all three comparisons fail is there a conflict, resolved by selecting local, including local absence. A conflict is a classification plus a selection policy; it is not necessarily an exception.

The selected missing state means omit the key from output. It does not mean store a marker, null, or undefined. The output remains a flat record of strings. This distinction becomes visible when diffing the result later: omission is a deletion, while an empty string is a stored value.

## Worked trace across independent keys

Let base contain title old, color blue, note keep, and archived yes. Local changes title to local, leaves color blue, deletes note, and leaves archived yes. Remote changes title to remote, changes color to green, changes note to revised, and deletes archived.

Title has two different edits, so record a title conflict and keep local. Color has an unchanged local side, so take remote green without conflict. Note is local deletion against a remote edit; record a note conflict and omit note because local wins even when local means missing. Archived is unchanged locally and deleted remotely, so omit it without conflict. The result contains color green and title local, with conflicts note and title in lexicographic order.

The decisions are independent by key under this flat-string contract. No key's chosen value should influence another key's conflict classification. A global flag saying any conflict means keep the entire local document would lose the accepted remote color change. A conflict does not cancel every independent nonconflicting edit.

## Properties that follow from the rules

If local and remote are identical, their shared document is the result and conflicts are empty. If local equals base, remote is the result without conflicts. If remote equals base, local is the result without conflicts. These are useful whole-document properties derived from the per-key cases, including deletions.

Swapping local and remote preserves which keys are classified as conflicts but can change their selected values because the tie policy favors local. Therefore full result commutativity is not a valid property. A test that demands merge(base, local, remote) equal merge(base, remote, local) would reject the intended policy on conflicts. Know which algebraic properties the contract actually supports.

Changing key insertion order should not change the content or sorted conflict list. The reference gathers the union of own enumerable keys and sorts it. Hostile-looking own data keys must remain ordinary data, but inherited properties do not become candidate keys. Safe output construction is necessary as well as safe reading.

## Laboratory: independent checks at two scales

Use a one-key state table with missing, empty string, old, and new as possible states. Derive the expected branch and selected state for every triple. The existing boundary lab already exercises this idea; extend your independent work by checking multi-key composition rather than merely copying that lab. Combine two individually solved keys and verify the merged document contains exactly their independently selected outputs and the sorted union of their conflict names.

Add metamorphic checks for the three no-conflict identities above. Rename a normal key to constructor or an own __proto__ key created through JSON parsing, preserving the value states. The decision should remain the same under that renaming, and the output must own the selected key. Do not mutate shared prototypes to create a test fixture.

Freeze the inputs and inspect their key sets afterward. Test the worked multi-key example with different property insertion orders. Include both empty-string values and the literal absent so the old string-sentinel bug cannot return unnoticed. Assertions should call your independent solver, while reference checks remain a separate evidence category.

## Debugging case: the conflict policy is repaired into data loss

A reviewer dislikes deletion and changes the conflict branch to keep base whenever local is missing. In the note example, the old keep value reappears. That may look cautious, but it violates the published local-wins policy and resurrects data the local user deleted. A product can choose a different policy, but it must change the contract and its tests explicitly. Algorithms should not invent a new conflict policy in a branch that merely feels dangerous.

A second mistaken repair throws on the first conflict. The required result includes a complete merged record and every sorted conflict name. Early throwing loses the rest of the report. Distinguish rejected invalid inputs from valid conflicting edits; this capstone assumes valid flat records and reports conflicts as output.

## Graded exercises

**C21-A:** Trace every key in the worked example and identify the exact branch taken. Five points require local deletion to survive a conflict and independent remote color to survive elsewhere.

**C21-B:** Test the three no-conflict identities and the asymmetric conflict result. Five points require rejecting an invalid commutativity assertion.

**C21-C:** Build multi-key composition and safe-key renaming checks. Five points require own-property verification and unchanged inputs.

**C21-D:** Propose a manual-resolution extension preserving base, local, and remote values for each conflict. Four points require distinguishing missing from an empty string in the review data and keeping the baseline solver's contract intact.

## Hints, before the review

For C21-B, classification symmetry does not imply selection symmetry. For C21-C, merging per-key oracle results is simpler than duplicating the implementation's loop. For C21-D, a tagged presence record is clearer than a colliding display string. Read [the review](reviews/21-three-way-merge-as-a-decision-system.md) after recording your branch table.
