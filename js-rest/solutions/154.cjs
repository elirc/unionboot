// 154: Identifier conversion: camel
// Input string, tokenize maximal ASCII letter/digit runs, lowercase tokens, return camelCase identifier. Punctuation and whitespace separate tokens. Empty/no tokens returns ''. camel lowercases first token; pascal capitalizes every token.
// Tests: node js-rest/verify.cjs --id=154 [--starters]
// Study tests/154.cjs for examples.
function solve(input) {
const tokens=(input.match(/[a-z0-9]+/gi)||[]).map(x=>x.toLowerCase());return tokens.map((w,i)=>i===0?w:w[0].toUpperCase()+w.slice(1)).join('');
}
module.exports=solve;
