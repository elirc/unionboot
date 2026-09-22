'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const state=Object.freeze({value:11,history:Object.freeze([11])}); assert.deepEqual(solve(state,{type:'add',amount:2}),{value:13,history:[11,13]}); assert.deepEqual(solve(state,{type:'multiply',factor:-1}),{value:-11,history:[11,-11]}); assert.deepEqual(solve(state,{type:'reset'}),{value:0,history:[11,0]}); assert.deepEqual(state,{value:11,history:[11]}); const result=solve(state,{type:'add',amount:0}); assert.notEqual(result,state);assert.notEqual(result.history,state.history);
};
