// 1912 Fenwick point updates / scenario 4 — update=add; inclusive=true; output=sum
// Prompt: ../prompts/1912.txt
'use strict';
const cfg={"update":"add","inclusive":true,"output":"sum"};
function fenwick(input) {
  const nums=[...input.values],tree=Array(nums.length+1).fill(0),answers=[];
  const add=(at,value)=>{for(let i=at+1;i<tree.length;i+=i&-i)tree[i]+=value;};
  const sum=end=>{let total=0;for(let i=end;i>0;i-=i&-i)total+=tree[i];return total;};
  nums.forEach((x,i)=>add(i,x));
  for(const op of input.ops){
    if(op.type==='update'){
      if(!Number.isInteger(op.index)||op.index<0||op.index>=nums.length)throw new RangeError('Index');
      const next=cfg.update==='set'?op.value:nums[op.index]+op.value;add(op.index,next-nums[op.index]);nums[op.index]=next;
    }else if(op.type==='range'){
      const end=op.end+(cfg.inclusive?1:0);
      if(!Number.isInteger(op.start)||!Number.isInteger(end)||op.start<0||end<op.start||end>nums.length)throw new RangeError('Range');
      const value=sum(end)-sum(op.start);answers.push(cfg.output==='average'?(end===op.start?null:value/(end-op.start)):value);
    }else throw new Error('Unknown operation');
  }
  return {answers,values:nums};
}
module.exports=fenwick;
