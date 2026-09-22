'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const n=13; assert.equal(solve({kind:'circle',radius:n}),Math.PI*n**2); assert.equal(solve({kind:'rectangle',width:n,height:2}),n*2); assert.equal(solve({kind:'triangle',base:n,height:3}),n*1.5); assert.equal(solve({kind:'circle',radius:0}),0); assert.equal(solve({kind:'rectangle',width:0,height:9}),0); const shape=Object.freeze({kind:'triangle',base:4,height:2}); assert.equal(solve(shape),4);
};
