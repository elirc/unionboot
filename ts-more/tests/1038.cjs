'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const state=Object.freeze({value:14,history:Object.freeze([14])}); assert.deepEqual(solve(state,{type:'add',amount:2}),{value:16,history:[14,16]}); assert.deepEqual(solve(state,{type:'multiply',factor:-1}),{value:-14,history:[14,-14]}); assert.deepEqual(solve(state,{type:'reset'}),{value:0,history:[14,0]}); assert.deepEqual(state,{value:14,history:[14]}); const result=solve(state,{type:'add',amount:0}); assert.notEqual(result,state);assert.notEqual(result.history,state.history);
};
