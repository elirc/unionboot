'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const state=Object.freeze({value:9,history:Object.freeze([9])}); assert.deepEqual(solve(state,{type:'add',amount:2}),{value:11,history:[9,11]}); assert.deepEqual(solve(state,{type:'multiply',factor:-1}),{value:-9,history:[9,-9]}); assert.deepEqual(solve(state,{type:'reset'}),{value:0,history:[9,0]}); assert.deepEqual(state,{value:9,history:[9]}); const result=solve(state,{type:'add',amount:0}); assert.notEqual(result,state);assert.notEqual(result.history,state.history);
};
