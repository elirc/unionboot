'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
assert.equal(solve("s0",'advance'),"s1");assert.equal(solve("s1",'advance'),"s2");assert.equal(solve("s2",'advance'),"s3");assert.equal(solve("s3",'advance'),"s4");assert.equal(solve("s4",'advance'),"s5");assert.equal(solve("s5",'advance'),"s6");assert.equal(solve("s6",'advance'),"s7");assert.equal(solve("s7",'advance'),"s8");assert.equal(solve("s8",'advance'),"s9");assert.equal(solve("s9",'advance'),"s10");assert.equal(solve("s10",'advance'),"s11");assert.equal(solve("s11",'advance'),"s12");assert.equal(solve("s12",'advance'),"s13");assert.throws(()=>solve("s13",'advance'),/Terminal state/);assert.throws(()=>solve('s0','reset'),/Invalid event/);
};
