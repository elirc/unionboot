// 432: Report policy 49: open, min 30, total
// Filter records by amount >=30, status open; sort amount descending, ties id ascending (code-unit). Skip 0, take 2. Return {count,total} for selected rows. Never mutate input. Records are valid, amounts finite, IDs unique.
// Tests: node mixed-data/verify.cjs --id=432 [--starters]
// Study tests/432.cjs for examples.
// Why this works:
// The report runs the same four stages in a fixed order: filter, copy, sort,
// cut. Only the arguments change between the 135 exercises in this track.
// Policy filter: amount >= 30 AND status === 'open'. Both halves must hold, so a
// record with a large enough amount but the wrong status is dropped.
// The copy step exists for the caller: filter already hands back a fresh array,
// but its elements are the caller's own objects, so every later stage works on
// spread copies and the test's "Input must not mutate" check holds.
// Policy window: sort by amount descending, ties broken by id in code-unit
// order, then slice(0, 2) - skip 0, take 2.
// Policy shape: report {count, total} over the selected rows only - rows that
// the slice cut away contribute nothing to either number.
function solve(input) {
  // Step 1: keep the records this policy reports on.
  const eligible = input.filter((record) => record.amount >= 30 && record.status === 'open');
  // Step 2: copy each survivor so nothing below can write into the caller.
  const candidates = eligible.map((record) => ({ ...record }));
  // Step 3: order by amount descending, then by id ascending for ties.
  candidates.sort((left, right) =>
    right.amount - left.amount ||
    (left.id < right.id ? -1 : left.id > right.id ? 1 : 0));
  // Step 4: skip 0, take 2.
  const selected = candidates.slice(0, 2);
  // Step 5: count the selected rows and add up their amounts.
  let total = 0;
  for (const record of selected) {
    total += record.amount;
  }
  return { count: selected.length, total: total };
}
module.exports=solve;
