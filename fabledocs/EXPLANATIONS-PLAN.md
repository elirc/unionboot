# unionboot — explanations rewrite: plan and status ledger

Started 2026-09-21. Planner/reviewer: Claude Fable 5.1. Writers: Claude Opus agents, one slice each, following `EXPLANATIONS-SPEC.md`. Baseline: git `61b97493` in this folder (all 18 reference gates were green in `verification-report.json` on 2026-09-17).

## Scope as found

| Track | Exercises | Families | Solutions today | Explanations today | Single-ID verify | Rewrite solutions? |
| --- | --- | --- | --- | --- | --- | --- |
| Root originals 01–83 | 83 | ad hoc | readable (01–65), minified fixture (66–83) | `SOLUTIONS.md` 01–33 + 7 design notes | seconds (3 root verifiers, no `--id`) | No — extend `SOLUTIONS.md` |
| `js/batch-084-103` | 20 | 20 | mostly readable | one Hint line each | ~3 s full | Yes |
| `js-rest` | 80 | 20 × 4 | minified | none | ~5 s full | Yes |
| `mixed-data` | 135 (70 JS + 65 TS) | 1 × 135 | minified | none | 20–60 s (tsc gate every run) | Yes, batched |
| `js-more` | 250 | 25 × 10 | readable | none (rich prompts) | seconds per ID | Light touch |
| `js-capstones` | 3 | 3 | compact | none | <1 s | Yes |
| `ts` | 100 | 20 × 5 | minified | none | ~1 min (tsc gate every run) | Yes, per family |
| `ts-more` | 420 | 28 × 15 | readable | none | cheap | Light touch |
| `ts-final` | 165 | 11 × 15 | readable | none | cheap | Light touch |
| `ts-next` | 750 | 50 × 15 | minified bodies | none | cheap (writes reports) | Yes |
| `react` | 100 | 20 × 5 | minified | none | ~34 s | **No — hash-locked by react-more** |
| `mixed-react` | 65 | 13 × 5 | minified (re-skin of react) | none | ~30 s | **No — hash-locked by react-more** |
| `react-more` | 200 | 20 × 10 | minified | none | ~29 s; full track cheaper | Yes, verify per batch |
| `react-junior` | 50 | 50 (6 categories) | minified | none | ~28 s | Yes, verify per batch |
| `react-300` | 300 | 30 × 10 | minified | none | ~41 s | Yes, verify per batch |
| `react-next` | 720 | 36 × 20 | minified + helper components | none | ~24 s | Yes, verify per batch |
| `sql-200` | 200 | 20 × 10 | one terse line | none (good GUIDE) | <1 s | Yes |
| `sql-more` | 200 | 20 × 10 | one terse line | none | <1 s | Yes |
| `dotnet-web-300` | 300 | 30 × 10 | dense one-liners | none | ~35 s (whole set compiles) | Yes, per family, carefully |
| `dotnet-web-more` | 300 | 30 × 10 | dense one-liners | none | ~35 s | Yes; W341–W350 fail at baseline |
| `CSHARP-583.cs` | 583 | 53 × 11 | one line, no comments | one Hint per family | tens of s (whole file) | **No — docs only** |
| `CSHARP-MORE-583.cs` | 583 | 53 × 11 | same | same | tens of s | **No — docs only** |
| `fullstack-questions` | 520 Q&A | 52 × 10 | n/a | answers are prose | <1 s | Improve answers + mirror .txt |

Total: ~5,600 exercises, ~620 families.

## Deliverables

1. `<track>/explanations/NN-<family>.md` per family + `explanations/README.md` per track (spec §2).
2. Readable in-place solutions with a "Why this works" block, where the track allows it (spec §3, §3.1).
3. `GUIDE.txt` "how to use" block per track (spec §4); `START-HERE.txt` and root `README.md` index updates.
4. `SOLUTIONS.md` extended to 01–83 with explanations and worked traces.
5. `CSHARP-EXPLANATIONS.md`, `CSHARP-MORE-EXPLANATIONS.md`.
6. Final: every verifier that was green at baseline is green again; a closing report in this folder.

## Status ledger

Legend: ☐ not started · ◐ writing · ◑ written, awaiting review · ☑ reviewed and accepted · ✗ reverted

| Slice | Writer | Status | Verifier result | Review notes |
| --- | --- | --- | --- | --- |
| Root originals 01–83 (`SOLUTIONS.md`, `README.md`) | Opus #1 | ◐ | — | pilot; planner spot-check 2026-09-21: 83 sections, one js fence each in 01–33, LF; §17 and §62 read well, §62 code identical to `round2-remaining.cjs` |
| `js-rest` 104–183 | Opus #2 | ◐ | — | pilot; planner spot-check: 80 solutions rewritten (106, 120 read well, error message matches test); doc `01-index-records.md` matches spec §2 — format APPROVED for scale-up. Typo "comments the ids" → "compares" |
| `js/batch-084-103` + `js-capstones` | — | ☐ | — | |
| `js-more` 1719–1968 (2 slices) | — | ☐ | — | |
| `mixed-data` 384–518 | — | ☐ | — | |
| `ts` 184–283 | — | ☐ | — | |
| `ts-more` 784–1203 (3 slices) | — | ☐ | — | |
| `ts-final` 1204–1368 | — | ☐ | — | |
| `ts-next` 1969–2718 (5 slices) | — | ☐ | — | |
| `react-junior` 1369–1418 | — | ☐ | — | |
| `react` + `mixed-react` (docs only) | — | ☐ | — | |
| `react-more` 584–783 (2 slices) | — | ☐ | — | |
| `react-300` 1419–1718 (2 slices) | — | ☐ | — | |
| `react-next` 2719–3438 (5 slices) | — | ☐ | — | |
| `sql-200` Q001–Q200 (2 slices) | — | ☐ | — | |
| `sql-more` Q201–Q400 (2 slices) | — | ☐ | — | |
| `dotnet-web-300` W001–W300 (3 slices) | — | ☐ | — | |
| `dotnet-web-more` W301–W600 (3 slices) | — | ☐ | — | |
| `CSHARP-583.cs` docs (4 slices) | — | ☐ | — | |
| `CSHARP-MORE-583.cs` docs (4 slices) | — | ☐ | — | |
| `fullstack-questions` (2 slices) | — | ☐ | — | |
| `START-HERE.txt`, root `README.md` | — | ☐ | — | last |
| Full verification (`verify-all.cjs` + non-integrated tracks) | planner | ☐ | — | last |

## Known pre-existing defects (not introduced by this work)

- `dotnet-web-more` W341–W350 ("IFormFile in-memory binding") fail at baseline: tests expect `"é"` but get `é`. Left as found.
- `js-rest/types/` is an empty directory; `verify.cjs` reports "TypeScript compiler gate: not applicable".
- Root originals 66–83 have two reference implementations (`round2-remaining.cjs` readable, `missing-refs.cjs` minified) graded by different verifiers.

## Operating constraints

- 15.8 GB RAM, ~0.7 GB free at start; two concurrent test suites get killed by the memory guard. At most three writers at a time; verifiers strictly one at a time, foreground, output to a log file.
- No generator (`build-*.cjs`) is ever run; `build-react-more.cjs --refresh` in particular would regenerate references and tests.
- Learner starters, tests, prompts, manifests and fixtures are never edited.
