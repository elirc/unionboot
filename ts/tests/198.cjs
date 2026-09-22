const assert=require('node:assert/strict');module.exports=solve=>{
{const input=[100,200,300];const before=structuredClone(input);assert.deepEqual(solve(input,"2-4"),{"policy":"2-4","result":[{"kind":"nonnegative","value":100},{"kind":"nonnegative","value":200},{"kind":"nonnegative","value":300}]});assert.deepEqual(input,before,'Input must not mutate');}
{const input=[0,1];const before=structuredClone(input);assert.deepEqual(solve(input,"2-4"),{"policy":"2-4","result":[{"kind":"nonnegative","value":0},{"kind":"nonnegative","value":1}]});assert.deepEqual(input,before,'Input must not mutate');}
{const input=[-1,0,1];const before=structuredClone(input);assert.deepEqual(solve(input,"2-4"),{"policy":"2-4","result":[{"kind":"negative","value":-1},{"kind":"nonnegative","value":0},{"kind":"nonnegative","value":1}]});assert.deepEqual(input,before,'Input must not mutate');}
};
