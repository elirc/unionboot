'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
assert.equal(solve("a-b-b-b-b-b-b-b-b-b-b-b-b-b-b-b-b-b"),"aBBB-b-b-b-b-b-b-b-b-b-b-b-b-b-b");assert.equal(solve('hello-world'),'helloWorld');assert.equal(solve('end-'),'end');assert.equal(solve(''),'');assert.equal(solve('a--b'),'a-b');
};
