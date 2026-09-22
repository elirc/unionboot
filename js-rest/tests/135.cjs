const assert=require('node:assert/strict');module.exports=solve=>{
{const input="ab12 !?";const before=structuredClone(input);assert.deepEqual(solve(input),[{"start":5,"end":7,"text":"!?"}]);assert.deepEqual(input,before,'Input must not mutate');}
{const input="";const before=structuredClone(input);assert.deepEqual(solve(input),[]);assert.deepEqual(input,before,'Input must not mutate');}
{const input="x";const before=structuredClone(input);assert.deepEqual(solve(input),[]);assert.deepEqual(input,before,'Input must not mutate');}
};
