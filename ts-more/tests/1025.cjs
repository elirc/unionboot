'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const state=Object.freeze({value:1,history:Object.freeze([1])}); assert.deepEqual(solve(state,{type:'add',amount:2}),{value:3,history:[1,3]}); assert.deepEqual(solve(state,{type:'multiply',factor:-1}),{value:-1,history:[1,-1]}); assert.deepEqual(solve(state,{type:'reset'}),{value:0,history:[1,0]}); assert.deepEqual(state,{value:1,history:[1]}); const result=solve(state,{type:'add',amount:0}); assert.notEqual(result,state);assert.notEqual(result.history,state.history);
};
