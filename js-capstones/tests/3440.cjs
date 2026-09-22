'use strict';
const assert=require('node:assert/strict');
module.exports=solve=>{
const a=Object.freeze({id:'a',revision:1,delta:5}),b=Object.freeze({id:'b',revision:2,delta:-3});
 assert.deepEqual(solve(10,Object.freeze([b,a,a])),{balance:12,revision:2,applied:['a','b']});
 assert.deepEqual(solve(0,[]),{balance:0,revision:0,applied:[]});
 assert.throws(()=>solve(0,[{id:'a',revision:2,delta:0}]));
 assert.throws(()=>solve(0,[a,{id:'b',revision:1,delta:0}]));
 assert.throws(()=>solve(0,[a,{id:'a',revision:1,delta:6}]));
 assert.throws(()=>solve(0,[{id:'a',revision:1,delta:-1},{id:'b',revision:2,delta:1}]));
 assert.throws(()=>solve(Number.MAX_SAFE_INTEGER,[a]));
 assert.throws(()=>solve(-1,[]));
 assert.throws(()=>solve(0,[{id:'',revision:1,delta:0}]));
 assert.throws(()=>solve(0,[{id:'x',revision:1,delta:0.5}]));
};
