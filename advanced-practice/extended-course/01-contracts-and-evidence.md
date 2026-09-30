# 01. Contracts, observations, and evidence

Read [second largest](../../03-second-largest.js), [move zeroes](../../35-move-zeroes.js), and [the original verifier](../../verify-original.cjs). These three files expose an important distinction: a specification tells you what must hold, a starter gives you a place to work, and a verifier observes selected behaviors of a particular implementation. They are not interchangeable evidence. This course builds algorithms while keeping that distinction visible.

## Start with two contrasting contracts

Exercise 3 asks for the second largest unique value and returns undefined when fewer than two distinct values exist. Exercise 35 asks you to move zeroes to the end of the existing array while preserving the order of other values. An implementation that sorts its input might return the correct answer for exercise 3 while violating the existing verifier's nonmutation check. An implementation that constructs a beautiful new array for exercise 35 fails to perform the requested operation on the caller's array. The same coding habit can be appropriate in one task and wrong in another.

Write a contract card before opening a reference solution. Use four sentences: the accepted input domain, the observable result, the permitted mutations, and the exceptional or empty cases. Then distinguish an explicit promise from a reasonable assumption. For exercise 3, uniqueness is explicit. Whether NaN belongs to the input domain is not established by the small starter examples. Do not secretly add coercion, ordering rules for nonnumbers, or validation requirements and then describe those additions as repository requirements. Label such extensions as decisions for your own program.

The original verifier provides useful additional evidence. Its exercise 3 case snapshots an input array, calls secondLargest, and compares the input afterward. That is more precise than inferring purity from the function's name. Its exercise 35 reference check instead expects the original array to change. Read both assertions and state the difference without relying on implementation details.

## Worked trace: why examples need adversaries

Suppose an implementation removes duplicates, sorts descending, and returns position one. On input 9, 9, 4, it returns 4. Suppose a second implementation sorts descending without removing duplicates. It returns 9. The original sample contains a repeated maximum, so it distinguishes those implementations. A sample containing only distinct values would not. Test strength depends on the alternatives it eliminates, not on how friendly the chosen values look.

Now consider a one-pass implementation initialized with largest equal to zero and second equal to zero. On 4, 9, 1, 9, 7, it may return the expected 7. On negative five, negative two, negative seven, the initialization introduces values absent from the input. The correct second unique maximum is negative five. This is a boundary failure caused by an implicit sentinel, not a failure of the one-pass idea. The repair should preserve the intended algorithm and replace the invalid initialization or represent the missing state explicitly.

A third implementation returns negative infinity when there is no second value. That may be a convenient internal state, but the public result must be undefined under this contract. An internal representation and an API result can differ. Your tests should inspect the outward result directly; converting it to a printed string can hide distinctions.

## Laboratory: compare three kinds of evidence

Create a new scratch file outside the numbered starters. Put three candidate second-largest functions there: one correct only for distinct inputs, one correct only for nonnegative inputs, and one correct for the cases you have specified. Implement them yourself rather than modifying repository references. Write an assertion table containing the original sample, a repeated maximum, all duplicates, empty input, two distinct negatives, and input preservation. Predict which candidates fail each row before running anything.

Run your scratch file with Node and capture the command and exit status. A console log showing the expected-looking number is an observation; a failed assertion produces a machine-visible failure. Both can help investigation, but only the assertion automatically rejects the wrong outcome. Keep the deliberately wrong candidates local to the lab and name them clearly so nobody mistakes them for recommended code.

Next, inspect what the original verifier actually executes. For early exercises it reads code blocks from SOLUTIONS.md. For several later exercises it imports reference functions from solutions/round2-remaining.cjs. It does not simply load your edited starter for every task. A passing reference check establishes that the checked reference satisfies those assertions. It does not establish that your independent function is correct. Your lab should import or directly call the function you wrote.

The broader package command for original exercises also runs other verifier scripts. Do not run an entire suite just to prove a six-case scratch function when a direct command is sufficient. Conversely, do not claim the broader suite passed when you ran only your scratch command. Scope is part of the evidence.

## Debugging case: the right number from the wrong program

A learner changes secondLargest in a personal file, runs the original reference verifier, and sees all green output. They conclude that their edit is correct. The test process never loaded their file. This is a provenance failure. Put a deliberate throw at the start of the personal function and run the same command. If the process still passes, the command is not connected to the implementation. Remove the throw after the experiment; retain the observation in your notes.

This technique is a small form of mutation testing. The goal is not to vandalize working code. The goal is to prove that a test would notice a relevant defect. Use a temporary copy or a local scratch function, and make the mutation easy to undo. A mutation that never reaches the tested path tells you little about the assertions themselves.

## Graded exercises

**C01-A, foundation:** Write contract cards for exercises 3 and 35. Include at least one sentence about identity or mutation for each. Two points require accurate results; two more require accurate mutation rules. Do not award full credit for repeating the sample comments without explaining what a caller can observe.

**C01-B, implementation:** Build the six-case second-largest table described above and add one counterexample of your own. Award four points when each assertion calls your function and at least two deliberately wrong candidates are rejected. Add two points for explaining why the new case is not redundant with the others.

**C01-C, investigation:** Demonstrate the provenance failure with a temporary mutation. Submit both commands, what each loaded, and the observed outcome. Three points require a valid demonstration; two require explaining why a passing reference suite did not validate your edit.

**C01-D, transfer:** Design a contract for finding the second most recent distinct event timestamp. Decide whether equal timestamps from different events count as one value, whether input order must remain unchanged, and how missing timestamps are treated. This is a new application contract. Four points require explicit decisions and tests derived from them, not an unsupported claim that the numeric exercise already solves the application.

## Hints, before the review

For C01-A, ask whether a caller holding the original array should see different contents after the call. For C01-B, think about a value that is larger than every actual input only because it came from initialization. For C01-C, identify the exact require or code-extraction operation. For C01-D, separate the identity of an event from the equality of its timestamp.

Write your answers before opening [the chapter review](reviews/01-contracts-and-evidence.md). At the end, explain one rejected implementation without running it. If you can only recognize the output after execution, repeat the trace on different data the following day.
