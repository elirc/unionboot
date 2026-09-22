const assert=require('node:assert/strict');module.exports=solve=>{
{const input={"rows":[]};const before=structuredClone(input);assert.deepEqual(solve(input),[]);assert.deepEqual(input,before,'Input must not mutate');}
{const input={"rows":[{"id":"b","value":2},{"id":"a","value":1}]};const before=structuredClone(input);assert.deepEqual(solve(input),[["a",1],["b",2]]);assert.deepEqual(input,before,'Input must not mutate');}
{const input={"rows":[{"id":"a","value":1},{"id":"a","value":2}]};const before=structuredClone(input);assert.deepEqual(solve(input),[["a",2]]);assert.deepEqual(input,before,'Input must not mutate');}
};
