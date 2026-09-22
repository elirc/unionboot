'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const p=Object.freeze({"p1":"v 1"});assert.equal(solve(p),"/users/v%201");assert.deepEqual(p,{"p1":"v 1"});assert.equal(solve({...p,p1:'/a?b'}).split('/')[2],'%2Fa%3Fb');assert.equal(solve({...p,p1:''}).split('/')[2],'');
};
