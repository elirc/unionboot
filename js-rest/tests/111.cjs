const assert=require('node:assert/strict');module.exports=solve=>{
{const input={"left":[],"right":[]};const before=structuredClone(input);assert.deepEqual(solve(input),[]);assert.deepEqual(input,before,'Input must not mutate');}
{const input={"left":[{"id":1,"value":"a"},{"id":2,"value":"b"}],"right":[{"id":2,"value":"B"},{"id":3,"value":"C"}]};const before=structuredClone(input);assert.deepEqual(solve(input),[[1,"a"]]);assert.deepEqual(input,before,'Input must not mutate');}
{const input={"left":[],"right":[{"id":7,"value":"x"}]};const before=structuredClone(input);assert.deepEqual(solve(input),[]);assert.deepEqual(input,before,'Input must not mutate');}
};
