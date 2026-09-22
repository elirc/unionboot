// 1923 Segment-tree extrema / scenario 5 — extreme=min; tie=first; output=index
// Prompt: ../prompts/1923.txt
'use strict';
const cfg={"extreme":"min","tie":"first","output":"index"};
function segmentTree(input) {
  const values=[...input.values];let size=1;while(size<values.length)size*=2;
  const tree=Array(size*2).fill(null);
  const merge=(a,b)=>{if(a===null)return b;if(b===null)return a;if(a.value!==b.value)return (cfg.extreme==='min'?a.value<b.value:a.value>b.value)?a:b;return (cfg.tie==='first'?a.index<b.index:a.index>b.index)?a:b;};
  values.forEach((value,index)=>{tree[size+index]={value,index};});
  for(let i=size-1;i>0;i--)tree[i]=merge(tree[2*i],tree[2*i+1]);
  const answers=[];
  for(const op of input.ops){
    if(op.type==='set'){
      if(!Number.isInteger(op.index)||op.index<0||op.index>=values.length)throw new RangeError('Index');
      values[op.index]=op.value;let at=size+op.index;tree[at]={value:op.value,index:op.index};
      while(at>1){at>>=1;tree[at]=merge(tree[at*2],tree[at*2+1]);}
    }else if(op.type==='query'){
      if(!Number.isInteger(op.start)||!Number.isInteger(op.end)||op.start<0||op.end<op.start||op.end>values.length)throw new RangeError('Range');
      let l=size+op.start,r=size+op.end,result=null;
      while(l<r){if(l%2)result=merge(result,tree[l++]);if(r%2)result=merge(result,tree[--r]);l>>=1;r>>=1;}
      answers.push(result===null?null:cfg.output==='index'?result.index:cfg.output==='value'?result.value:result);
    }else throw new Error('Unknown operation');
  }
  return answers;
}
module.exports=segmentTree;
