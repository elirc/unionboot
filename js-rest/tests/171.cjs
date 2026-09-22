const assert=require('node:assert/strict');module.exports=solve=>{
{const input={"initial":2,"steps":[]};const before=structuredClone(input);assert.deepEqual(solve(input),{"value":2,"trace":[]});assert.deepEqual(input,before,'Input must not mutate');}
{const input={"initial":2,"steps":[{"type":"clamp","min":3,"max":5},{"type":"clamp","min":0,"max":1}]};const before=structuredClone(input);assert.deepEqual(solve(input),{"value":1,"trace":[3,1]});assert.deepEqual(input,before,'Input must not mutate');}
{const input={"initial":0,"steps":[{"type":"nope"}]};const before=structuredClone(input);assert.throws(()=>solve(input),e=>e instanceof Error&&e.message==="Unknown operation");assert.deepEqual(input,before,'Input must not mutate');}
};
