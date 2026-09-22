// 109: left join by identifier
// Input {left:[{id,value}],right:[{id,value}]}, unique numeric ids per side. Return [id,leftValueOrNull,rightValueOrNull] rows sorted by id. Implement a left join; null denotes an absent side. No mutation.
// Tests: node js-rest/verify.cjs --id=109 [--starters]
// Study tests/109.cjs for examples.
// Why this works:
// Both sides are indexed by id first, so every lookup after that is O(1).
// The candidate ids are the union of both key sets, de-duplicated with a Set
// and sorted numerically, which fixes the output order once and for all.
// Policy left: an id is emitted when the LEFT side holds it; the right slot
// falls back to null when the right side has no row for that id.
// Nothing is written back into input.left or input.right.
function solve(input) {
  const leftValueById = new Map(input.left.map(row => [row.id, row.value]));
  const rightValueById = new Map(input.right.map(row => [row.id, row.value]));
  const allIds = [...new Set([...leftValueById.keys(), ...rightValueById.keys()])];
  allIds.sort((a, b) => a - b);
  const rows = [];
  for (const id of allIds) {
    if (!leftValueById.has(id)) {
      continue;
    }
    rows.push([
      id,
      leftValueById.has(id) ? leftValueById.get(id) : null,
      rightValueById.has(id) ? rightValueById.get(id) : null,
    ]);
  }
  return rows;
}
module.exports=solve;
