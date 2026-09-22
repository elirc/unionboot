const assert=require('node:assert/strict');module.exports=solve=>{
{const input=[2,2,2];const before=structuredClone(input);assert.deepEqual(solve(input,"16-2"),{"policy":"16-2","result":[{"value":2,"parity":"even"},{"value":2,"parity":"even"},{"value":2,"parity":"even"}]});assert.deepEqual(input,before,'Input must not mutate');}
{const input=[0,1];const before=structuredClone(input);assert.deepEqual(solve(input,"16-2"),{"policy":"16-2","result":[{"value":0,"parity":"even"},{"value":1,"parity":"odd"}]});assert.deepEqual(input,before,'Input must not mutate');}
{const input=[-1,0,1];const before=structuredClone(input);assert.deepEqual(solve(input,"16-2"),{"policy":"16-2","result":[{"value":-1,"parity":"odd"},{"value":0,"parity":"even"},{"value":1,"parity":"odd"}]});assert.deepEqual(input,before,'Input must not mutate');}
};
