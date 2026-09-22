const assert=require('node:assert/strict');module.exports=solve=>{
{const input=[];const before=structuredClone(input);assert.deepEqual(solve(input,"8-1"),{"policy":"8-1","result":[]});assert.deepEqual(input,before,'Input must not mutate');}
{const input=[0,1];const before=structuredClone(input);assert.deepEqual(solve(input,"8-1"),{"policy":"8-1","result":[[0,0],[1,1]]});assert.deepEqual(input,before,'Input must not mutate');}
{const input=[-1,0,1];const before=structuredClone(input);assert.deepEqual(solve(input,"8-1"),{"policy":"8-1","result":[[-1,-1],[0,0],[1,1]]});assert.deepEqual(input,before,'Input must not mutate');}
};
