// 155: Identifier conversion: pascal
// Input string, tokenize maximal ASCII letter/digit runs, lowercase tokens, return pascalCase identifier. Punctuation and whitespace separate tokens. Empty/no tokens returns ''. camel lowercases first token; pascal capitalizes every token.
// Tests: node js-rest/verify.cjs --id=155 [--starters]
// Study tests/155.cjs for examples.
// Why this works:
// Tokenizing first separates the two jobs. The regular expression collects
// maximal runs of ASCII letters and digits, so every other character acts as
// a separator and repeated separators collapse to nothing.
// String.prototype.match returns null when there is no match, so || [] turns
// that into an empty token list and the join below produces ''.
// Every token is lowercased first, which erases the original casing.
// Policy pascal: every token, including the first, gets its first character
// upper-cased, and the tokens are joined with nothing.
function solve(input) {
  const matches = input.match(/[a-z0-9]+/gi) || [];
  const tokens = matches.map(token => token.toLowerCase());
  const capitalize = token => token[0].toUpperCase() + token.slice(1);
  return tokens.map(token => capitalize(token)).join('');
}
module.exports=solve;
