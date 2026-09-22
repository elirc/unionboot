const assert=require('node:assert/strict');module.exports=solve=>{
{const input=[100,200,300];const before=structuredClone(input);assert.deepEqual(solve(input,"16-4"),{"policy":"16-4","result":[{"value":100,"parity":"even"},{"value":200,"parity":"even"},{"value":300,"parity":"even"}]});assert.deepEqual(input,before,'Input must not mutate');}
{const input=[0,1];const before=structuredClone(input);assert.deepEqual(solve(input,"16-4"),{"policy":"16-4","result":[{"value":0,"parity":"even"},{"value":1,"parity":"odd"}]});assert.deepEqual(input,before,'Input must not mutate');}
{const input=[-1,0,1];const before=structuredClone(input);assert.deepEqual(solve(input,"16-4"),{"policy":"16-4","result":[{"value":-1,"parity":"odd"},{"value":0,"parity":"even"},{"value":1,"parity":"odd"}]});assert.deepEqual(input,before,'Input must not mutate');}
};
