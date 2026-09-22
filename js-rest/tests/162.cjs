const assert=require('node:assert/strict');module.exports=solve=>{
{const input=[[1,2,3],[4,5,6],[7,8,9]];const before=structuredClone(input);assert.deepEqual(solve(input),11);assert.deepEqual(input,before,'Input must not mutate');}
{const input=[];const before=structuredClone(input);assert.deepEqual(solve(input),0);assert.deepEqual(input,before,'Input must not mutate');}
{const input=[[7]];const before=structuredClone(input);assert.deepEqual(solve(input),0);assert.deepEqual(input,before,'Input must not mutate');}
{const input=[[1,2]];const before=structuredClone(input);assert.throws(()=>solve(input),e=>e instanceof Error&&e.message==="Not square");assert.deepEqual(input,before,'Input must not mutate');}
};
