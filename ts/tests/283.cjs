const assert=require('node:assert/strict');module.exports=solve=>{
{const input=[100,200,300];const before=structuredClone(input);assert.deepEqual(solve(input,"19-4"),{"policy":"19-4","result":[100,20000,6000000]});assert.deepEqual(input,before,'Input must not mutate');}
{const input=[0,1];const before=structuredClone(input);assert.deepEqual(solve(input,"19-4"),{"policy":"19-4","result":[0,0]});assert.deepEqual(input,before,'Input must not mutate');}
{const input=[-1,0,1];const before=structuredClone(input);assert.deepEqual(solve(input,"19-4"),{"policy":"19-4","result":[-1,-0,-0]});assert.deepEqual(input,before,'Input must not mutate');}
};
