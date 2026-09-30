# Independent JavaScript engineering practice

This six-chapter route turns the existing exercises into evidence that you can reason about contracts, reproduce failures, and transfer a technique to a new problem. It does not replace the numbered starters or claim that passing a reference verifier demonstrates your skill.

1. [Placement and route](01-placement-and-route.md): choose prerequisites from observable gaps.
2. [Worked merge trace](02-worked-merge-trace.md): distinguish absence, values, and ownership.
3. [Debugging laboratory](03-debugging-laboratory.md): reject plausible but false explanations.
4. [Independent exercises](04-independent-exercises.md): progress from one boundary to three contracts.
5. [Solutions and review](05-solutions-and-review.md): open after recording an attempt.
6. [Capstone and rubric](06-capstone-and-rubric.md): produce a reproducible work sample.

Run the isolated evidence lab from the repository root with `node --test advanced-practice/merge-boundaries.test.cjs`. It executes assertions without editing starters, generating reports, or downloading packages. The existing verifier is documented separately because it writes verification JSON and defaults to checking reference solutions.

Keep personal attempts in your own scratch directory. Never replace an existing answer just to follow this route. Record the case, prediction, observation, explanation, and one remaining uncertainty for each exercise.

## Extended workbook

Continue with the [extended JavaScript reasoning workbook](extended-course/README.md) for longer source-grounded teaching units, independent labs, graded exercises, and separate reviews. Its entry page maps all twenty-four teaching units and their separate reviews.
