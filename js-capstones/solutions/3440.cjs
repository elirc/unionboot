'use strict';
// Why this works:
// Three stages, and the prompt fixes their order: validate everything, then
// deduplicate, then replay.
// Stage 1 checks the opening balance (a nonnegative safe integer) and then
// every event in input order, before any deduplication happens. That ordering
// is required: a malformed event must be rejected even when an event with the
// same ID has already been accepted. An event needs a nonempty string id, a
// positive safe-integer revision and a safe-integer delta.
// Deduplication keys on the ID. A repeat is harmless only when the revision
// and the delta both match the first sighting — that is what "idempotent"
// means here. Any other reuse is the same ID standing for a different fact and
// throws. The first sighting is the one kept, so an entry in `unique` is never
// overwritten; the test replays [b, a, a] and expects the duplicate `a` to be
// ignored rather than applied twice.
// Stage 2 sorts the unique events by revision and then requires the event at
// position i to carry revision i + 1. That one check covers both gaps and
// collisions: N distinct revisions, each at least 1, sorted, and equal to
// their position plus one can only be exactly 1..N.
// Stage 3 applies the deltas in revision order and re-checks the balance after
// every single step, not only at the end, because the prompt requires every
// intermediate balance to be a nonnegative safe integer. The test's
// [{delta:-1},{delta:+1}] case ends at 0 but dips below zero on the way, and
// must throw.
// The events are only read, and `unique`, `ordered` and `applied` are all new
// containers, so the frozen array and frozen event objects in the test are
// never written to.
function solve(initial, events) {
  if (!Number.isSafeInteger(initial) || initial < 0) {
    throw Error('Invalid initial balance');
  }
  const unique = new Map();
  for (const event of events) {
    const valid =
      event &&
      typeof event.id === 'string' &&
      event.id.length > 0 &&
      Number.isSafeInteger(event.revision) &&
      event.revision >= 1 &&
      Number.isSafeInteger(event.delta);
    if (!valid) {
      throw Error('Invalid event');
    }
    const firstSighting = unique.get(event.id);
    if (
      firstSighting &&
      (firstSighting.revision !== event.revision || firstSighting.delta !== event.delta)
    ) {
      throw Error('Conflicting event ID');
    }
    if (!firstSighting) {
      unique.set(event.id, event);
    }
  }
  const ordered = [...unique.values()].sort((a, b) => a.revision - b.revision);
  const applied = [];
  let balance = initial;
  for (const [index, event] of ordered.entries()) {
    if (event.revision !== index + 1) {
      throw Error('Revision gap or collision');
    }
    balance += event.delta;
    if (!Number.isSafeInteger(balance) || balance < 0) {
      throw Error('Invalid balance');
    }
    applied.push(event.id);
  }
  return { balance, revision: ordered.length, applied };
}
module.exports=solve;
