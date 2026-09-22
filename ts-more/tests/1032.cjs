'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const state=Object.freeze({value:8,history:Object.freeze([8])}); assert.deepEqual(solve(state,{type:'add',amount:2}),{value:10,history:[8,10]}); assert.deepEqual(solve(state,{type:'multiply',factor:-1}),{value:-8,history:[8,-8]}); assert.deepEqual(solve(state,{type:'reset'}),{value:0,history:[8,0]}); assert.deepEqual(state,{value:8,history:[8]}); const result=solve(state,{type:'add',amount:0}); assert.notEqual(result,state);assert.notEqual(result.history,state.history);
};
