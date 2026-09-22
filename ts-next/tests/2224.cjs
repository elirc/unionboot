'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const input=Object.freeze({"v1":"a b1"});assert.equal(solve(input),"k1=a%20b1");assert.equal(solve({...input,v1:'=&?'}).split('&')[0],'k1=%3D%26%3F');assert.equal(solve({...input,v1:''}).split('&')[0],'k1=');assert.deepEqual(input,{"v1":"a b1"});
};
