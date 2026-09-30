# Final review 24. A reproducible change-review work sample

Return to [the assignment](../24-offline-change-review-capstone.md). This guide describes a sufficient architecture and evidence package, not a finished learner implementation to copy into the repository.

## C24-A: domain boundaries

The wrapper case ID labels a report. Base, local, and remote must be flat records of strings. The ledger opening balance and events must satisfy capstone 3440's integer, identity, and revision rules. The diff accepts JSON values, but that broader domain does not make nested objects valid merge values. Validate these boundaries separately.

An own __proto__ string key is legal merge data and must survive safe handling. A nested object belongs in a separate diff ownership fixture, not in the flat merge fixture. A conflicting event ID and a revision gap are different invalidities. A contract sheet that merely says valid JSON misses all of these distinctions.

## C24-B: pure analysis

A sufficient analysis function receives already validated case data, computes merge, replays the ledger, and computes diff from base to merged value. It returns a new report containing those results and the case ID. It does not update input objects or write source files. Keep parsing and presentation outside this function so tests can call it directly.

For the worked case, merged value is title local, conflicts are note then title, and diff is remove /note followed by replace /title with local. The ledger result is balance twelve, revision two, applied a,b. No field implies that document conflicts are ledger revisions. The domains remain separate even though one report contains both.

Mutation tests should reject changing local-wins to base-wins and removing the intermediate-balance check. Import your implementation explicitly. Passing the repository reference suites establishes that those references satisfy their assertions; it does not prove your workbench calls the right code or assembles the report correctly.

## C24-C: orchestration policy

For complete batch reporting, analyze each independent case into a fulfilled or rejected record and retain input order. A concurrency pool limits unfinished workers, while each case's pure analysis remains deterministic. Attach rejection handlers immediately and demonstrate that already-started late failures are observed. Document whether parsing failures and domain failures use the same report shape or distinct categories.

A synchronous single-case tool is an acceptable bounded scope if it meets the assignment's chosen contract and reports that limit clearly. Do not add concurrency solely to display a technique. When concurrency is included, controlled deferred tests should prove its behavior rather than a timing-dependent network demonstration.

## C24-D: handoff and rubric

Include generated fixtures, implementation and assertion paths, exact commands, exit codes, expected and actual report excerpts, and input-preservation evidence. Score each milestone against its five-point criteria. At least sixteen total points can indicate readiness for another practice stage, but the listed critical failures still require repair regardless of presentation quality.

A delayed reconstruction exercise might ask you to explain why note is omitted despite remote revising it, why the ledger batch with a negative intermediate state rejects, or why a remove operation lacks a value property. Answer without opening the solution, then change one input and predict the new output. This checks transfer more directly than rerunning memorized commands.

## Scope that remains outside this work sample

The workbench does not provide authentication, durable receipts, concurrent server writes, or automatic conflict approval. Its file-output policy should avoid overwriting source cases, but that is not a database transaction guarantee. Manual conflict resolution and incremental persistent ledgers each need new contracts before implementation. A candid limits paragraph is part of the deliverable because it tells the next reviewer exactly what the evidence supports.

The course is complete when the instructional units are read and available; your independent mastery requires your own implementations and evidence. Preserve that distinction in any portfolio description. The strongest claim is specific: which contracts you implemented, which adversarial cases you rejected, and which boundaries remain untested.
