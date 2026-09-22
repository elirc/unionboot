const assert=require('node:assert/strict');module.exports=solve=>{
{const input="";const before=structuredClone(input);assert.deepEqual(solve(input),{"x":0,"y":0,"direction":"N"});assert.deepEqual(input,before,'Input must not mutate');}
{const input="FFRFL";const before=structuredClone(input);assert.deepEqual(solve(input),{"x":1,"y":2,"direction":"N"});assert.deepEqual(input,before,'Input must not mutate');}
{const input="FX";const before=structuredClone(input);assert.throws(()=>solve(input),e=>e instanceof Error&&e.message==="Invalid command");assert.deepEqual(input,before,'Input must not mutate');}
};
