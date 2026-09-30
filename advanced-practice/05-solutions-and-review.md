# 5. Solutions and review guide

Open this chapter after preserving your attempt. It provides decision rules and expected outcomes, not a replacement answer file. Compare explanations before comparing syntax: a different implementation can be correct if it preserves the same contract.

## Placement review

P1 should distinguish three mechanisms. `??` preserves empty strings; OR does not. `Object.hasOwn` rejects inherited `toString`; `in` sees it. An own `__proto__` data property can be constructed with parsed JSON or `Object.fromEntries`. P2 needs a case that observes the original object after the call. Freezing a shallow wrapper alone does not establish deep immutability. P3 rejects conflicting ID reuse and rejects an intermediate negative balance even if later credit would repair it. P4 distinguishes root `''` from empty-key path `'/'` and requires cloned emitted values.

Use the four-point scores as route selection, not certification. Correct outputs with no explanation usually deserve half credit. An initially incorrect answer followed by a discriminating experiment and accurate correction is stronger evidence than a lucky correct guess.

## Exercise checkpoints

**E1:** An unchanged side yields to an edited side, even when the edit is deletion. Equal deletions agree and emit nothing. A deletion opposed by a changed string is a conflict, and local wins, which may mean no emitted key. The conflict name still remains in the conflict list. The stored string `'absent'` has no special status.

**E2:** Your oracle can represent each input as `{present, value}` and compare presence before comparing strings. This differs structurally from the symbol reader and reduces the risk of reproducing the same bug in both implementations. First compare local and remote, then local and base, then remote and base. Add a fourth state to obtain 64 triples. Report the finite domain honestly and retain prototype-specific tests outside the enumerator.

**E3:** Validate every event's shape before deduplication. An already-seen ID does not authorize ignoring a malformed replay. Matching ID, revision, and delta makes a retry equivalent; disagreement makes it a conflicting operation. A Map is useful for identity, while revision ordering is a separate concern. A single data structure does not automatically provide both invariants.

**E4:** Starting at zero, debit one and then credit one: the final total is zero but the first valid revision would overdraw. That sequence must reject. Starting at the maximum safe integer and applying a positive delta must also reject. These examples exercise different requirements and should remain separate assertions so a failure names the broken assumption.

**E5:** Escape tilde before slash. A key `a/b` becomes segment `a~1b`; an existing tilde in a key becomes `~0`. Arrays are atomic in this exercise, so a changed array generates a replacement rather than per-index operations. Object key insertion order is irrelevant to equality. Output values must be detached from both input trees.

**E6:** A passing reference proves the reference against selected assertions. A passing learner starter proves that implementation against the same bounded examples. Neither establishes a real multi-user synchronization protocol. Such a system also needs identity, storage, authorization, conflict UX, and retry semantics that the pure exercise does not implement.

## Review without erasing the learning

Keep your original prediction beside the correction. Add the smallest new case that would have changed your mind earlier. Do not replace an entire learner file with the reference and label that a repair. Instead identify the mistaken assumption, change the narrowest implementation boundary, rerun relevant cases, and explain which previously working behavior remained protected.

After a delay, use a new key name and change the order of inputs. If the reasoning only works for the tutorial's exact names, return to the trace stage. Review is complete when you can defend the invariant and its limitations to someone who has not read this guide.
