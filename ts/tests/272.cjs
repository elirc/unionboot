const assert=require('node:assert/strict');module.exports=solve=>{
{const input=[-3,-1,2];const before=structuredClone(input);assert.deepEqual(solve(input,"17-3"),{"policy":"17-3","result":[2,-1,-3]});assert.deepEqual(input,before,'Input must not mutate');}
{const input=[0,1];const before=structuredClone(input);assert.deepEqual(solve(input,"17-3"),{"policy":"17-3","result":[1,0]});assert.deepEqual(input,before,'Input must not mutate');}
{const input=[-1,0,1];const before=structuredClone(input);assert.deepEqual(solve(input,"17-3"),{"policy":"17-3","result":[1,0,-1]});assert.deepEqual(input,before,'Input must not mutate');}
};
