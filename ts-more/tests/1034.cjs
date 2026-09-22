'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const state=Object.freeze({value:10,history:Object.freeze([10])}); assert.deepEqual(solve(state,{type:'add',amount:2}),{value:12,history:[10,12]}); assert.deepEqual(solve(state,{type:'multiply',factor:-1}),{value:-10,history:[10,-10]}); assert.deepEqual(solve(state,{type:'reset'}),{value:0,history:[10,0]}); assert.deepEqual(state,{value:10,history:[10]}); const result=solve(state,{type:'add',amount:0}); assert.notEqual(result,state);assert.notEqual(result.history,state.history);
};
