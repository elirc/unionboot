'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const state=Object.freeze({value:4,history:Object.freeze([4])}); assert.deepEqual(solve(state,{type:'add',amount:2}),{value:6,history:[4,6]}); assert.deepEqual(solve(state,{type:'multiply',factor:-1}),{value:-4,history:[4,-4]}); assert.deepEqual(solve(state,{type:'reset'}),{value:0,history:[4,0]}); assert.deepEqual(state,{value:4,history:[4]}); const result=solve(state,{type:'add',amount:0}); assert.notEqual(result,state);assert.notEqual(result.history,state.history);
};
