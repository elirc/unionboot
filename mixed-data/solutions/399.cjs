// 399: Report policy 16: open, min 0, rows
// Filter records by amount >=0, status open; sort amount descending, ties id ascending (code-unit). Skip 0, take 3. Return {id,amount} rows. Never mutate input. Records are valid, amounts finite, IDs unique.
// Tests: node mixed-data/verify.cjs --id=399 [--starters]
// Study tests/399.cjs for examples.
// Why this works:
// The report runs the same four stages in a fixed order: filter, copy, sort,
// cut. Only the arguments change between the 135 exercises in this track.
// Policy filter: amount >= 0 AND status === 'open'. Both halves must hold, so a
// record with a large enough amount but the wrong status is dropped.
// The copy step exists for the caller: filter already hands back a fresh array,
// but its elements are the caller's own objects, so every later stage works on
// spread copies and the test's "Input must not mutate" check holds.
// Policy window: sort by amount descending, ties broken by id in code-unit
// order, then slice(0, 3) - skip 0, take 3.
// Policy shape: report each selected record as a fresh {id, amount} object;
// status and team are not part of the output.
function solve(input) {
  // Step 1: keep the records this policy reports on.
  const eligible = input.filter((record) => record.amount >= 0 && record.status === 'open');
  // Step 2: copy each survivor so nothing below can write into the caller.
  const candidates = eligible.map((record) => ({ ...record }));
  // Step 3: order by amount descending, then by id ascending for ties.
  candidates.sort((left, right) =>
    right.amount - left.amount ||
    (left.id < right.id ? -1 : left.id > right.id ? 1 : 0));
  // Step 4: skip 0, take 3.
  const selected = candidates.slice(0, 3);
  // Step 5: project to the reported shape.
  return selected.map((record) => ({ id: record.id, amount: record.amount }));
}
module.exports=solve;
