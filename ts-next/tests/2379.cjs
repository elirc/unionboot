'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const seen=[];const handlers={count:value=>{seen.push("count");return JSON.stringify(value);},active:value=>{seen.push("active");return JSON.stringify(value);}};assert.equal(solve({kind:"count",value:3},handlers),"3");assert.equal(solve({kind:"active",value:true},handlers),"true");assert.deepEqual(seen,["count","active"]);assert.throws(()=>solve({kind:"count",value:3},{...handlers,count:()=>{throw Error('handler');}}),/handler/);
};
