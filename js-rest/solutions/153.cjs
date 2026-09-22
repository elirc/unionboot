// 153: Identifier conversion: snake
// Input string, tokenize maximal ASCII letter/digit runs, lowercase tokens, return snakeCase identifier. Punctuation and whitespace separate tokens. Empty/no tokens returns ''. camel lowercases first token; pascal capitalizes every token.
// Tests: node js-rest/verify.cjs --id=153 [--starters]
// Study tests/153.cjs for examples.
function solve(input) {
const tokens=(input.match(/[a-z0-9]+/gi)||[]).map(x=>x.toLowerCase());return tokens.join('_');
}
module.exports=solve;
