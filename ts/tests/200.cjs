const assert=require('node:assert/strict');module.exports=solve=>{
{const input=[];const before=structuredClone(input);assert.deepEqual(solve(input,"3-1"),{"policy":"3-1","result":undefined});assert.deepEqual(input,before,'Input must not mutate');}
{const input=[0,1];const before=structuredClone(input);assert.deepEqual(solve(input,"3-1"),{"policy":"3-1","result":0});assert.deepEqual(input,before,'Input must not mutate');}
{const input=[-1,0,1];const before=structuredClone(input);assert.deepEqual(solve(input,"3-1"),{"policy":"3-1","result":-1});assert.deepEqual(input,before,'Input must not mutate');}
};
