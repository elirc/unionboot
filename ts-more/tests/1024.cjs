'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const state=Object.freeze({value:0,history:Object.freeze([0])}); assert.deepEqual(solve(state,{type:'add',amount:2}),{value:2,history:[0,2]}); assert.deepEqual(solve(state,{type:'multiply',factor:-1}),{value:-0,history:[0,-0]}); assert.deepEqual(solve(state,{type:'reset'}),{value:0,history:[0,0]}); assert.deepEqual(state,{value:0,history:[0]}); const result=solve(state,{type:'add',amount:0}); assert.notEqual(result,state);assert.notEqual(result.history,state.history);
};
