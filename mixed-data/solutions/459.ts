// 459: Report policy 76: open, min 0, groups
// Filter records by amount >=0, status open; sort amount descending, ties id ascending (code-unit). Skip 0, take 4. Return [team,totalAmount] pairs sorted by team, grouping only selected rows. Never mutate input. Records are valid, amounts finite, IDs unique.
// Tests: node mixed-data/verify.cjs --id=459 [--starters]
// Study tests/459.cjs for examples.
// Why this works:
// The report runs the same four stages in a fixed order: filter, copy, sort,
// cut. Only the arguments change between the 135 exercises in this track.
// Policy filter: amount >= 0 AND status === 'open'. Both halves must hold, so a
// record with a large enough amount but the wrong status is dropped.
// The copy step exists for the caller: filter already hands back a fresh array,
// but its elements are the caller's own objects, so every later stage works on
// spread copies and the test's "Input must not mutate" check holds.
// Policy window: sort by amount descending, ties broken by id in code-unit
// order, then slice(0, 4) - skip 0, take 4.
// Policy shape: sum amounts per team over the selected rows only, then return
// [team, totalAmount] pairs sorted by team name, not by total.
export function solve(input: readonly {id:string;amount:number;status:'open'|'closed';team:string}[]): [string,number][] {
  // Step 1: keep the records this policy reports on.
  const eligible = input.filter((record) => record.amount >= 0 && record.status === 'open');
  // Step 2: copy each survivor so nothing below can write into the caller.
  const candidates = eligible.map((record) => ({ ...record }));
  // Step 3: order by amount descending, then by id ascending for ties.
  candidates.sort((left, right) =>
    right.amount - left.amount ||
    (left.id < right.id ? -1 : left.id > right.id ? 1 : 0));
  // Step 4: skip 0, take 4.
  const selected = candidates.slice(0, 4);
  // Step 5: add each selected amount into its team bucket.
  const totalByTeam: Record<string, number> = {};
  for (const record of selected) {
    totalByTeam[record.team] = (totalByTeam[record.team] ?? 0) + record.amount;
  }
  // Step 6: hand back [team, totalAmount] pairs in team-name order.
  const pairs = Object.entries(totalByTeam);
  pairs.sort(([leftTeam], [rightTeam]) =>
    leftTeam < rightTeam ? -1 : leftTeam > rightTeam ? 1 : 0);
  return pairs;
}
