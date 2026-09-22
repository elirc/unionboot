// 1800 Huffman prefix codes / scenario 2 — tie=ascending; output=table; zero=1
// Prompt: ../prompts/1800.txt
'use strict';
const cfg={"tie":"ascending","output":"table","zero":"1"};
function huffman(input) {
  const counts=new Map();for(const ch of input)counts.set(ch,(counts.get(ch)||0)+1);
  const queue=[...counts].map(([symbol,weight])=>({symbol,weight,key:symbol}));
  const compare=(a,b)=>a.weight-b.weight || (a.key<b.key?(cfg.tie==='ascending'?-1:1):a.key>b.key?(cfg.tie==='ascending'?1:-1):0);
  while(queue.length>1){queue.sort(compare);const left=queue.shift(),right=queue.shift();queue.push({left,right,weight:left.weight+right.weight,key:[...left.key+right.key].sort().join('')});}
  const table=new Map();
  function walk(n,bits){if(n.symbol!==undefined)table.set(n.symbol,bits||cfg.zero);else{walk(n.left,bits+cfg.zero);walk(n.right,bits+(cfg.zero==='0'?'1':'0'));}}
  if(queue.length)walk(queue[0],'');
  const codes=[...table].sort((a,b)=>a[0]<b[0]?-1:1),bits=[...input].map(c=>table.get(c)).join('');
  if(cfg.output==='table')return codes;
  if(cfg.output==='length')return cfg.unit==='bytes'?Math.ceil(bits.length/8):bits.length;
  return {codes,bits};
}
module.exports=huffman;
