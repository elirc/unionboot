// 106: Index records: reject
// Input {rows:[{id,value}]} with string ids and primitive values. Return sorted [id,value] pairs. Duplicate policy: reject; collect returns arrays even for a single value. reject throws Error for duplicates. Use Map so all string keys work. Preserve input.
// Tests: node js-rest/verify.cjs --id=106 [--starters]
// Study tests/106.cjs for examples.
// Why this works:
// A Map is used instead of a plain object because a Map accepts every string
// key literally, including '__proto__', which an object literal would treat
// as a prototype reference rather than as data.
// Policy reject: a second row carrying an id already seen is an error, so the
// loop throws Error("Duplicate id") the moment the Map reports the key.
// The throw happens before anything is written back to input, so the caller's
// object is still untouched when the error propagates.
function solve(input) {
  const valueById = new Map();
  for (const row of input.rows) {
    if (valueById.has(row.id)) {
      throw new Error("Duplicate id");
    }
    valueById.set(row.id, row.value);
  }
  const pairs = [...valueById];
  pairs.sort((left, right) => (left[0] < right[0] ? -1 : left[0] > right[0] ? 1 : 0));
  return pairs;
}
module.exports=solve;
