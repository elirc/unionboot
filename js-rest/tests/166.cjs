const assert=require('node:assert/strict');module.exports=solve=>{
{const input=null;const before=structuredClone(input);assert.deepEqual(solve(input),[]);assert.deepEqual(input,before,'Input must not mutate');}
{const input={"label":"a","children":[{"label":"b","children":[{"label":"d","children":[]}]},{"label":"c","children":[]}]};const before=structuredClone(input);assert.deepEqual(solve(input),["a","b","c","d"]);assert.deepEqual(input,before,'Input must not mutate');}
{const input={"label":"x","children":[]};const before=structuredClone(input);assert.deepEqual(solve(input),["x"]);assert.deepEqual(input,before,'Input must not mutate');}
};
