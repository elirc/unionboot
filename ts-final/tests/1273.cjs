'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const payload={id:'r9'};const calls=[];assert.equal(solve('saved',payload,(...args)=>calls.push(args)),undefined);assert.equal(calls.length,1);assert.equal(calls[0][0],'saved');assert.equal(calls[0][1],payload);solve('progress',{completed:9,total:20},(event,p)=>{assert.equal(event,'progress');assert.equal(p.completed,9);});solve('closed',undefined,(event,p)=>{assert.equal(event,'closed');assert.equal(p,undefined);});assert.throws(()=>solve('closed',undefined,()=>{throw Error('send');}),/send/);
};
