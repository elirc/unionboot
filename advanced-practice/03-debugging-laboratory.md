# 3. Debugging laboratory: evidence that rejects a hypothesis

Run `node --test advanced-practice/merge-boundaries.test.cjs` from the repository root. The new lab imports the actual 3439 reference and proves several boundary behaviors. It does not grade a learner's starter. Its deliberately defective comparison is confined to the lab and must fail the same boundary cases that the reference passes.

Begin with a prediction sheet. The laboratory is more useful if you can explain a failing mutant before seeing its assertion. Record the smallest counterexample, not a large random object that happens to fail.

## D1: A persuasive incorrect explanation

Hypothesis: "Nullish coalescing discards empty strings." Predict and execute a direct assertion on `'' ?? 'missing'`. Then compare the corresponding OR expression. Your observation should reject the hypothesis. The repair here is the explanation, not an unnecessary algorithm rewrite. Name a realistic consequence of accepting the incorrect story: a learner might avoid a correct language operator while still using an unsafe property lookup.

Next use a real fallback collision: base has a value equal to the chosen fallback string, local deletes it, and remote changes it. Missing local and unchanged local must not be confused. Trace which branch the defective reader takes and compare with the rule that should fire. The current reference returns a conflict and preserves the local deletion. This case demonstrates why a test containing only ordinary values cannot validate the absence representation.

## D2: Ownership is not lookup

Create a record with an enumerable own property on one side and an inherited property of the same name on another. The key union should include that name because at least one input owns it. Now show why a reader that merely performs `record[key]` can misclassify the other side. Do not add prototype-chain keys to the union as a workaround; that expands the problem rather than satisfying its contract.

Use parsed JSON for the `__proto__` case so you actually create an own data property. An object literal with a `__proto__` definition has special semantics and may not construct the test input you intended. Inspect `Object.hasOwn` on the fixture before drawing conclusions about the solver.

## D3: A repair that breaks a neighboring invariant

Suppose someone changes the conflict branch to keep base "to avoid losing data." Find the existing assertion involving a locally deleted key and a remote edit. Explain why keeping base violates the published local-wins policy, even if the restored text feels safer. Product policy belongs in the contract; code should not improvise a different policy during an exceptional-looking case.

In a scratch copy, change only the output collector to direct assignment. The special-key test should distinguish the copy from the reference. Then change only sorting behavior and construct two conflicting keys presented in reverse insertion order. One mutation at a time makes the resulting evidence causal.

## D4: What the lab does not prove

Passing examples do not prove support for nested values, accessors with side effects, proxies, cycles, or non-string values. Those inputs are outside this flat-record exercise. Do not award yourself extra confidence by claiming them. Write one sentence describing the supported input domain and one describing the observed behavior under the tested boundaries.

Finish with a compact incident note: symptom, hypothesis rejected, minimal failing input, intended rule, verified repair, and missing evidence. Another learner should reproduce the failure using your input without needing your editor state or browser history. That reproducibility is the debugging deliverable.
