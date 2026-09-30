# 6. Capstone: an offline document review engine

Build a small command-line program in your own workspace that accepts a base document, a local edit, and a remote edit, and produces a review report. Reuse the *contracts* of 3439, 3440, and 3441; do not pretend these functions already form a production sync service. The application can stay entirely local and dependency-free.

Your report contains the merged flat-string document, sorted conflicting keys, a deterministic JSON Pointer diff from base to merged value, and a separate audit stream of accepted report-generation events. Define whether a report event changes any numeric quota; if you use the account replay contract directly, document its nonnegative safe-integer balance and contiguous revision requirements. Avoid inventing an unexplained mapping from arbitrary document edits to money.

## Deliver in four checkpoints

**C1: Contract and fixtures.** Write three user stories: accept a remote-only edit, preserve a local deletion during conflict, and regenerate the same report after a repeated delivery. State accepted input types and expected errors. Include one hostile key and one empty-string value. Freeze or snapshot all input fixtures and verify that report construction does not alter them.

**C2: Pure implementation.** Separate parsing, domain decisions, and presentation. Parsing may reject malformed JSON, but a syntactically valid JSON array is still invalid as a flat-string document. Decide how you reject invalid domain inputs at your program's boundary instead of expanding 3439's contract silently. Keep pure functions callable without file access so tests can reproduce the decision independently of command-line plumbing.

**C3: Failure experiments.** Supply a replay with conflicting ID reuse, a missing revision, and a locally deleted key opposed by a remote edit. Assert the intended outcome for each. Mutate an operation's emitted nested value in a standalone 3441 test and confirm that the input remains unchanged. Make one intentionally wrong implementation in a scratch file, and demonstrate a failing assertion that the correct implementation passes.

**C4: Handoff.** Provide a one-command bounded check, a sample input and output, and a limits paragraph. Report reference checks separately from checks against your own implementation. Include a trace table for one conflict and a note explaining why a server would still need atomic persistence, verified identity, and an explicit concurrency policy. Do not advertise durable delivery guarantees for a program with only in-memory state.

## Rubric

| Dimension | 0 | 1 | 2 |
| --- | --- | --- | --- |
| Contract | Implicit assumptions | Happy-path shape | Types, deletion, errors and domain limits explicit |
| Correctness | Examples copied | Own cases pass | Independent edge cases reject plausible mutants |
| Ownership | Shared mutation unnoticed | Inputs checked once | Frozen/snapshotted inputs and alias tests |
| Evidence | Claims only | Command output | Reproduction, exact implementation mode, trace and counterexample |
| Transfer | Tutorial wording | Explains code | Changes a policy and predicts consequences |

Aim for at least eight of ten, with no zero in correctness or evidence. This is a learning rubric, not a professional qualification. A failed checkpoint is a useful map of what to practice next.

For a stretch, change conflict policy from local-wins to explicit unresolved markers. Before coding, state which output types, tests, and UI decisions change. This extension should make clear why preserving both sides is a new product contract rather than a one-line universal improvement.

End with a retrospective containing one assumption you disproved, one test that protected a neighboring behavior, and one boundary you would tackle next. Those three observations make the work sample more informative than a count of completed exercises.
