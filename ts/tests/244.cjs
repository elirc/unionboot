const assert=require('node:assert/strict');module.exports=solve=>{
{const input=[1,2,3];const before=structuredClone(input);assert.deepEqual(solve(input,"12-0"),{"policy":"12-0","result":[[1,2,1],[2,3,1]]});assert.deepEqual(input,before,'Input must not mutate');}
{const input=[0,1];const before=structuredClone(input);assert.deepEqual(solve(input,"12-0"),{"policy":"12-0","result":[[0,1,1]]});assert.deepEqual(input,before,'Input must not mutate');}
{const input=[-1,0,1];const before=structuredClone(input);assert.deepEqual(solve(input,"12-0"),{"policy":"12-0","result":[[-1,0,1],[0,1,1]]});assert.deepEqual(input,before,'Input must not mutate');}
};
