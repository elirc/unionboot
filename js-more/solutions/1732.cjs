// 1732 Ranked trie autocomplete / scenario 4 — rank=shortest; limit=4
// Prompt: ../prompts/1732.txt
'use strict';
const cfg={"rank":"shortest","limit":4};
// Why this works:
// A trie stores one node per distinct prefix; children live in a Map so every
// character is a literal key. The node reached by the last character of a word
// carries a terminal record {word, score, index}, where index is the word's
// position in input.words. The index is captured during insertion because the
// trie itself no longer knows the original input order, and rank 'recent' is
// defined as reverse input position.
// Walking input.prefix character by character either lands on a node or falls
// off the trie; falling off means no word starts with that prefix, so the answer
// is []. An empty prefix lands on the root and therefore matches every word,
// including the empty word whose terminal sits on the root itself.
// The subtree below the landing node is collected with an explicit stack instead
// of recursion. Collection order does not matter: the result is sorted straight
// afterwards.
// cfg.rank selects the primary comparator and every rank falls through to
// code-unit order on the word, so the ordering is total. cfg.limit caps the
// output with slice, which returns a new array and leaves the input untouched.
function trie(input) {
  const root = {children: new Map(), terminal: null};
  input.words.forEach((row, index) => {
    let node = root;
    for (const ch of row.word) {
      if (!node.children.has(ch)) {
        node.children.set(ch, {children: new Map(), terminal: null});
      }
      node = node.children.get(ch);
    }
    node.terminal = {...row, index};
  });
  let node = root;
  for (const ch of input.prefix) {
    node = node.children.get(ch);
    if (!node) return [];
  }
  const found = [];
  const stack = [node];
  while (stack.length) {
    const current = stack.pop();
    if (current.terminal) found.push(current.terminal);
    for (const child of current.children.values()) stack.push(child);
  }
  const lexical = (left, right) => (left.word < right.word ? -1 : left.word > right.word ? 1 : 0);
  const primary = (left, right) =>
    cfg.rank === 'score' ? right.score - left.score :
    cfg.rank === 'shortest' ? left.word.length - right.word.length :
    cfg.rank === 'longest' ? right.word.length - left.word.length :
    cfg.rank === 'recent' ? right.index - left.index :
    0;
  found.sort((left, right) => primary(left, right) || lexical(left, right));
  return found.slice(0, cfg.limit).map(entry => entry.word);
}
module.exports=trie;
