'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const a={values:[10000,20000,30000]},b={label:'13'};const result=solve(a,b);assert.equal(result[0],a);assert.equal(result[1],b);assert.equal(result.length,2);assert.deepEqual(solve(0,false),[0,false]);assert.deepEqual(solve(null,undefined),[null,undefined]);assert.deepEqual(solve('a',13),['a',13]);
};
