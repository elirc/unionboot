'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const seen=[];const handlers={tags:value=>{seen.push("tags");return JSON.stringify(value);}};assert.equal(solve({kind:"tags",value:["a","b"]},handlers),"[\"a\",\"b\"]");assert.deepEqual(seen,["tags"]);assert.throws(()=>solve({kind:"tags",value:["a","b"]},{...handlers,tags:()=>{throw Error('handler');}}),/handler/);
};
