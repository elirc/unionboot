const assert=require('node:assert/strict');module.exports=solve=>{
{const input={"origin":[0,0],"points":[]};const before=structuredClone(input);assert.deepEqual(solve(input),-1);assert.deepEqual(input,before,'Input must not mutate');}
{const input={"origin":[0,0],"points":[[2,2],[3,0]]};const before=structuredClone(input);assert.deepEqual(solve(input),1);assert.deepEqual(input,before,'Input must not mutate');}
{const input={"origin":[1,1],"points":[[1,2],[2,1]]};const before=structuredClone(input);assert.deepEqual(solve(input),0);assert.deepEqual(input,before,'Input must not mutate');}
};
