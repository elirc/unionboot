const assert=require('node:assert/strict');module.exports=solve=>{
{const input=[100,200,300];const before=structuredClone(input);assert.deepEqual(solve(input,"18-4"),{"policy":"18-4","result":[{"value":100},{"value":200,"previous":100},{"value":300,"previous":200}]});assert.deepEqual(input,before,'Input must not mutate');}
{const input=[0,1];const before=structuredClone(input);assert.deepEqual(solve(input,"18-4"),{"policy":"18-4","result":[{"value":0},{"value":1,"previous":0}]});assert.deepEqual(input,before,'Input must not mutate');}
{const input=[-1,0,1];const before=structuredClone(input);assert.deepEqual(solve(input,"18-4"),{"policy":"18-4","result":[{"value":-1},{"value":0,"previous":-1},{"value":1,"previous":0}]});assert.deepEqual(input,before,'Input must not mutate');}
};
