const assert=require('node:assert/strict');module.exports=solve=>{
{const input=[-3,-1,2];const before=structuredClone(input);assert.deepEqual(solve(input,"18-3"),{"policy":"18-3","result":[{"value":-3},{"value":-1,"previous":-3},{"value":2,"previous":-1}]});assert.deepEqual(input,before,'Input must not mutate');}
{const input=[0,1];const before=structuredClone(input);assert.deepEqual(solve(input,"18-3"),{"policy":"18-3","result":[{"value":0},{"value":1,"previous":0}]});assert.deepEqual(input,before,'Input must not mutate');}
{const input=[-1,0,1];const before=structuredClone(input);assert.deepEqual(solve(input,"18-3"),{"policy":"18-3","result":[{"value":-1},{"value":0,"previous":-1},{"value":1,"previous":0}]});assert.deepEqual(input,before,'Input must not mutate');}
};
