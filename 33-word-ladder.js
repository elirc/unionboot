// Exercise 33 — Word ladder (BFS over a graph) — the boss level
// A word ladder changes one letter at a time; every intermediate
// step must be a real word from the dictionary.
// Write ladderLength(begin, end, wordList) — the SHORTEST number of
// words in the ladder including begin and end. Return 0 if impossible.
//
// Classic case: "hit" → "hot" → "dot" → "dog" → "cog" = 5 words.
//
// Run with:  node 33-word-ladder.js

function ladderLength(begin, end, wordList) {
  // your code here
}

const dict = ["hot", "dot", "dog", "lot", "log", "cog"];
console.log(ladderLength("hit", "cog", dict)); // expected: 5
console.log(ladderLength("hit", "cog", ["hot", "dot", "dog", "lot", "log"])); // expected: 0
console.log(ladderLength("hit", "hit", ["hit"])); // expected: 1
