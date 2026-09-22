// 152: Identifier conversion: kebab
// Input string, tokenize maximal ASCII letter/digit runs, lowercase tokens, return kebabCase identifier. Punctuation and whitespace separate tokens. Empty/no tokens returns ''. camel lowercases first token; pascal capitalizes every token.
// Tests: node js-rest/verify.cjs --id=152 [--starters]
// Study tests/152.cjs for examples.
// Why this works:
// Tokenizing first separates the two jobs. The regular expression collects
// maximal runs of ASCII letters and digits, so every other character acts as
// a separator and repeated separators collapse to nothing.
// String.prototype.match returns null when there is no match, so || [] turns
// that into an empty token list and the joins below produce ''.
// Every token is lowercased, which erases the original casing of the input.
// Policy kebab: the tokens are joined with '-'.
function solve(input) {
  const matches = input.match(/[a-z0-9]+/gi) || [];
  const tokens = matches.map(token => token.toLowerCase());
  return tokens.join('-');
}
module.exports=solve;
