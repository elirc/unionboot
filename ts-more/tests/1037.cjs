'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const state=Object.freeze({value:13,history:Object.freeze([13])}); assert.deepEqual(solve(state,{type:'add',amount:2}),{value:15,history:[13,15]}); assert.deepEqual(solve(state,{type:'multiply',factor:-1}),{value:-13,history:[13,-13]}); assert.deepEqual(solve(state,{type:'reset'}),{value:0,history:[13,0]}); assert.deepEqual(state,{value:13,history:[13]}); const result=solve(state,{type:'add',amount:0}); assert.notEqual(result,state);assert.notEqual(result.history,state.history);
};
