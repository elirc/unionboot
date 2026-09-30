# Review 21. Three-way merge decisions

Return to [the questions](../21-three-way-merge-as-a-decision-system.md). Classify change relative to base before deciding whether disagreement is a conflict.

## C21-A: the complete worked result

Title differs on both sides from old and the sides differ from each other, so it conflicts and selects local. Color remains blue locally while remote changes it to green, so remote wins without conflict. Note is absent locally and revised remotely, while base had keep; both changed differently, so it conflicts and local absence wins. Archived remains yes locally while remote deletes it, so remote deletion wins without conflict.

The merged record contains color green and title local. Conflicts are note then title in sorted order. Note and archived are omitted, not assigned a marker. Independent remote color survives despite conflicts elsewhere. A document-wide fallback to local would be incorrect because the contract decides each key separately.

## C21-B: identities and asymmetry

Identical local and remote records yield that shared content without conflicts. Local equal to base yields remote. Remote equal to base yields local. These properties include missing keys because absence is compared as a distinct state. A correct reader must therefore preserve ownership information before value comparison.

Swapping sides preserves the conflict classification but changes selected values on conflicting keys. For base red, local blue, remote green, the original call keeps blue and the swapped call keeps green. Demanding full commutativity would contradict local-wins. This is an example of deriving properties from a contract rather than selecting familiar algebraic laws at random.

## C21-C: implementation and composition

Take the sorted union of own enumerable keys. For each key, read base, local, and remote with an unambiguous missing representation. Apply agreement, local-unchanged, remote-unchanged, and conflict branches in that order. Append a selected string as an output entry, omit selected missing, and collect conflict names. Construct the output with a method that defines own data keys safely, such as Object.fromEntries.

A multi-key oracle can solve each key with a small independently written decision table, then combine selected entries and sort conflict names. Renaming a key to an own constructor or __proto__ property must not change its decision. Assert output ownership directly; ordinary property lookup can conceal inherited behavior or unsafe assignment.

## C21-D: manual review data

Represent each side of a conflict with a tagged presence record, such as present false or present true with a string value. That distinguishes deletion from an empty string and from any display marker. Preserve all three versions so a reviewer can understand which edits diverged. A manual resolution can then choose a side or a new string under a separately specified workflow.

Do not silently replace the baseline solver's local-wins result with unresolved placeholders. The extension can retain the baseline result as a proposed resolution while exposing richer review information. If manual decisions change the final document, recompute its diff from the chosen baseline and keep the decision record separate from stored document values.

## Transfer review

Nested JSON merge is not obtained simply by recursing this flat-string function. Arrays, type changes, object deletion, and nested conflict paths need policies. The current proof relies on independent flat keys with string values. Treat a nested merge as a new problem, using the existing decision table as one component rather than claiming the capstone already supports arbitrary collaborative documents.
