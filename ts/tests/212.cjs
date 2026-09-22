const assert=require('node:assert/strict');module.exports=solve=>{
{const input=[-3,-1,2];const before=structuredClone(input);assert.deepEqual(solve(input,"5-3"),{"policy":"5-3","result":{"ok":true,"value":-0.6666666666666666}});assert.deepEqual(input,before,'Input must not mutate');}
{const input=[0,1];const before=structuredClone(input);assert.deepEqual(solve(input,"5-3"),{"policy":"5-3","result":{"ok":true,"value":0.5}});assert.deepEqual(input,before,'Input must not mutate');}
{const input=[-1,0,1];const before=structuredClone(input);assert.deepEqual(solve(input,"5-3"),{"policy":"5-3","result":{"ok":true,"value":0}});assert.deepEqual(input,before,'Input must not mutate');}
};
