const assert=require('node:assert/strict');module.exports=solve=>{
{const input={"nodes":["a","b","c","d"],"edges":[["a","b"],["b","b"],["a","b"]]};const before=structuredClone(input);assert.deepEqual(solve(input),["b"]);assert.deepEqual(input,before,'Input must not mutate');}
{const input={"nodes":[],"edges":[]};const before=structuredClone(input);assert.deepEqual(solve(input),[]);assert.deepEqual(input,before,'Input must not mutate');}
{const input={"nodes":["x"],"edges":[]};const before=structuredClone(input);assert.deepEqual(solve(input),[]);assert.deepEqual(input,before,'Input must not mutate');}
};
