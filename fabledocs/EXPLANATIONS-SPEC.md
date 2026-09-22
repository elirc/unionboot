# unionboot — explanations, solutions and worked examples: authoring spec

This is the contract every writing agent follows. Read it fully before touching a track. It exists so that ~600 family explanations and ~5,600 solution rewrites written by different agents read as one pack.

Reviewer/planner: Claude Fable 5.1. Writers: Claude Opus agents, one track slice each. Baseline: git commit `Baseline: unionboot as found on 2026-09-21` in this folder — every change is reviewable with `git diff`.

## 1. What we are producing

For every track (`js-rest/`, `ts/`, `react-300/`, `sql-200/`, …):

| Artifact | Path | One per | Purpose |
| --- | --- | --- | --- |
| Family explanation | `<track>/explanations/<NN>-<family-slug>.md` | family | Teach the concept, the approach, the policy matrix, the pitfalls — and walk one scenario end to end. |
| Explanations index | `<track>/explanations/README.md` | track | Table of families → doc, exercise IDs, level, and a suggested order. |
| Readable solution | `<track>/solutions/<id>.<ext>` (in place) | exercise | Same behaviour, same exports, same header; the body rewritten so a learner can read it, with a short "why" comment block. |
| Guide refresh | `<track>/GUIDE.txt` (in place) | track | Add a "HOW TO USE THE EXPLANATIONS" section at the top; do not remove existing content. |

Root-level equivalents:

| Artifact | Path | Notes |
| --- | --- | --- |
| Originals 01–83 | `SOLUTIONS.md` (in place, extended) | Today it covers 01–33. Extend to 34–83 with the same headings; add a "Why it works" paragraph and a worked trace to every entry, not only the tricky ones. Keep the reference `.cjs` files under `solutions/` as the executable source of truth; SOLUTIONS.md must match them exactly. |
| C# packs | `CSHARP-EXPLANATIONS.md` and `CSHARP-MORE-EXPLANATIONS.md` (new) | One section per family (53 + 53). The `.cs` files are NOT edited: a single syntax slip in a 1 MB file breaks all 583 exercises, and `dotnet run --file` is slow on this machine. |
| Fullstack Q&A | `fullstack-questions/*.json` + `*.txt` (in place) | Improve answers/rationales; `verify.cjs` must still pass. |
| Top-level index | `START-HERE.txt` (in place) | Add an EXPLANATIONS section pointing at every `explanations/` directory and the root docs. |

"Family" means what the manifest calls `family`. For tracks whose manifest has no family field (`js-rest`, `mixed-data`, `react-junior`, `react`, `ts`, `mixed-react`), group by the title prefix before the colon or the shared sentence (e.g. `104–107 Index records: keep-first / keep-last / reject / collect` is one family). If an exercise is genuinely alone, it is a one-member family.

## 2. Family explanation — required structure

File name: `<NN>-<family-slug>.md` where `NN` is the family's order in the track (01, 02, …) and the slug is lower-kebab of the family name. Front matter is a plain heading block, no YAML.

```markdown
# <Family name> — <track> <first id>–<last id>

**What you practise:** one sentence.
**Prerequisites:** 2–4 items (link to earlier families/docs where relevant).
**Exercises:** <id>: <variant title>, <id>: <variant title>, …

## The problem in plain words
2–4 short paragraphs. What the input is, what must come out, what "policy" means for this family. No code yet.

## The contract you must honour
Bulleted invariants shared by every variant: input must not be mutated, ordering rules, error messages (quote them exactly as the tests expect), return shape, edge cases (empty input, ties, negative zero, `__proto__` keys, …). Take these FROM THE TESTS, not from memory.

## Approach
Numbered steps. Name the data structure and say why (e.g. "a Map, because object keys would turn `__proto__` into a prototype lookup"). Mention complexity when the prompt or tests care about it.

## Worked example — <id> <variant title>
Pick the first or most representative scenario. Show:
1. The exact input taken from that exercise's test file (quote it).
2. A step-by-step trace: a small table or numbered list showing state after each step (e.g. Map contents, stack, frequency counters).
3. The expected output, and where in the test it is asserted.
4. The reference solution for that scenario, in full, as it now reads in `solutions/<id>.<ext>` — readable form, not the minified one.

## Policy matrix — what changes between the variants
| ID | Variant | What differs in the prompt | What differs in the code |
One row per exercise in the family. The "code" column should be one line: "sort comparator flips", "`if (!m.has(id))` becomes unconditional set", etc.

## Pitfalls the tests are designed to catch
Bulleted. Each pitfall names the test assertion that catches it (e.g. "`check(input, expected)` clones the input and deep-compares after the call, so sorting in place fails 'Input must not mutate'").

## Try it yourself
2–3 short prompts to extend the exercise (a new policy, a different data shape) and one question to answer in words.
```

Length: 120–300 lines per family doc. Shorter for one-member families in the older tracks (60–120 lines). Do not pad.

Language rules:

- Explain to a junior developer who knows the language basics. Define a term the first time it appears.
- Every factual claim about behaviour must be checkable against the test or the prompt. If the test does not check it, do not claim the test checks it.
- Quote error messages, keys and return shapes exactly.
- No filler ("In this exercise we will…"), no marketing words, no emoji.
- British or American spelling: either, but consistent within a doc.
- Code fences must carry a language tag (`js`, `ts`, `jsx`, `sql`, `csharp`).

## 3. Readable solution — rewrite rules

The reference solutions are minified one-liners (see `js-rest/solutions/104.cjs`). Rewrite each one so it teaches, without changing what it does.

Must keep, byte for byte:

- The header comment lines that carry the ID, title, prompt path, and test command (lines 1–4 in the JS tracks; whatever the track uses).
- The export line (`module.exports=solve;`, `export default …`, `export const …`) and the exported name.
- `'use strict';` where present.
- Any `const cfg={…}` policy object as generated — it is the policy contract; you may reformat whitespace only.
- Type signatures in TS solutions (these are checked by positive/negative fixtures); you may add annotations, never remove or loosen them.

Must do:

- One statement per line; meaningful names (`victim`, `frequencyOf`, not `a`, `b`, `x`), early returns for guards.
- Add a comment block between the header and the code, 4–12 lines, headed `// Why this works:` that gives the approach and names the policy points. Then inline comments only where a line is non-obvious.
- Preserve algorithmic properties the prompt or test requires (e.g. "use a stack, not recursion", "O(n)", "structural sharing"). Where the prompt says a requirement "needs source review", the reviewer will read the file; do not silently drop the property.
- Keep the solution's observable behaviour identical, including error messages, ordering, and mutation behaviour. If you believe the existing reference is wrong, do NOT fix it silently: leave it, and list it in your report under "Suspected reference defects".

Must not:

- Import anything new (tests forbid extra modules; "no timers, filesystem, network, random").
- Change the file's extension, location, or line-ending style (files are LF).
- Touch `starters/`, `tests/`, `types/`, `prompts/`, `manifest.json`, or any `verification-*.json`/`*.log`. Learner starters are sacred.
- Rewrite a solution you have not run the verifier against (see §5).

### 3.1 Track-specific rules (from the pre-flight survey)

| Track | Rule |
| --- | --- |
| `react/`, `mixed-react/` | **Do not edit any file.** `react-more/verify.cjs` verifies SHA-256 hashes of 501 files under these two tracks (`react-more/preservation-baseline.json`), including every solution and GUIDE.txt. Write explanations only; put the readable solution inside the family doc's worked example. Leave `GUIDE.txt` untouched here too — add the "how to use" text to `explanations/README.md` instead. |
| `CSHARP-583.cs`, `CSHARP-MORE-583.cs` | **Do not edit.** `verify-csharp*.cjs` regex-inspects the source (`^static class E\d{3} \{` at column 0, exact counts of `Practice(`/`Reference(`), `verify-all.cjs` requires the literal `throw new NotImplementedException("Exercise 1")`, and the whole 1 MB file recompiles on any change. Explanations go in `CSHARP-EXPLANATIONS.md` / `CSHARP-MORE-EXPLANATIONS.md`, one section per family, using `--show N` text and the `Reference` bodies as source material. The existing one-line `Hint` per family is the only explanation today; keep it and expand around it. |
| `dotnet-web-300/`, `dotnet-web-more/` | All 300 solutions of a set compile as ONE project: a syntax error anywhere fails every ID with exit 2 and no attribution. Rewrite one family (10 files) at a time, then run `node <track>/verify.cjs --id=W<first>` (≈35 s, compiles the whole set). On exit 2, `git checkout -- <track>/solutions/` for that family and retry once with a smaller change; on a second failure leave the family at baseline and report. Never rename the class, the method, or its signature — `tests/Wxxx.cs` binds with `using static DotnetWeb.Wxxx;`. Known pre-existing failure: `dotnet-web-more` W341–W350 fail at baseline (`Expected "é", got "é"` — a test-generation bug). Do not try to fix it; record it. |
| `sql-200/`, `sql-more/` | Cheap (<1 s per ID). Only the FINAL statement's rows are graded, exact rows and exact order, so a readable rewrite may add comments and line breaks and may use CTEs, but must end in one statement returning identical rows in identical order. Comments must be `--` line comments placed so the semicolon tokenizer still sees one final statement (read `runtime.cjs` first). |
| `fullstack-questions/` | Improve `answer` text in the `.json` AND mirror it into the matching `.txt` block (the validator checks whitespace-collapsed agreement). Keep every answer ≥ 25 words, keep IDs/sections/levels unchanged, never add or remove questions. Run `node fullstack-questions/verify.cjs` after each section. |
| `react-more/` | Its verifier also runs the hash check above; running it is fine, but never run `build-react-more.cjs --refresh` (it regenerates references and tests). |
| Root originals 01–83 / `SOLUTIONS.md` | `verify-original.cjs` grades 01–33 by locating the `## NN — Title` heading in `SOLUTIONS.md` and evaluating the FIRST ```js fence after it, concatenated with a fixed assertion string. So for 01–33: keep every heading's `## NN — ` prefix and em dash exactly; keep the solution as the first and only ```js fence in its section (use ```text for traces and tables); keep every top-level identifier name (`celsiusToFahrenheit`, `honorRoll`, `average`, `students`, …). Read `verify-original.cjs` before editing and run all three root verifiers afterwards (`node verify-original.cjs`, `node verify-39-50.cjs`, `node verify-missing.cjs`, seconds each). For 34–83, the executable references are `solutions/round2-remaining.cjs`, `solutions/round2-39-50.cjs`, `solutions/missing-refs.cjs`; do not edit those files (`missing-refs.cjs` is a verifier fixture whose recursion shape is asserted by exact call counts). SOLUTIONS.md entries for 34–83 must reproduce their code faithfully. Never edit the `NN-*.js` starters: the verifiers regex-match their stub text. |
| `js/batch-084-103/`, `js-rest/`, `js-capstones/` | Cheap (<5 s full track), `--id` filters to one exercise, no side effects except js-capstones writing `verification-*.json`. `js-rest` is 20 families × 4 policy variants (title = `Family: policy`); group by title prefix. `js-capstones` tests probe `__proto__` keys and `Object.hasOwn` sentinels — a "cleaner" `obj[k] ?? fallback` rewrite fails. |
| `mixed-data/` | One family ("Report policy N: status, min, shape") in 135 permutations: 3 statuses × 5 minimums × 3 shapes × 3 sort/skip/take configs. Write ONE family doc per shape (rows / total / groups) — three docs plus the index — with the policy matrix as a compact table of axes, not 135 rows. Every verify invocation runs the full `tsc` gate first (~20–60 s) regardless of `--id`, and rewrites `.build/`; verify once per batch of ~15. TS solutions (454–518) must keep the exact exported `solve` signature — `types/NNN.ts` fixtures use `@ts-expect-error` and loosening a type fails the whole gate. `tsconfig` has `"types": []`: no Node globals in any `.ts`. |
| `ts/` | 20 families × 5; no `prompts/` (header comment is the prompt). `types/<id>.ts` is ONE combined fixture statically importing `../solutions/<id>`, so it type-checks your rewritten solution: keep the exported `solve` signature and any exported types exactly. `verify.cjs` runs `tsc -p ts/tsconfig.json` over all ~300 files on EVERY invocation (~1 min) before honouring `--id`, and rewrites `.build/`. Verify once per family (5 files), not per ID. Solutions are one minified line with an inner arrow named `compute` returning `{policy, result}` — keep that return shape. |
| `ts-more/`, `ts-final/` | Solutions are already readable single expressions; keep them, add the "Why this works" block, expand only where a one-liner hides a step. `types/<id>.positive.ts` and `.negative.ts` (exactly 4 `@ts-expect-error` cases) are rebound to the graded file in a temp workspace, so single-ID verify is cheap (3 files) — verify every ID you touch. Keep the exported signature byte-compatible in meaning; never widen a parameter type or narrow a return type. Tests assert call counts (`assert.equal(calls,1)`) and exception propagation. |
| `ts-next/` | 50 families × 15 semantic variants; solutions are a readable exported type prelude plus a MINIFIED one-line function body — this is the track that most needs the rewrite. Keep every exported type alias and the `solve` signature exactly (positive fixtures assert `api.<Type>` results and exact literal types; `contractHash` is SHA-256 of prelude+signature but nothing checks it at runtime). Tests assert freshness (`assert.notEqual(out,input)` — never return the input by reference), non-mutation, and call counts. Single-ID verify is cheap but WRITES `reports/<mode>-<id>.json`, `verification-<mode>-<id>.json`, overwrites `verification-<mode>.json`, and appends to `verification.log`; that is expected — do not "clean up" those files, and do not commit them separately. Never run the full track (40-minute timeout). |
| All React tracks | Transformer is esbuild (`jsx: 'automatic'`); tests are RTL + `node:assert/strict`, one async function per test file. A single `--id` run costs 25–40 s (process startup), a full-track run costs that startup once plus tens of ms per exercise. So: rewrite a batch of 3–5 families, then run the FULL track verifier once (`node <track>/verify.cjs`, foreground, to a log; 1–4 min), read the per-ID `PASS`/`FAIL` lines, revert any FAIL with `git checkout -- <track>/solutions/<id>.jsx`. Never run two React verifiers at once. Behavioural-structure assertions a rewrite can break: listener identity and count (`react-more` 724+ patch `document.addEventListener` and assert exactly one add/remove with the same function — keep one `useEffect` per subscription), `useSyncExternalStore` subscriber counts (`react-next` 2719 asserts `source.active()===3` — keep helper sub-components as they are), timer counts (`react-junior` asserts `clock.getTimerCount()` is 1 while running and 0 after unmount), deep-frozen props (`react-300`/`react-next` — never sort/push in place), and DOM shape (`getByRole('status')` relies on `<output>`, `rowText` on a `<span>`, `submit()` on a `<form>` — keep the element types and `aria-label`s). Where a prompt states a technique requirement no test checks ("use functional updates", "implement with useReducer", "no module-level state"), the rewrite must honour it. Keep the `Exercise` default export and the destructured signature; `react-next` solutions may define helper components above `Exercise` — keep them. |
| `react-junior/` | 50 standalone scenarios with `category` tags (`state / debugging`, `forms / a11y`, `CRUD / async`, `effects`, `performance`, `refactoring`); group docs by category (6 docs) with one worked example per exercise inside. `clock.cjs` is a local fake-timer module, not Jest — explain it in the docs. `--id=N` form only. |
| `react-more/`, `react-300/`, `react-next/` | Prompts exist (`prompts/<id>.txt`); `react-300`/`react-next` prompts have TASK/EXAMPLE/CONTRACT/PROPS sections with the literal test fixture — quote from them. Family variants are boundary-knob × policy-knob (e.g. scenarios 1–10 policy A at boundaries 1–10, 11–20 policy B); the policy matrix should show the two axes, not 20 prose rows. `react-next` `semanticKey` (a JSON string in the manifest) is the real rule behind opaque titles like "Boundary 3" — decode it in the doc. Verifiers write `verification-*.json`; leave those files alone. |
| `js-more/` | Solutions are already readable and multi-line; keep them, add the "Why this works" block, and improve names only where clearly better. Every prompt says complexity/structural-sharing requirements "need source review": persistent stacks (1849–1858) must keep structural sharing, KMP must stay O(n+m), Fenwick/segment trees O(log n). Async families assert exact microtask order — do not move where promises are created or awaited. Keep the `const cfg={…}` line. Full verify ≈ 1.5–4 min and writes `verification-*.json` and logs; use `--id` per exercise. |

## 4. Guide refresh

At the top of `<track>/GUIDE.txt`, insert (after the first title line and its blank line):

```
HOW TO USE THE EXPLANATIONS
explanations/README.md lists every family with the exercises it covers.
Read the family doc first, attempt the starter, run the verifier, then
compare with the readable reference in solutions/. Each doc ends with a
policy matrix showing exactly what changes between sibling variants.
```

Do not delete or reorder anything else in the guide. Fix obvious factual errors only if you have verified the correct fact in this session, and mention each fix in your report.

## 5. Verification — non-negotiable

This machine is slow and memory-constrained. Two node processes running test suites at once get killed. Rules:

1. Run the track verifier in the FOREGROUND, with output redirected to a log file in your working notes, never in the background:
   `node <track>/verify.cjs --id=<id> > <log> 2>&1` for JS-style tracks; see the track's GUIDE for the exact form.
2. After rewriting a batch of solutions (a family, ≤15 files), run the verifier for every ID you touched before moving to the next family. For tracks where a single `--id` compiles the whole set (TypeScript, .NET), run once per family and expect it to take minutes.
3. Never run two verifiers at the same time, and never run `verify-all.cjs` — the planner runs the full gates at the end.
4. A failing rewrite is reverted to the baseline (`git checkout -- <track>/solutions/<id>.<ext>`) and listed in your report. Do not leave a red reference behind.
5. Do not run `npm install`, `npm ci`, `dotnet restore`, or any build script (`build-*.cjs`). The generators refuse existing directories and would discard learner work.

## 6. Report back

End your run with a report in this shape (the planner reads only this):

```
TRACK <name> SLICE <ids>
Families written: <n> (<list of doc paths>)
Solutions rewritten: <n> / <n in slice>
Verifier runs: <n>, all green: yes/no
Reverted (failed after rewrite): <ids or none>
Suspected reference defects (left untouched): <id: one line each, or none>
Guide edits: <yes/no, what>
Facts I could not verify and therefore did not claim: <list or none>
Time spent on verification: <rough>
```

## 7. Order of tracks and slicing

Pilot first (planner reviews before scaling):

1. Root originals 01–83 → `SOLUTIONS.md` (one agent).
2. `js-rest/` (80 exercises, ~20 implicit families; one agent).

Then, in slices of ≤150 exercises or ≤10 families per agent, at most three agents at a time:

3. `js/batch-084-103`, `js-more/`, `js-capstones/`, `mixed-data/` (JS half 384–453).
4. `ts/`, `mixed-data/` (TS half 454–518), `ts-final/`, `ts-more/`, `ts-next/`.
5. `react-junior/`, `react/`, `mixed-react/`, `react-more/`, `react-300/`, `react-next/`.
6. `sql-200/`, `sql-more/`, `dotnet-web-300/`, `dotnet-web-more/`.
7. `CSHARP-583.cs` and `CSHARP-MORE-583.cs` (explanation docs only), `fullstack-questions/`.
8. `START-HERE.txt`, root `README.md`, final full verification by the planner.
