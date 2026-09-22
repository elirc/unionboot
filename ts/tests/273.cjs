const assert=require('node:assert/strict');module.exports=solve=>{
{const input=[100,200,300];const before=structuredClone(input);assert.deepEqual(solve(input,"17-4"),{"policy":"17-4","result":[300,200,100]});assert.deepEqual(input,before,'Input must not mutate');}
{const input=[0,1];const before=structuredClone(input);assert.deepEqual(solve(input,"17-4"),{"policy":"17-4","result":[1,0]});assert.deepEqual(input,before,'Input must not mutate');}
{const input=[-1,0,1];const before=structuredClone(input);assert.deepEqual(solve(input,"17-4"),{"policy":"17-4","result":[1,0,-1]});assert.deepEqual(input,before,'Input must not mutate');}
};
