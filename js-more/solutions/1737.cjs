// 1737 Ranked trie autocomplete / scenario 9 — rank=lexical; limit=2
// Prompt: ../prompts/1737.txt
'use strict';
const cfg={"rank":"lexical","limit":2};
function trie(input) {
  const root = {children:new Map(), terminal:null};
  input.words.forEach((row,index) => {
    let node = root;
    for (const ch of row.word) {
      if (!node.children.has(ch)) node.children.set(ch,{children:new Map(),terminal:null});
      node = node.children.get(ch);
    }
    node.terminal = {...row,index};
  });
  let node = root;
  for (const ch of input.prefix) { node = node.children.get(ch); if (!node) return []; }
  const found=[], stack=[node];
  while (stack.length) { const n=stack.pop(); if(n.terminal)found.push(n.terminal); for(const child of n.children.values())stack.push(child); }
  const lexical=(a,b)=>a.word<b.word?-1:a.word>b.word?1:0;
  found.sort((a,b)=> (cfg.rank==='score'?b.score-a.score:cfg.rank==='shortest'?a.word.length-b.word.length:
    cfg.rank==='longest'?b.word.length-a.word.length:cfg.rank==='recent'?b.index-a.index:0) || lexical(a,b));
  return found.slice(0,cfg.limit).map(x=>x.word);
}
module.exports=trie;
