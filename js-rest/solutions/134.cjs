// 134: Locate whitespace runs
// Input ASCII string. Return {start,end,text} for maximal runs of whitespace, with end exclusive. Letters A–Z/a–z; digits 0–9; whitespace JS \s; punctuation means non-alphanumeric, non-whitespace. Indices are UTF-16 offsets.
// Tests: node js-rest/verify.cjs --id=134 [--starters]
// Study tests/134.cjs for examples.
// Why this works:
// A global regular expression with String.prototype.matchAll walks the string
// once and yields every maximal match, because a + quantifier is greedy: it
// cannot stop in the middle of a run of the same character class.
// match.index is the UTF-16 offset where the run starts, so start is that
// index and end is index + length, which makes end exclusive.
// Policy whitespace: the class is the built-in \s, which is the definition
// the prompt gives, so tabs and newlines count as well as spaces.
// Strings are immutable in JavaScript, so the input cannot be disturbed.
function solve(input) {
  const runPattern = /\s+/g;
  const runs = [];
  for (const match of input.matchAll(runPattern)) {
    runs.push({
      start: match.index,
      end: match.index + match[0].length,
      text: match[0],
    });
  }
  return runs;
}
module.exports=solve;
