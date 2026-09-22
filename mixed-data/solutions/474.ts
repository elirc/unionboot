// 474: Report policy 91: any, min 0, rows
// Filter records by amount >=0, status any; sort amount ascending, ties id ascending (code-unit). Skip 1, take 2. Return {id,amount} rows. Never mutate input. Records are valid, amounts finite, IDs unique.
// Tests: node mixed-data/verify.cjs --id=474 [--starters]
// Study tests/474.cjs for examples.
// Why this works:
// The report runs the same four stages in a fixed order: filter, copy, sort,
// cut. Only the arguments change between the 135 exercises in this track.
// Policy filter: amount >= 0. This policy reads "status any", so status is
// never tested and closed records stay in the running.
// The copy step exists for the caller: filter already hands back a fresh array,
// but its elements are the caller's own objects, so every later stage works on
// spread copies and the test's "Input must not mutate" check holds.
// Policy window: sort by amount ascending, ties broken by id in code-unit
// order, then slice(1, 3) - skip 1, take 2.
// Policy shape: report each selected record as a fresh {id, amount} object;
// status and team are not part of the output.
export function solve(input: readonly {id:string;amount:number;status:'open'|'closed';team:string}[]): {id:string;amount:number}[] {
  // Step 1: keep the records this policy reports on.
  const eligible = input.filter((record) => record.amount >= 0);
  // Step 2: copy each survivor so nothing below can write into the caller.
  const candidates = eligible.map((record) => ({ ...record }));
  // Step 3: order by amount ascending, then by id ascending for ties.
  candidates.sort((left, right) =>
    left.amount - right.amount ||
    (left.id < right.id ? -1 : left.id > right.id ? 1 : 0));
  // Step 4: skip 1, take 2.
  const selected = candidates.slice(1, 3);
  // Step 5: project to the reported shape.
  return selected.map((record) => ({ id: record.id, amount: record.amount }));
}
