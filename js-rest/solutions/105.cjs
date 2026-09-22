// 105: Index records: keep-last
// Input {rows:[{id,value}]} with string ids and primitive values. Return sorted [id,value] pairs. Duplicate policy: keep-last; collect returns arrays even for a single value. reject throws Error for duplicates. Use Map so all string keys work. Preserve input.
// Tests: node js-rest/verify.cjs --id=105 [--starters]
// Study tests/105.cjs for examples.
// Why this works:
// A Map is used instead of a plain object because a Map accepts every string
// key literally, including '__proto__', which an object literal would treat
// as a prototype reference rather than as data.
// Policy keep-last: the most recent row for an id wins, so the write is
// unconditional. A Map keeps a key in its original insertion position when
// the value is overwritten, but that does not matter here because the
// entries are sorted by id before they are returned.
function solve(input) {
  const valueById = new Map();
  for (const row of input.rows) {
    valueById.set(row.id, row.value);
  }
  const pairs = [...valueById];
  pairs.sort((left, right) => (left[0] < right[0] ? -1 : left[0] > right[0] ? 1 : 0));
  return pairs;
}
module.exports=solve;
