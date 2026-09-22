const assert=require('node:assert/strict');module.exports=solve=>{
{const input={"initial":2,"steps":[]};const before=structuredClone(input);assert.deepEqual(solve(input),{"value":2,"trace":[]});assert.deepEqual(input,before,'Input must not mutate');}
{const input={"initial":2,"steps":[{"type":"power","value":3},{"type":"power","value":2}]};const before=structuredClone(input);assert.deepEqual(solve(input),{"value":64,"trace":[8,64]});assert.deepEqual(input,before,'Input must not mutate');}
{const input={"initial":0,"steps":[{"type":"nope"}]};const before=structuredClone(input);assert.throws(()=>solve(input),e=>e instanceof Error&&e.message==="Unknown operation");assert.deepEqual(input,before,'Input must not mutate');}
};
