const assert=require('node:assert/strict');module.exports=solve=>{
{const input=[100,200,300];const before=structuredClone(input);assert.deepEqual(solve(input,"7-4"),{"policy":"7-4","result":[100,200,300]});assert.deepEqual(input,before,'Input must not mutate');}
{const input=[0,1];const before=structuredClone(input);assert.deepEqual(solve(input,"7-4"),{"policy":"7-4","result":[0,1]});assert.deepEqual(input,before,'Input must not mutate');}
{const input=[-1,0,1];const before=structuredClone(input);assert.deepEqual(solve(input,"7-4"),{"policy":"7-4","result":[-1,0,1]});assert.deepEqual(input,before,'Input must not mutate');}
};
