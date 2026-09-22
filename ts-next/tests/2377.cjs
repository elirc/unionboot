'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const seen=[];const handlers={active:value=>{seen.push("active");return JSON.stringify(value);}};assert.equal(solve({kind:"active",value:true},handlers),"true");assert.deepEqual(seen,["active"]);assert.throws(()=>solve({kind:"active",value:true},{...handlers,active:()=>{throw Error('handler');}}),/handler/);
};
