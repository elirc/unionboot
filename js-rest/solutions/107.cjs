// 107: Index records: collect
// Input {rows:[{id,value}]} with string ids and primitive values. Return sorted [id,value] pairs. Duplicate policy: collect; collect returns arrays even for a single value. reject throws Error for duplicates. Use Map so all string keys work. Preserve input.
// Tests: node js-rest/verify.cjs --id=107 [--starters]
// Study tests/107.cjs for examples.
// Why this works:
// A Map is used instead of a plain object because a Map accepts every string
// key literally, including '__proto__', which an object literal would treat
// as a prototype reference rather than as data.
// Policy collect: every row contributes, so each key maps to an array and
// each value is appended in the order it was read. A key seen once still
// holds a one-element array, which is what the tests expect.
// The arrays are created here, so pushing into them never touches the input.
function solve(input) {
  const valuesById = new Map();
  for (const row of input.rows) {
    if (!valuesById.has(row.id)) {
      valuesById.set(row.id, []);
    }
    valuesById.get(row.id).push(row.value);
  }
  const pairs = [...valuesById];
  pairs.sort((left, right) => (left[0] < right[0] ? -1 : left[0] > right[0] ? 1 : 0));
  return pairs;
}
module.exports=solve;
