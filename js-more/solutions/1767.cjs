// 1767 Union-find components / scenario 9 — size=7; root=minimum
// Prompt: ../prompts/1767.txt
'use strict';
const cfg={"size":7,"root":"minimum"};
function unionFind(input) {
  const n=cfg.size, parent=Array.from({length:n},(_,i)=>i), answers=[];
  function find(x){let r=x;while(parent[r]!==r)r=parent[r];while(parent[x]!==x){const next=parent[x];parent[x]=r;x=next;}return r;}
  for(const op of input){
    if(!Number.isInteger(op.a)||op.a<0||op.a>=n||!Number.isInteger(op.b)||op.b<0||op.b>=n)throw new RangeError('Unknown node');
    const a=find(op.a),b=find(op.b);
    if(op.type==='union'){if(a!==b)parent[cfg.root==='minimum'?Math.max(a,b):Math.min(a,b)]=cfg.root==='minimum'?Math.min(a,b):Math.max(a,b);}
    else if(op.type==='same')answers.push(a===b);else throw new Error('Unknown operation');
  }
  const roots=parent.map((_,i)=>find(i));
  return {answers,roots,components:new Set(roots).size};
}
module.exports=unionFind;
