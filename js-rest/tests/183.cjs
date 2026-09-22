const assert=require('node:assert/strict');module.exports=solve=>{
{const input={"a":"A b!","b":"ab"};const before=structuredClone(input);assert.deepEqual(solve(input),{"equal":true,"firstDifference":-1});assert.deepEqual(input,before,'Input must not mutate');}
{const input={"a":"x","b":"xy"};const before=structuredClone(input);assert.deepEqual(solve(input),{"equal":false,"firstDifference":1});assert.deepEqual(input,before,'Input must not mutate');}
{const input={"a":"","b":""};const before=structuredClone(input);assert.deepEqual(solve(input),{"equal":true,"firstDifference":-1});assert.deepEqual(input,before,'Input must not mutate');}
};
