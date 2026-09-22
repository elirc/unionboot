// 153: Identifier conversion: snake
// Input string, tokenize maximal ASCII letter/digit runs, lowercase tokens, return snakeCase identifier. Punctuation and whitespace separate tokens. Empty/no tokens returns ''. camel lowercases first token; pascal capitalizes every token.
// Tests: node js-rest/verify.cjs --id=153 [--starters]
// Study tests/153.cjs for examples.
// Why this works:
// Tokenizing first separates the two jobs. The regular expression collects
// maximal runs of ASCII letters and digits, so every other character acts as
// a separator and repeated separators collapse to nothing.
// String.prototype.match returns null when there is no match, so || [] turns
// that into an empty token list and the joins below produce ''.
// Every token is lowercased, which erases the original casing of the input.
// Policy snake: the tokens are joined with '_'.
function solve(input) {
  const matches = input.match(/[a-z0-9]+/gi) || [];
  const tokens = matches.map(token => token.toLowerCase());
  return tokens.join('_');
}
module.exports=solve;
