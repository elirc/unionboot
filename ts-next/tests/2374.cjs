'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const seen=[];const handlers={name:value=>{seen.push("name");return JSON.stringify(value);}};assert.equal(solve({kind:"name",value:"Ada"},handlers),"\"Ada\"");assert.deepEqual(seen,["name"]);assert.throws(()=>solve({kind:"name",value:"Ada"},{...handlers,name:()=>{throw Error('handler');}}),/handler/);
};
