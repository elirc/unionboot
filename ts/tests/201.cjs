const assert=require('node:assert/strict');module.exports=solve=>{
{const input=[2,2,2];const before=structuredClone(input);assert.deepEqual(solve(input,"3-2"),{"policy":"3-2","result":2});assert.deepEqual(input,before,'Input must not mutate');}
{const input=[0,1];const before=structuredClone(input);assert.deepEqual(solve(input,"3-2"),{"policy":"3-2","result":0});assert.deepEqual(input,before,'Input must not mutate');}
{const input=[-1,0,1];const before=structuredClone(input);assert.deepEqual(solve(input,"3-2"),{"policy":"3-2","result":-1});assert.deepEqual(input,before,'Input must not mutate');}
};
