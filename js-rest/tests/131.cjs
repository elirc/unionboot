const assert=require('node:assert/strict');module.exports=solve=>{
{const input=[];const before=structuredClone(input);assert.deepEqual(solve(input),null);assert.deepEqual(input,before,'Input must not mutate');}
{const input=[{"id":"a","score":1},{"id":"b","score":2}];const before=structuredClone(input);assert.deepEqual(solve(input),"b");assert.deepEqual(input,before,'Input must not mutate');}
{const input=[{"id":"a","score":2},{"id":"b","score":2}];const before=structuredClone(input);assert.throws(()=>solve(input),e=>e instanceof Error&&e.message==="Tied score");assert.deepEqual(input,before,'Input must not mutate');}
};
