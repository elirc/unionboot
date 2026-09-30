# 1. Placement and a deliberate route

Budget thirty minutes for this diagnostic. Close solutions and write predictions before executing anything. A correct guess without an explanation is useful information, but it is not yet evidence that you can independently repair the code. The objective is a route you can complete, not the highest possible placement.

## Four placement tasks

**P1: Values and presence.** Predict `'' ?? 'missing'`, `'' || 'missing'`, `Object.hasOwn({}, 'toString')`, and `'toString' in {}`. Explain why these expressions ask different questions. Then construct an object that has an own key named `__proto__`. Show that reading a key and asking whether the object owns it are separate operations. Award two points for predictions and two for an explanation that distinguishes falsiness, nullishness, and prototype traversal.

**P2: Pure changes.** Read [exercise 23](../23-todo-reducer.js) and [exercise 69](../69-object-path.js). State one invariant each exercise should preserve. Design a case that passes if the output is right but fails if an input is mutated. Explain why freezing only the outer object does not protect its nested arrays. Award two points for an observable invariant and two for a mutation-sensitive case.

**P3: Ordered effects.** Read [capstone 3440's prompt](../js-capstones/prompts/3440.txt). An event is repeated with the same ID but a different delta. Is this harmless duplication? Write the expected outcome before reading its tests. Next, construct two events whose final sum is nonnegative while an intermediate balance is negative. Award two points for distinguishing identity from payload and two for the intermediate-state example.

**P4: Contracts and ownership.** Read [capstone 3441's prompt](../js-capstones/prompts/3441.txt). Describe the difference between an empty root pointer and a pointer to an empty property name. If an emitted operation contains an array, what happens when the consumer mutates that array? Award two points for correct pointer semantics and two for explaining why a copied outer object can still share nested data.

## Choose the next step

| Evidence | Route | Exit condition |
| --- | --- | --- |
| P1 or P2 below 3/4 | 19 deep equality, 23 reducer, 50 cloning, 69 paths; then chapter 2 | Explain presence and produce an input-mutation counterexample |
| P1/P2 secure; P3 below 3/4 | 21 retry, 60 promises, 62 pool, then 3440 | Distinguish order, duplication, validation, and intermediate validity |
| P1-P3 secure; P4 below 3/4 | 70 flatten, 71 unflatten, then 3441 | Trace escaping and prove output ownership |
| All four secure | Start chapter 3, then independent exercises | Kill an incorrect implementation with a new case |

The numbered root files are learner exercises, not guaranteed passing programs. Inspect their comments before choosing one. A blank starter failing is expected and should not be repaired by copying the solution wholesale.

## Understand the verifier before trusting it

The real [capstone verifier](../js-capstones/verify.cjs) selects solutions unless `--starters` is present. From the repository root, `node js-capstones/verify.cjs --starters --id=3439` grades the existing learner starter. `node js-capstones/verify.cjs --id=3439` grades the reference. Both write a corresponding verification JSON file. `--inventory` lists the three capstones without grading; it cannot combine with a grading option.

Write the exact command beside every result. "PASS 3439" alone cannot tell a reviewer whose implementation ran. Your exit artifact is a placement sheet, selected route, first failing case, and a realistic next session of forty-five minutes. Reassess after a day by repeating a changed input without notes; familiarity immediately after reading is weaker evidence than delayed reconstruction.
