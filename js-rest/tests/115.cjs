const assert=require('node:assert/strict');module.exports=solve=>{
{const input=null;const before=structuredClone(input);assert.deepEqual(solve(input),null);assert.deepEqual(input,before,'Input must not mutate');}
{const input={"value":3,"children":[]};const before=structuredClone(input);assert.deepEqual(solve(input),3);assert.deepEqual(input,before,'Input must not mutate');}
{const input={"value":2,"children":[{"value":-1,"children":[]},{"value":7,"children":[]}]};const before=structuredClone(input);assert.deepEqual(solve(input),7);assert.deepEqual(input,before,'Input must not mutate');}
};
