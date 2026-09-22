// 155: Identifier conversion: pascal
// Input string, tokenize maximal ASCII letter/digit runs, lowercase tokens, return pascalCase identifier. Punctuation and whitespace separate tokens. Empty/no tokens returns ''. camel lowercases first token; pascal capitalizes every token.
// Tests: node js-rest/verify.cjs --id=155 [--starters]
// Study tests/155.cjs for examples.
function solve(input) {
const tokens=(input.match(/[a-z0-9]+/gi)||[]).map(x=>x.toLowerCase());return tokens.map((w,i)=>w[0].toUpperCase()+w.slice(1)).join('');
}
module.exports=solve;
