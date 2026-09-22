const assert=require('node:assert/strict');module.exports=solve=>{
{const input=[2,2,2];const before=structuredClone(input);assert.deepEqual(solve(input,"18-2"),{"policy":"18-2","result":[{"value":2},{"value":2,"previous":2},{"value":2,"previous":2}]});assert.deepEqual(input,before,'Input must not mutate');}
{const input=[0,1];const before=structuredClone(input);assert.deepEqual(solve(input,"18-2"),{"policy":"18-2","result":[{"value":0},{"value":1,"previous":0}]});assert.deepEqual(input,before,'Input must not mutate');}
{const input=[-1,0,1];const before=structuredClone(input);assert.deepEqual(solve(input,"18-2"),{"policy":"18-2","result":[{"value":-1},{"value":0,"previous":-1},{"value":1,"previous":0}]});assert.deepEqual(input,before,'Input must not mutate');}
};
