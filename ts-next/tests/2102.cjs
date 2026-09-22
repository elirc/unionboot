'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const input=Object.freeze([1,"v1",true,4,"v4",false,7,"v7",true,10,"v10",false,13,"v13"]);assert.deepEqual(solve(input),["v13",13,false,"v10",10,true,"v7",7,false,"v4",4,true,"v1",1]);assert.deepEqual(input,[1,"v1",true,4,"v4",false,7,"v7",true,10,"v10",false,13,"v13"]);assert.notEqual(solve(input),input);const alternate=input.map(x=>typeof x==='number'?-x:typeof x==='string'?'':!x);assert.deepEqual(solve(alternate),[...alternate].reverse());
};
