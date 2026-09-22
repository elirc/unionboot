const assert=require('node:assert/strict');module.exports=solve=>{
{const input={"before":{"a":1,"b":2,"c":3},"after":{"a":1,"b":4,"d":5}};const before=structuredClone(input);assert.deepEqual(solve(input),["d"]);assert.deepEqual(input,before,'Input must not mutate');}
{const input={"before":{},"after":{}};const before=structuredClone(input);assert.deepEqual(solve(input),[]);assert.deepEqual(input,before,'Input must not mutate');}
{const input={"before":{"x":null},"after":{"x":null}};const before=structuredClone(input);assert.deepEqual(solve(input),[]);assert.deepEqual(input,before,'Input must not mutate');}
};
