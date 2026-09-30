# 24. Capstone: an offline change-review workbench

This final assignment combines [flat-document merge](../../js-capstones/prompts/3439.txt), [ordered event replay](../../js-capstones/prompts/3440.txt), and [JSON diff](../../js-capstones/prompts/3441.txt) with the asynchronous and validation reasoning developed earlier. Build an independent local workbench in your own scratch workspace. Do not overwrite numbered starters, reference solutions, or existing learner answers. The deliverable is a reproducible work sample, not a claim that a distributed collaboration service has been implemented.

## Product contract and deliberate limits

A case contains a case ID, base/local/remote flat-string records, an opening nonnegative safe-integer balance, and a batch of account events. These are two separate domains packaged into one review case. Document edits do not automatically create ledger events, and a ledger revision is not a document revision. The workbench analyzes both inputs and produces a structured report without writing back to any source case.

For valid input, report the merged document, sorted conflict names, the diff from base to the merged document, and the event replay result. Include the case ID and a clear indication that conflicts are review findings, not malformed-input failures. An invalid event stream prevents a successful report for that case; it must not be quietly replaced with an empty ledger. Decide whether a batch runner reports invalid cases independently or stops its whole batch, and document the choice.

Use JSON files with generated data for input and stdout or a separately named output file for reports. If writing reports, never overwrite the input path and define how an existing output is handled. A no-write analysis mode is a useful default for the lab. The course does not require building a browser interface, installing dependencies, or connecting real accounts.

## Architecture with reviewable boundaries

Separate parsing, domain validation, pure analysis, batch scheduling, and presentation. Parsing establishes syntactically valid JSON; it does not establish that a document is a flat string record or that revisions are valid. Domain validation should reject unsupported shapes before invoking algorithms that assume their domains. Preserve own data keys safely when creating any normalized representation.

Pure analysis calls your independently implemented merge and replay functions, then computes the diff from base to the selected merged result. Keep the original snapshots available for conflict inspection. A rendering layer can label missing values explicitly in review details, but it must not insert those display markers into the merged document itself.

If analyzing several independent cases, a mapLimit-style scheduler can bound concurrent file reads or analysis jobs while retaining input order. For a complete batch report, settle each case into a success or failure record. This is a chosen reporting policy, not an assertion that partial external effects are transactional. Your analysis should have no external domain side effects in the first place.

## Worked acceptance case

Use base with title old and note keep. Local changes title to local and deletes note. Remote changes title to remote and note to revised. Merge yields title local, omits note, and lists note then title as conflicts. The diff from base to that merged result contains remove at /note and replace at /title with local, in sorted key traversal order.

Use opening balance ten with delivery b at revision two and delta negative three, then a at revision one and delta five, followed by an exact repeat of a. Replay yields balance twelve, revision two, applied a then b. The combined report must not interpret two document conflicts as two ledger events or substitute the ledger revision for a document version. The wrapper connects reports, not domain identities.

For a second case, make the event stream dip below zero before recovering. The case should be marked invalid under your batch policy, with its original inputs unchanged. If another independent case succeeds, a complete-report runner may include both outcomes. A fail-fast runner may reject the batch, but it must not claim that already-started tasks were cancelled unless it actually implements and tests cancellation.

## Evidence milestones and grading

**C24-A, five points:** Submit a contract sheet and schema examples before implementation. Include valid data, a nonstring document value, a conflicting event ID, a revision gap, an own __proto__ string key, and a nested JSON value used in a separate diff fixture. Full credit requires distinguishing each algorithm's accepted domain rather than applying one broad JSON rule to all three.

**C24-B, five points:** Deliver independent pure implementations and the worked acceptance report. Tests must import your files. Include a deliberate mutation that changes the merge conflict policy and another that checks only final ledger balance; show both being rejected. Full credit requires direct expected results as well as any reference comparisons.

**C24-C, five points:** Add batch orchestration with controlled deferred failures or explain why a synchronous single-case tool is your bounded scope. For a concurrent batch, prove the limit, input-order reporting, and late-failure handling. For a synchronous tool, provide equivalent success/failure sequencing evidence without pretending concurrency was implemented.

**C24-D, five points:** Produce a handoff containing exact commands, implementation paths, generated fixtures, observed outputs, limitations, and one delayed reconstruction exercise performed without the review guide. Full credit requires verifying input preservation and distinguishing reference-suite passes from independent implementation passes.

Sixteen of twenty points is a useful learning threshold, but missing critical correctness evidence cannot be compensated by polished prose. A workbench that mutates source cases, loses own data keys, accepts an intermediate negative balance, or aliases nested diff values needs repair before being presented as complete. Record unperformed checks honestly.

## Laboratory and failure review

Build a small fixture directory in your own workspace, with one valid case and one case per rejection category. Hash or snapshot inputs before analysis and compare afterward. Use exact assertions on report fields, including absent value on remove operations. Re-run a valid case and compare deterministic output while excluding any deliberately nondeterministic presentation metadata such as run timestamps.

Then change one assumption: allow manual resolution of document conflicts, or allow incremental ledger batches beginning after a stored revision. Write the new contract and identify which existing algorithm boundary must change. Do not implement both extensions merely to enlarge the project. A careful change-impact explanation is more useful than a half-working expansion.

## Hints, before the review

Keep the workbench report as a composition of already-defined domain results. A case ID identifies the wrapper input; it does not establish authenticated ownership. A safe output file is not durable idempotency. Start with the worked acceptance case and add one failure boundary at a time. Read [the final review](reviews/24-offline-change-review-capstone.md) only after producing your own architecture sketch and first failing test.
