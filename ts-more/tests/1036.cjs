'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const state=Object.freeze({value:12,history:Object.freeze([12])}); assert.deepEqual(solve(state,{type:'add',amount:2}),{value:14,history:[12,14]}); assert.deepEqual(solve(state,{type:'multiply',factor:-1}),{value:-12,history:[12,-12]}); assert.deepEqual(solve(state,{type:'reset'}),{value:0,history:[12,0]}); assert.deepEqual(state,{value:12,history:[12]}); const result=solve(state,{type:'add',amount:0}); assert.notEqual(result,state);assert.notEqual(result.history,state.history);
};
