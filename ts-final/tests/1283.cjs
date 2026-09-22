'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const a={kind:'text',value:'v4'},b={kind:'count',value:4};const input=Object.freeze([a,b,a]);assert.deepEqual(solve(input,'text'),[a,a]);assert.equal(solve(input,'count')[0],b);assert.deepEqual(solve([],'text'),[]);assert.deepEqual(solve([a],'count'),[]);assert.equal(input.length,3);
};
