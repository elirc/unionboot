// 1782 KMP substring matches / scenario 4 — output=disjoint; fold=true
// Prompt: ../prompts/1782.txt
'use strict';
const cfg={"output":"disjoint","fold":true};
// Why this works:
// Knuth-Morris-Pratt. The prefix array (the "failure function") holds, for every
// position i of the pattern, the length of the longest proper prefix of
// pattern[0..i] that is also a suffix of it. Building it is one pass over the
// pattern; searching is one pass over the text, and neither pass ever moves the
// text cursor backwards. That is the O(n+m) property the prompt asks for, and it
// is the reason the naive slice-and-compare loop in the test's oracle is not an
// acceptable answer here even though it agrees on every case.
// On a mismatch, j falls back to prefix[j-1] instead of restarting at 0: the
// characters already matched are re-used, because the failure function says how
// much of the pattern still lines up.
// On a full match the offset i-j+1 is recorded. cfg.output decides what happens
// to j next: 'disjoint' resets it to 0 so the consumed occurrence cannot overlap
// the following one, every other mode falls back to prefix[j-1] so overlapping
// occurrences are found.
// cfg.fold lower-cases both strings up front, which makes the search
// case-insensitive without touching input. An empty pattern matches at every
// boundary 0..text.length in every mode, so it is handled before the search.
// cfg.output finally projects the hit list: an array, the first or last index
// with -1 when there is none, or the count.
function kmp(input) {
  const text = cfg.fold ? input.text.toLowerCase() : input.text;
  const pattern = cfg.fold ? input.pattern.toLowerCase() : input.pattern;
  let hits = [];
  if (!pattern.length) {
    hits = Array.from({length: text.length + 1}, (_, i) => i);
  } else {
    const prefix = Array(pattern.length).fill(0);
    for (let i = 1, j = 0; i < pattern.length; i++) {
      while (j && pattern[i] !== pattern[j]) j = prefix[j - 1];
      if (pattern[i] === pattern[j]) j++;
      prefix[i] = j;
    }
    for (let i = 0, j = 0; i < text.length; i++) {
      while (j && text[i] !== pattern[j]) j = prefix[j - 1];
      if (text[i] === pattern[j]) j++;
      if (j === pattern.length) {
        hits.push(i - j + 1);
        j = cfg.output === 'disjoint' ? 0 : prefix[j - 1];
      }
    }
  }
  if (cfg.output === 'first') return hits[0] ?? -1;
  if (cfg.output === 'last') return hits.at(-1) ?? -1;
  if (cfg.output === 'count') return hits.length;
  return hits;
}
module.exports=kmp;
