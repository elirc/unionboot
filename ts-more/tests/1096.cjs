'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const settings=Object.freeze({name:'v12',retries:12,enabled:true});const patch=Object.freeze({retries:0,enabled:false});assert.deepEqual(solve(settings,patch),{name:'v12',retries:0,enabled:false});assert.deepEqual(solve(settings,{name:''}),{name:'',retries:12,enabled:true});const out=solve(settings,{});assert.deepEqual(out,settings);assert.notEqual(out,settings);assert.deepEqual(patch,{retries:0,enabled:false});assert.deepEqual(settings,{name:'v12',retries:12,enabled:true});
};
