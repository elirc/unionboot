const assert=require('node:assert/strict');module.exports=solve=>{
{const input=[-3,-1,2];const before=structuredClone(input);assert.deepEqual(solve(input,"14-3"),{"policy":"14-3","result":{"count":3,"empty":false}});assert.deepEqual(input,before,'Input must not mutate');}
{const input=[0,1];const before=structuredClone(input);assert.deepEqual(solve(input,"14-3"),{"policy":"14-3","result":{"count":2,"empty":false}});assert.deepEqual(input,before,'Input must not mutate');}
{const input=[-1,0,1];const before=structuredClone(input);assert.deepEqual(solve(input,"14-3"),{"policy":"14-3","result":{"count":3,"empty":false}});assert.deepEqual(input,before,'Input must not mutate');}
{const input=null;const before=structuredClone(input);assert.deepEqual(solve(input,"14-3"),{"policy":"14-3","result":{"count":0,"empty":true}});assert.deepEqual(input,before,'Input must not mutate');}
};
