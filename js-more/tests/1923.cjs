// 1923 Segment-tree extrema / scenario 5 — extreme=min; tie=first; output=index
// Prompt: ../prompts/1923.txt
'use strict';
const assert=require('node:assert/strict');
const cfg={"extreme":"min","tie":"first","output":"index"};
module.exports=async solve=>{
const eq=assert.equal,deep=assert.deepEqual;
function check(input,expected){const before=structuredClone(input);deep(solve(input),expected);deep(input,before,'Input must not mutate');}
const values=[4,1,7,1,7,3],ops=[{type:'query',start:0,end:6},{type:'query',start:1,end:4},{type:'set',index:1,value:9},{type:'query',start:0,end:6},{type:'set',index:2,value:9},{type:'query',start:0,end:6},{type:'query',start:2,end:2}];const a=[...values],answers=[];for(const op of ops){if(op.type==='set')a[op.index]=op.value;else{const range=a.slice(op.start,op.end);if(!range.length){answers.push(null);continue;}const value=cfg.extreme==='min'?Math.min(...range):Math.max(...range);const index=op.start+(cfg.tie==='last'?range.lastIndexOf(value):range.indexOf(value));answers.push(cfg.output==='value'?value:cfg.output==='index'?index:{value,index});}}check({values,ops},answers);check({values:[],ops:[]},[]);assert.throws(()=>solve({values:[],ops:[{type:'query',start:0,end:1}]}),/Range/);
};
