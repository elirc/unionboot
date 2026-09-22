// 104: Index records: keep-first
// Input {rows:[{id,value}]} with string ids and primitive values. Return sorted [id,value] pairs. Duplicate policy: keep-first; collect returns arrays even for a single value. reject throws Error for duplicates. Use Map so all string keys work. Preserve input.
// Tests: node js-rest/verify.cjs --id=104 [--starters]
// Study tests/104.cjs for examples.
// Why this works:
// A Map is used instead of a plain object because a Map accepts every string
// key literally, including '__proto__', which an object literal would treat
// as a prototype reference rather than as data.
// Policy keep-first: the first row that carries an id wins, so a key is only
// written when the Map does not already hold it.
// Sorting happens on a fresh array of entries, never on input.rows, which is
// what keeps the 'Input must not mutate' assertion green.
function solve(input) {
  const valueById = new Map();
  for (const row of input.rows) {
    if (!valueById.has(row.id)) {
      valueById.set(row.id, row.value);
    }
  }
  const pairs = [...valueById];
  pairs.sort((left, right) => (left[0] < right[0] ? -1 : left[0] > right[0] ? 1 : 0));
  return pairs;
}
module.exports=solve;
