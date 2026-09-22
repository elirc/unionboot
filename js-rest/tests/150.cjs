const assert=require('node:assert/strict');module.exports=solve=>{
{const input={"start":1,"end":3,"values":[0,1,2,3,4]};const before=structuredClone(input);assert.deepEqual(solve(input),[1,2]);assert.deepEqual(input,before,'Input must not mutate');}
{const input={"start":2,"end":2,"values":[2]};const before=structuredClone(input);assert.deepEqual(solve(input),[]);assert.deepEqual(input,before,'Input must not mutate');}
{const input={"start":3,"end":1,"values":[]};const before=structuredClone(input);assert.throws(()=>solve(input),e=>e instanceof Error&&e.message==="Invalid interval");assert.deepEqual(input,before,'Input must not mutate');}
};
