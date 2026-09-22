const assert=require('node:assert/strict');module.exports=solve=>{
{const input={"values":[],"step":2};const before=structuredClone(input);assert.deepEqual(solve(input),[]);assert.deepEqual(input,before,'Input must not mutate');}
{const input={"values":[-3,-1,1,3],"step":2};const before=structuredClone(input);assert.deepEqual(solve(input),[-2,0,2,4]);assert.deepEqual(input,before,'Input must not mutate');}
{const input={"values":[1],"step":0};const before=structuredClone(input);assert.throws(()=>solve(input),e=>e instanceof Error&&e.message==="Invalid step");assert.deepEqual(input,before,'Input must not mutate');}
};
