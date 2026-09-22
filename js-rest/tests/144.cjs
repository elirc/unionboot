const assert=require('node:assert/strict');module.exports=solve=>{
{const input={"capacity":2,"events":[]};const before=structuredClone(input);assert.deepEqual(solve(input),[]);assert.deepEqual(input,before,'Input must not mutate');}
{const input={"capacity":2,"events":["a","b"]};const before=structuredClone(input);assert.deepEqual(solve(input),["a","b"]);assert.deepEqual(input,before,'Input must not mutate');}
{const input={"capacity":2,"events":["a","b","c"]};const before=structuredClone(input);assert.deepEqual(solve(input),["b","c"]);assert.deepEqual(input,before,'Input must not mutate');}
{const input={"capacity":0,"events":[]};const before=structuredClone(input);assert.throws(()=>solve(input),e=>e instanceof Error&&e.message==="Invalid capacity");assert.deepEqual(input,before,'Input must not mutate');}
};
