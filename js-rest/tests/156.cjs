const assert=require('node:assert/strict');module.exports=solve=>{
{const input=[1,2,0,3,-1,4,5,6];const before=structuredClone(input);assert.deepEqual(solve(input),{"start":5,"length":3});assert.deepEqual(input,before,'Input must not mutate');}
{const input=[];const before=structuredClone(input);assert.deepEqual(solve(input),null);assert.deepEqual(input,before,'Input must not mutate');}
{const input=[0,-2];const before=structuredClone(input);assert.deepEqual(solve(input),null);assert.deepEqual(input,before,'Input must not mutate');}
{const input=[1];const before=structuredClone(input);assert.deepEqual(solve(input),{"start":0,"length":1});assert.deepEqual(input,before,'Input must not mutate');}
};
