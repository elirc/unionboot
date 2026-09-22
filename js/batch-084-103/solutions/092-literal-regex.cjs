// 92: Escape literal regex input
// Return a string that can be passed to new RegExp to match the input literally. Escape regular-expression metacharacters, including backslash. No regex flags are needed; slash is not special in the constructor.
// Hint: Iterating characters makes the escape list explicit.
// Test starter: node js/batch-084-103/verify.cjs --starters --id=92
'use strict';
// Why this works:
// new RegExp treats about a dozen characters as syntax. Putting a backslash in
// front of each of them makes the pattern match that character literally,
// which is the whole job here.
// The set is spelled out character by character rather than derived from a
// regular expression, so the escape list is visible in the source: the
// quantifier and anchor characters . * + ? ^ $, the grouping characters
// { } ( ) | [ ], and the backslash itself.
// The backslash is written as String.fromCharCode(92) so the character is
// unambiguous in source and inside the string literal.
// Iteration uses [...text], which walks code points rather than UTF-16 code
// units, so a character outside the Basic Multilingual Plane is not split in
// half.
// Slash is deliberately absent from the set: it only needs escaping inside
// /.../ literal syntax, not in the RegExp constructor, as the header notes.
function escapeRegex(text) {
  const backslash = String.fromCharCode(92);
  const special = new Set('.*+?^$' + '{}()|[]' + backslash);
  return [...text]
    .map((character) => (special.has(character) ? backslash + character : character))
    .join('');
}
module.exports = escapeRegex;
