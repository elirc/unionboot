'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const state=Object.freeze({value:7,history:Object.freeze([7])}); assert.deepEqual(solve(state,{type:'add',amount:2}),{value:9,history:[7,9]}); assert.deepEqual(solve(state,{type:'multiply',factor:-1}),{value:-7,history:[7,-7]}); assert.deepEqual(solve(state,{type:'reset'}),{value:0,history:[7,0]}); assert.deepEqual(state,{value:7,history:[7]}); const result=solve(state,{type:'add',amount:0}); assert.notEqual(result,state);assert.notEqual(result.history,state.history);
};
