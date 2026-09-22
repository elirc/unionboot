// 1959 Polynomial convolution / scenario 1 — modulus=0; trim=false
// Prompt: ../prompts/1959.txt
'use strict';
const cfg={"modulus":0,"trim":false};
function polynomial(input) {
  const out=Array(Math.max(0,input.a.length+input.b.length-1)).fill(0);
  if(!input.a.length||!input.b.length)return [];
  for(let i=0;i<input.a.length;i++)for(let j=0;j<input.b.length;j++)out[i+j]+=input.a[i]*input.b[j];
  const reduced=out.map(x=>cfg.modulus?((x%cfg.modulus)+cfg.modulus)%cfg.modulus:x);
  if(cfg.trim)while(reduced.length&&reduced.at(-1)===0)reduced.pop();
  return reduced;
}
module.exports=polynomial;
