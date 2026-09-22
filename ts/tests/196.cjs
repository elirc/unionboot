const assert=require('node:assert/strict');module.exports=solve=>{
{const input=[2,2,2];const before=structuredClone(input);assert.deepEqual(solve(input,"2-2"),{"policy":"2-2","result":[{"kind":"nonnegative","value":2},{"kind":"nonnegative","value":2},{"kind":"nonnegative","value":2}]});assert.deepEqual(input,before,'Input must not mutate');}
{const input=[0,1];const before=structuredClone(input);assert.deepEqual(solve(input,"2-2"),{"policy":"2-2","result":[{"kind":"nonnegative","value":0},{"kind":"nonnegative","value":1}]});assert.deepEqual(input,before,'Input must not mutate');}
{const input=[-1,0,1];const before=structuredClone(input);assert.deepEqual(solve(input,"2-2"),{"policy":"2-2","result":[{"kind":"negative","value":-1},{"kind":"nonnegative","value":0},{"kind":"nonnegative","value":1}]});assert.deepEqual(input,before,'Input must not mutate');}
};
