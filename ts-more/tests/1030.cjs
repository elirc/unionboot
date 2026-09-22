'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const state=Object.freeze({value:6,history:Object.freeze([6])}); assert.deepEqual(solve(state,{type:'add',amount:2}),{value:8,history:[6,8]}); assert.deepEqual(solve(state,{type:'multiply',factor:-1}),{value:-6,history:[6,-6]}); assert.deepEqual(solve(state,{type:'reset'}),{value:0,history:[6,0]}); assert.deepEqual(state,{value:6,history:[6]}); const result=solve(state,{type:'add',amount:0}); assert.notEqual(result,state);assert.notEqual(result.history,state.history);
};
