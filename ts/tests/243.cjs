const assert=require('node:assert/strict');module.exports=solve=>{
{const input=[100,200,300];const before=structuredClone(input);assert.deepEqual(solve(input,"11-4"),{"policy":"11-4","result":[{"input":100,"total":100},{"input":200,"total":300},{"input":300,"total":600}]});assert.deepEqual(input,before,'Input must not mutate');}
{const input=[0,1];const before=structuredClone(input);assert.deepEqual(solve(input,"11-4"),{"policy":"11-4","result":[{"input":0,"total":0},{"input":1,"total":1}]});assert.deepEqual(input,before,'Input must not mutate');}
{const input=[-1,0,1];const before=structuredClone(input);assert.deepEqual(solve(input,"11-4"),{"policy":"11-4","result":[{"input":-1,"total":-1},{"input":0,"total":-1},{"input":1,"total":0}]});assert.deepEqual(input,before,'Input must not mutate');}
};
