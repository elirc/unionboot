const assert=require('node:assert/strict');module.exports=solve=>{
{const input="Hello__WORLD 42";const before=structuredClone(input);assert.deepEqual(solve(input),"hello_world_42");assert.deepEqual(input,before,'Input must not mutate');}
{const input="---";const before=structuredClone(input);assert.deepEqual(solve(input),"");assert.deepEqual(input,before,'Input must not mutate');}
{const input="x";const before=structuredClone(input);assert.deepEqual(solve(input),"x");assert.deepEqual(input,before,'Input must not mutate');}
};
