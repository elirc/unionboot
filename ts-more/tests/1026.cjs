'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const state=Object.freeze({value:2,history:Object.freeze([2])}); assert.deepEqual(solve(state,{type:'add',amount:2}),{value:4,history:[2,4]}); assert.deepEqual(solve(state,{type:'multiply',factor:-1}),{value:-2,history:[2,-2]}); assert.deepEqual(solve(state,{type:'reset'}),{value:0,history:[2,0]}); assert.deepEqual(state,{value:2,history:[2]}); const result=solve(state,{type:'add',amount:0}); assert.notEqual(result,state);assert.notEqual(result.history,state.history);
};
