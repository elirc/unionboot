const assert=require('node:assert/strict');module.exports=solve=>{
{const input=[];const before=structuredClone(input);assert.deepEqual(solve(input,"1-1"),{"policy":"1-1","result":[]});assert.deepEqual(input,before,'Input must not mutate');}
{const input=[0,1];const before=structuredClone(input);assert.deepEqual(solve(input,"1-1"),{"policy":"1-1","result":[{"index":0,"value":0},{"index":1,"value":1}]});assert.deepEqual(input,before,'Input must not mutate');}
{const input=[-1,0,1];const before=structuredClone(input);assert.deepEqual(solve(input,"1-1"),{"policy":"1-1","result":[{"index":0,"value":-1},{"index":1,"value":0},{"index":2,"value":1}]});assert.deepEqual(input,before,'Input must not mutate');}
};
