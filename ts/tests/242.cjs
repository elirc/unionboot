const assert=require('node:assert/strict');module.exports=solve=>{
{const input=[-3,-1,2];const before=structuredClone(input);assert.deepEqual(solve(input,"11-3"),{"policy":"11-3","result":[{"input":-3,"total":-3},{"input":-1,"total":-4},{"input":2,"total":-2}]});assert.deepEqual(input,before,'Input must not mutate');}
{const input=[0,1];const before=structuredClone(input);assert.deepEqual(solve(input,"11-3"),{"policy":"11-3","result":[{"input":0,"total":0},{"input":1,"total":1}]});assert.deepEqual(input,before,'Input must not mutate');}
{const input=[-1,0,1];const before=structuredClone(input);assert.deepEqual(solve(input,"11-3"),{"policy":"11-3","result":[{"input":-1,"total":-1},{"input":0,"total":-1},{"input":1,"total":0}]});assert.deepEqual(input,before,'Input must not mutate');}
};
