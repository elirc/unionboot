// 510: Report policy 127: any, min 10, total
// Filter records by amount >=10, status any; sort amount descending, ties id ascending (code-unit). Skip 1, take 4. Return {count,total} for selected rows. Never mutate input. Records are valid, amounts finite, IDs unique.
// Tests: node mixed-data/verify.cjs --id=510 [--starters]
// Study tests/510.cjs for examples.
// Why this works:
// The report runs the same four stages in a fixed order: filter, copy, sort,
// cut. Only the arguments change between the 135 exercises in this track.
// Policy filter: amount >= 10. This policy reads "status any", so status is
// never tested and closed records stay in the running.
// The copy step exists for the caller: filter already hands back a fresh array,
// but its elements are the caller's own objects, so every later stage works on
// spread copies and the test's "Input must not mutate" check holds.
// Policy window: sort by amount descending, ties broken by id in code-unit
// order, then slice(1, 5) - skip 1, take 4.
// Policy shape: report {count, total} over the selected rows only - rows that
// the slice cut away contribute nothing to either number.
export function solve(input: readonly {id:string;amount:number;status:'open'|'closed';team:string}[]): {count:number;total:number} {
  // Step 1: keep the records this policy reports on.
  const eligible = input.filter((record) => record.amount >= 10);
  // Step 2: copy each survivor so nothing below can write into the caller.
  const candidates = eligible.map((record) => ({ ...record }));
  // Step 3: order by amount descending, then by id ascending for ties.
  candidates.sort((left, right) =>
    right.amount - left.amount ||
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
