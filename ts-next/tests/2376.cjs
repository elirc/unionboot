'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const seen=[];const handlers={name:value=>{seen.push("name");return JSON.stringify(value);},count:value=>{seen.push("count");return JSON.stringify(value);}};assert.equal(solve({kind:"name",value:"Ada"},handlers),"\"Ada\"");assert.equal(solve({kind:"count",value:3},handlers),"3");assert.deepEqual(seen,["name","count"]);assert.throws(()=>solve({kind:"name",value:"Ada"},{...handlers,name:()=>{throw Error('handler');}}),/handler/);
};
