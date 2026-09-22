const assert=require('node:assert/strict');module.exports=solve=>{
{const input=[1,2,3];const before=structuredClone(input);assert.deepEqual(solve(input,"16-0"),{"policy":"16-0","result":[{"value":1,"parity":"odd"},{"value":2,"parity":"even"},{"value":3,"parity":"odd"}]});assert.deepEqual(input,before,'Input must not mutate');}
{const input=[0,1];const before=structuredClone(input);assert.deepEqual(solve(input,"16-0"),{"policy":"16-0","result":[{"value":0,"parity":"even"},{"value":1,"parity":"odd"}]});assert.deepEqual(input,before,'Input must not mutate');}
{const input=[-1,0,1];const before=structuredClone(input);assert.deepEqual(solve(input,"16-0"),{"policy":"16-0","result":[{"value":-1,"parity":"odd"},{"value":0,"parity":"even"},{"value":1,"parity":"odd"}]});assert.deepEqual(input,before,'Input must not mutate');}
};
