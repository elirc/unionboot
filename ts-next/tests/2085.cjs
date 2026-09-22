'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const input=Object.freeze([1,2,3,4,5,6,7,8,9,10,11,12]); const out=solve(input); assert.deepEqual(out,[{"index":0,"value":1},{"index":1,"value":2},{"index":2,"value":3},{"index":3,"value":4},{"index":4,"value":5},{"index":5,"value":6},{"index":6,"value":7},{"index":7,"value":8},{"index":8,"value":9},{"index":9,"value":10},{"index":10,"value":11},{"index":11,"value":12}]); assert.deepEqual(input,[1,2,3,4,5,6,7,8,9,10,11,12]); assert.notEqual(out,input); assert.notEqual(out[0],solve(input)[0]);
};
