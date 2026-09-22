'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const state=Object.freeze({value:5,history:Object.freeze([5])}); assert.deepEqual(solve(state,{type:'add',amount:2}),{value:7,history:[5,7]}); assert.deepEqual(solve(state,{type:'multiply',factor:-1}),{value:-5,history:[5,-5]}); assert.deepEqual(solve(state,{type:'reset'}),{value:0,history:[5,0]}); assert.deepEqual(state,{value:5,history:[5]}); const result=solve(state,{type:'add',amount:0}); assert.notEqual(result,state);assert.notEqual(result.history,state.history);
};
