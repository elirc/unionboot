'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const seen=[];const handlers={name:value=>{seen.push("name");return JSON.stringify(value);},count:value=>{seen.push("count");return JSON.stringify(value);},active:value=>{seen.push("active");return JSON.stringify(value);}};assert.equal(solve({kind:"name",value:"Ada"},handlers),"\"Ada\"");assert.equal(solve({kind:"count",value:3},handlers),"3");assert.equal(solve({kind:"active",value:true},handlers),"true");assert.deepEqual(seen,["name","count","active"]);assert.throws(()=>solve({kind:"name",value:"Ada"},{...handlers,name:()=>{throw Error('handler');}}),/handler/);
};
