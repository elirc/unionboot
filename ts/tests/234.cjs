const assert=require('node:assert/strict');module.exports=solve=>{
{const input=[1,2,3];const before=structuredClone(input);assert.deepEqual(solve(input,"10-0"),{"policy":"10-0","result":[1,2,3]});assert.deepEqual(input,before,'Input must not mutate');}
{const input=[0,1];const before=structuredClone(input);assert.deepEqual(solve(input,"10-0"),{"policy":"10-0","result":[0,1]});assert.deepEqual(input,before,'Input must not mutate');}
{const input=[-1,0,1];const before=structuredClone(input);assert.deepEqual(solve(input,"10-0"),{"policy":"10-0","result":[0,1]});assert.deepEqual(input,before,'Input must not mutate');}
};
