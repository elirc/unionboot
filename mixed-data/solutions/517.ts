// 517: Report policy 134: open, min 30, total
// Filter records by amount >=30, status open; sort amount ascending, ties id ascending (code-unit). Skip 1, take 4. Return {count,total} for selected rows. Never mutate input. Records are valid, amounts finite, IDs unique.
// Tests: node mixed-data/verify.cjs --id=517 [--starters]
// Study tests/517.cjs for examples.
// Why this works:
// The report runs the same four stages in a fixed order: filter, copy, sort,
// cut. Only the arguments change between the 135 exercises in this track.
// Policy filter: amount >= 30 AND status === 'open'. Both halves must hold, so a
// record with a large enough amount but the wrong status is dropped.
// The copy step exists for the caller: filter already hands back a fresh array,
// but its elements are the caller's own objects, so every later stage works on
// spread copies and the test's "Input must not mutate" check holds.
// Policy window: sort by amount ascending, ties broken by id in code-unit
// order, then slice(1, 5) - skip 1, take 4.
// Policy shape: report {count, total} over the selected rows only - rows that
// the slice cut away contribute nothing to either number.
export function solve(input: readonly {id:string;amount:number;status:'open'|'closed';team:string}[]): {count:number;total:number} {
  // Step 1: keep the records this policy reports on.
  const eligible = input.filter((record) => record.amount >= 30 && record.status === 'open');
  // Step 2: copy each survivor so nothing below can write into the caller.
  const candidates = eligible.map((record) => ({ ...record }));
  // Step 3: order by amount ascending, then by id ascending for ties.
  candidates.sort((left, right) =>
    left.amount - right.amount ||
    (left.id < right.id ? -1 : left.id > right.id ? 1 : 0));
  // Step 4: skip 1, take 4.
  const selected = candidates.slice(1, 5);
  // Step 5: count the selected rows and add up their amounts.
  let total = 0;
  for (const record of selected) {
    total += record.amount;
  }
  return { count: selected.length, total: total };
}
