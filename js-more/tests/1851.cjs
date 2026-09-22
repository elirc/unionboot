// 1851 Persistent versioned stacks / scenario 3 — view=bottom; empty=empty
// Prompt: ../prompts/1851.txt
'use strict';
const assert=require('node:assert/strict');
const cfg={"view":"bottom","empty":"empty"};
module.exports=async solve=>{
const eq=assert.equal,deep=assert.deepEqual;
function check(input,expected){const before=structuredClone(input);deep(solve(input),expected);deep(input,before,'Input must not mutate');}
check([],{versions:1,queries:[]});const ops=[{type:'push',version:0,value:'a'},{type:'push',version:1,value:'b'},{type:'push',version:1,value:'branch'},{type:'push',version:2,value:'c'},{type:'pop',version:4},{type:'read',version:4},{type:'read',version:2},{type:'read',version:3},{type:'read',version:5},{type:'read',version:0}];const versions=[[]],queries=[];for(const op of ops){const a=versions[op.version];if(op.type==='push')versions.push([op.value,...a]);else if(op.type==='pop')versions.push(a.slice(1));else queries.push(cfg.view==='size'?a.length:cfg.view==='peek'?(a[0]??null):cfg.view==='bottom'?[...a].reverse():cfg.view==='last-two'?a.slice(0,2):a);}check(ops,{versions:versions.length,queries});if(cfg.empty==='error')assert.throws(()=>solve([{type:'pop',version:0}]),/Empty stack/);else check([{type:'pop',version:0}],{versions:2,queries:[]});assert.throws(()=>solve([{type:'read',version:9}]),/Unknown version/);
};
