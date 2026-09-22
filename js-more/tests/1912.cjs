// 1912 Fenwick point updates / scenario 4 — update=add; inclusive=true; output=sum
// Prompt: ../prompts/1912.txt
'use strict';
const assert=require('node:assert/strict');
const cfg={"update":"add","inclusive":true,"output":"sum"};
module.exports=async solve=>{
const eq=assert.equal,deep=assert.deepEqual;
function check(input,expected){const before=structuredClone(input);deep(solve(input),expected);deep(input,before,'Input must not mutate');}
const values=[2,4,6,8,10],ops=[{type:'range',start:0,end:3},{type:'update',index:1,value:3},{type:'range',start:1,end:3},{type:'update',index:4,value:-2},{type:'range',start:4,end:cfg.inclusive?4:5}];const a=values.map(x=>x+(cfg.initialOffset||0)),answers=[];for(const op of ops){if(op.type==='update')a[op.index]=cfg.update==='set'?op.value:a[op.index]+op.value;else{const range=a.slice(op.start,op.end+(cfg.inclusive?1:0)),sum=range.reduce((s,x)=>s+x,0);answers.push(cfg.output==='sum'?sum:range.length?sum/range.length:null);}}check({values,ops},{answers,values:a});check({values:[],ops:[]},{answers:[],values:[]});assert.throws(()=>solve({values:[1],ops:[{type:'update',index:1,value:2}]}),/Index/);assert.throws(()=>solve({values:[1],ops:[{type:'range',start:-1,end:0}]}),/Range/);
};
