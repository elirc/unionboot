// 1722 LFU cache eviction / scenario 4 — capacity=3; tie=newest
// Prompt: ../prompts/1722.txt
'use strict';
const assert=require('node:assert/strict');
const cfg={"capacity":3,"tie":"newest"};
module.exports=async solve=>{
const eq=assert.equal,deep=assert.deepEqual;
function check(input,expected){const before=structuredClone(input);deep(solve(input),expected);deep(input,before,'Input must not mutate');}
check({ops:[]},{reads:[],entries:[]});
 function oracle(ops){let rows=[],tick=0,reads=[];for(const op of ops){let row=rows.find(x=>x.key===op.key);if(op.type==='get'){reads.push(row?row.value:null);if(row){row.f++;row.t=tick++;}}else if(row){row.value=op.value;row.f++;row.t=tick++;}else{if(rows.length===cfg.capacity){const f=Math.min(...rows.map(x=>x.f));const tied=rows.filter(x=>x.f===f);const victim=tied.reduce((a,b)=>(cfg.tie==='oldest'?a.t<b.t:a.t>b.t)?a:b);rows=rows.filter(x=>x!==victim);}rows.push({key:op.key,value:op.value,f:1,t:tick++});}}return {reads,entries:rows.sort((a,b)=>a.key<b.key?-1:1).map(x=>[x.key,x.value,x.f])};}
 const ops=[];for(let i=0;i<12;i++){ops.push({type:'put',key:String(i),value:i});if(i%3===0)ops.push({type:'get',key:String(i)});}ops.push({type:'put',key:'__proto__',value:false},{type:'get',key:'__proto__'},{type:'get',key:'missing'});check({ops},oracle(ops));
 check({ops:[{type:'put',key:'a',value:1},{type:'put',key:'a',value:2},{type:'get',key:'a'}]},{reads:[2],entries:[['a',2,3]]});
 assert.throws(()=>solve({ops:[{type:'bad'}]}),/Unknown operation/);
};
