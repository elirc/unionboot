// 1781 KMP substring matches / scenario 3 — output=disjoint; fold=false
// Prompt: ../prompts/1781.txt
'use strict';
const cfg={"output":"disjoint","fold":false};
function kmp(input) {
  const text=cfg.fold?input.text.toLowerCase():input.text, pattern=cfg.fold?input.pattern.toLowerCase():input.pattern;
  let hits=[];
  if(!pattern.length)hits=Array.from({length:text.length+1},(_,i)=>i);
  else {
    const prefix=Array(pattern.length).fill(0);
    for(let i=1,j=0;i<pattern.length;i++){while(j&&pattern[i]!==pattern[j])j=prefix[j-1];if(pattern[i]===pattern[j])j++;prefix[i]=j;}
    for(let i=0,j=0;i<text.length;i++){
      while(j&&text[i]!==pattern[j])j=prefix[j-1];if(text[i]===pattern[j])j++;
      if(j===pattern.length){hits.push(i-j+1);j=cfg.output==='disjoint'?0:prefix[j-1];}
    }
  }
  if(cfg.output==='first')return hits[0]??-1;
  if(cfg.output==='last')return hits.at(-1)??-1;
  if(cfg.output==='count')return hits.length;
  return hits;
}
module.exports=kmp;
