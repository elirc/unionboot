'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const xs=[7];const groups=Object.freeze([Object.freeze(xs.slice(0,2)),Object.freeze([]),Object.freeze(xs.slice(2))]);assert.deepEqual(solve(groups),xs);assert.deepEqual(solve([]),[]);assert.deepEqual(solve([[],[]]),[]);const obj={};assert.equal(solve([[obj]])[0],obj);const nested=[1,2];assert.equal(solve([[nested]])[0],nested);assert.deepEqual(solve([['a'],['b','b']]),['a','b','b']);
};
