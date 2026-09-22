'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const seen=[];const handlers={count:value=>{seen.push("count");return JSON.stringify(value);},tags:value=>{seen.push("tags");return JSON.stringify(value);}};assert.equal(solve({kind:"count",value:3},handlers),"3");assert.equal(solve({kind:"tags",value:["a","b"]},handlers),"[\"a\",\"b\"]");assert.deepEqual(seen,["count","tags"]);assert.throws(()=>solve({kind:"count",value:3},{...handlers,count:()=>{throw Error('handler');}}),/handler/);
};
