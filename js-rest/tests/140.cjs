const assert=require('node:assert/strict');module.exports=solve=>{
{const input={"a":[1,1,2],"b":[1,3,3]};const before=structuredClone(input);assert.deepEqual(solve(input),[1]);assert.deepEqual(input,before,'Input must not mutate');}
{const input={"a":[],"b":[]};const before=structuredClone(input);assert.deepEqual(solve(input),[]);assert.deepEqual(input,before,'Input must not mutate');}
{const input={"a":[4,4],"b":[4,4]};const before=structuredClone(input);assert.deepEqual(solve(input),[4,4]);assert.deepEqual(input,before,'Input must not mutate');}
};
