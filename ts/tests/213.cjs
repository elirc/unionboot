const assert=require('node:assert/strict');module.exports=solve=>{
{const input=[100,200,300];const before=structuredClone(input);assert.deepEqual(solve(input,"5-4"),{"policy":"5-4","result":{"ok":true,"value":200}});assert.deepEqual(input,before,'Input must not mutate');}
{const input=[0,1];const before=structuredClone(input);assert.deepEqual(solve(input,"5-4"),{"policy":"5-4","result":{"ok":true,"value":0.5}});assert.deepEqual(input,before,'Input must not mutate');}
{const input=[-1,0,1];const before=structuredClone(input);assert.deepEqual(solve(input,"5-4"),{"policy":"5-4","result":{"ok":true,"value":0}});assert.deepEqual(input,before,'Input must not mutate');}
};
