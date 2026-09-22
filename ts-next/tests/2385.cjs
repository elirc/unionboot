'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const seen=[];const handlers={active:value=>{seen.push("active");return JSON.stringify(value);},tags:value=>{seen.push("tags");return JSON.stringify(value);}};assert.equal(solve({kind:"active",value:true},handlers),"true");assert.equal(solve({kind:"tags",value:["a","b"]},handlers),"[\"a\",\"b\"]");assert.deepEqual(seen,["active","tags"]);assert.throws(()=>solve({kind:"active",value:true},{...handlers,active:()=>{throw Error('handler');}}),/handler/);
};
