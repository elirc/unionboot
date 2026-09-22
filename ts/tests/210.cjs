const assert=require('node:assert/strict');module.exports=solve=>{
{const input=[];const before=structuredClone(input);assert.deepEqual(solve(input,"5-1"),{"policy":"5-1","result":{"ok":false,"error":"empty"}});assert.deepEqual(input,before,'Input must not mutate');}
{const input=[0,1];const before=structuredClone(input);assert.deepEqual(solve(input,"5-1"),{"policy":"5-1","result":{"ok":true,"value":0.5}});assert.deepEqual(input,before,'Input must not mutate');}
{const input=[-1,0,1];const before=structuredClone(input);assert.deepEqual(solve(input,"5-1"),{"policy":"5-1","result":{"ok":true,"value":0}});assert.deepEqual(input,before,'Input must not mutate');}
};
