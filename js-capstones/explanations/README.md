# js-capstones — explanations index

Three standalone capstone exercises, IDs 3439–3441. Each is larger than a single
technique: the prompts describe a small system with its own rules, and the tests
probe the awkward cases that a first draft usually gets wrong.

Read the document, attempt the starter, run the verifier, then compare with the
readable reference in `solutions/`.

Run one exercise with `node js-capstones/verify.cjs --id=<id>`, or all three with
`node js-capstones/verify.cjs`. Add `--starters` to grade your own work instead
of the reference. The verifier writes `verification-*.json` files as it goes;
that is expected, and they can be ignored.

## The three capstones

| Doc | ID | Family | Exported signature | Difficulty |
| --- | --- | --- | --- | --- |
| [01-three-way-merge.md](01-three-way-merge.md) | 3439 | Three-way document merge | `solve(base, local, remote)` | ★★☆ |
| [02-revision-event-replay.md](02-revision-event-replay.md) | 3440 | Revision event replay | `solve(initial, events)` | ★★★ |
| [03-structural-json-change-log.md](03-structural-json-change-log.md) | 3441 | Structural JSON change log | `solve(before, after)` | ★★★ |

Difficulty is a reading guide, not a measurement: ★★☆ is one idea with a sharp
edge case, ★★★ needs several rules held in mind at once.

## Suggested order

**3439 first.** It is the smallest of the three and it introduces the idea the
other two also rely on: a missing key is not the same as a key holding a falsy
value, and the difference has to be carried through the comparison rather than
papered over with `??`. The `missing` sentinel built from `Symbol` is the
cleanest example of that pattern in the pack.

**3440 second.** Same care about inputs, but the emphasis moves to the *order of
the stages*. Validate everything, then deduplicate, then replay — and check the
running invariant after each step, not once at the end. Several of its ten
assertions exist only to catch a stage done in the wrong order.

**3441 last.** It combines both lessons with recursion: own-key membership tests
that survive `__proto__`, deterministic ordering from a sorted key union, and
cloned output so that no emitted value aliases an input.

## What the three have in common

- **`Object.hasOwn`, not `key in obj`.** Every one of these exercises decides
  whether a key is present, and every one of them must ignore names inherited
  from `Object.prototype`. 3439's test feeds a record parsed from
  `'{"__proto__":"data","constructor":"ok"}'` where both are real data keys.
- **No `?? fallback` shortcuts.** The absence of a key is meaningful in all
  three, and the values can legitimately be `''`, `0` or `false`. A rewrite that
  replaces a presence test with a nullish fallback fails.
- **Frozen inputs.** Each test passes at least one `Object.freeze`d value, so a
  solution that sorts or writes in place throws under `'use strict'`. Copy
  before you reorder.
- **Deterministic output order.** 3439 sorts its conflict keys, 3440 sorts by
  revision, 3441 sorts each key union. None of the three may let insertion order
  leak into the result.
