'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const state=Object.freeze({value:3,history:Object.freeze([3])}); assert.deepEqual(solve(state,{type:'add',amount:2}),{value:5,history:[3,5]}); assert.deepEqual(solve(state,{type:'multiply',factor:-1}),{value:-3,history:[3,-3]}); assert.deepEqual(solve(state,{type:'reset'}),{value:0,history:[3,0]}); assert.deepEqual(state,{value:3,history:[3]}); const result=solve(state,{type:'add',amount:0}); assert.notEqual(result,state);assert.notEqual(result.history,state.history);
};
