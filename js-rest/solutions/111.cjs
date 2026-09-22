// 111: anti join by identifier
// Input {left:[{id,value}],right:[{id,value}]}, unique numeric ids per side. Return left-only [id,leftValue] rows sorted by id. Implement a anti join; null denotes an absent side. No mutation.
// Tests: node js-rest/verify.cjs --id=111 [--starters]
// Study tests/111.cjs for examples.
// Why this works:
// Both sides are indexed by id first, so every lookup after that is O(1).
// The candidate ids are the union of both key sets, de-duplicated with a Set
// and sorted numerically, which fixes the output order once and for all.
// Policy anti: keep only ids the left side has and the right side lacks.
// Because the right side is by definition absent, the row shape is the
// two-element [id, leftValue], not the three-element join row.
// Nothing is written back into input.left or input.right.
function solve(input) {
  const leftValueById = new Map(input.left.map(row => [row.id, row.value]));
  const rightValueById = new Map(input.right.map(row => [row.id, row.value]));
  const allIds = [...new Set([...leftValueById.keys(), ...rightValueById.keys()])];
  allIds.sort((a, b) => a - b);
  const rows = [];
  for (const id of allIds) {
    if (!leftValueById.has(id) || rightValueById.has(id)) {
      continue;
    }
    rows.push([id, leftValueById.get(id)]);
  }
  return rows;
}
module.exports=solve;
