const assert=require('node:assert/strict');module.exports=solve=>{
{const input=[100,200,300];const before=structuredClone(input);assert.deepEqual(solve(input,"1-4"),{"policy":"1-4","result":[{"index":0,"value":100},{"index":1,"value":200},{"index":2,"value":300}]});assert.deepEqual(input,before,'Input must not mutate');}
{const input=[0,1];const before=structuredClone(input);assert.deepEqual(solve(input,"1-4"),{"policy":"1-4","result":[{"index":0,"value":0},{"index":1,"value":1}]});assert.deepEqual(input,before,'Input must not mutate');}
{const input=[-1,0,1];const before=structuredClone(input);assert.deepEqual(solve(input,"1-4"),{"policy":"1-4","result":[{"index":0,"value":-1},{"index":1,"value":0},{"index":2,"value":1}]});assert.deepEqual(input,before,'Input must not mutate');}
};
