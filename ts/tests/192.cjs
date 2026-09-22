const assert=require('node:assert/strict');module.exports=solve=>{
{const input=[-3,-1,2];const before=structuredClone(input);assert.deepEqual(solve(input,"1-3"),{"policy":"1-3","result":[{"index":0,"value":-3},{"index":1,"value":-1},{"index":2,"value":2}]});assert.deepEqual(input,before,'Input must not mutate');}
{const input=[0,1];const before=structuredClone(input);assert.deepEqual(solve(input,"1-3"),{"policy":"1-3","result":[{"index":0,"value":0},{"index":1,"value":1}]});assert.deepEqual(input,before,'Input must not mutate');}
{const input=[-1,0,1];const before=structuredClone(input);assert.deepEqual(solve(input,"1-3"),{"policy":"1-3","result":[{"index":0,"value":-1},{"index":1,"value":0},{"index":2,"value":1}]});assert.deepEqual(input,before,'Input must not mutate');}
};
