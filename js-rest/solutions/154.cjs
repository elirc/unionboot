// 154: Identifier conversion: camel
// Input string, tokenize maximal ASCII letter/digit runs, lowercase tokens, return camelCase identifier. Punctuation and whitespace separate tokens. Empty/no tokens returns ''. camel lowercases first token; pascal capitalizes every token.
// Tests: node js-rest/verify.cjs --id=154 [--starters]
// Study tests/154.cjs for examples.
// Why this works:
// Tokenizing first separates the two jobs. The regular expression collects
// maximal runs of ASCII letters and digits, so every other character acts as
// a separator and repeated separators collapse to nothing.
// String.prototype.match returns null when there is no match, so || [] turns
// that into an empty token list and the join below produces ''.
// Every token is lowercased first, which erases the original casing.
// Policy camel: the first token stays lowercase, every later token gets its
// first character upper-cased, and the tokens are joined with nothing.
function solve(input) {
  const matches = input.match(/[a-z0-9]+/gi) || [];
  const tokens = matches.map(token => token.toLowerCase());
  const capitalize = token => token[0].toUpperCase() + token.slice(1);
  return tokens.map((token, index) => (index === 0 ? token : capitalize(token))).join('');
}
module.exports=solve;
