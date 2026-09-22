const assert=require('node:assert/strict');module.exports=solve=>{
{const input=[];const before=structuredClone(input);assert.deepEqual(solve(input),null);assert.deepEqual(input,before,'Input must not mutate');}
{const input=[30,0,20,10];const before=structuredClone(input);assert.deepEqual(solve(input),22.5);assert.deepEqual(input,before,'Input must not mutate');}
{const input=[4];const before=structuredClone(input);assert.deepEqual(solve(input),4);assert.deepEqual(input,before,'Input must not mutate');}
};
