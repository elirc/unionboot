// 1905 Bloom membership bitsets / scenario 7 — bits=23; hashes=2
// Prompt: ../prompts/1905.txt
'use strict';
const cfg={"bits":23,"hashes":2};
function bloom(input) {
  const bits=Array(cfg.bits).fill(0), answers=[];
  function positions(s){let a=0,b=0;for(const ch of s){a=(a*31+ch.charCodeAt(0))%cfg.bits;b=(b*17+ch.charCodeAt(0)+1)%cfg.bits;}return Array.from({length:cfg.hashes},(_,i)=>(a+i*(b||1))%cfg.bits);}
  for(const op of input){const indexes=positions(op.value);if(op.type==='add')for(const i of indexes)bits[i]=1;else if(op.type==='has')answers.push(indexes.every(i=>bits[i]));else throw new Error('Unknown operation');}
  return {answers,bits:bits.join('')};
}
module.exports=bloom;
