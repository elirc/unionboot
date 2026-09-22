'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const a={...{"active":true},payload:{a:1}},b={...{"active":true},payload:{b:2}};const out=solve(Object.freeze([a,b]),1);assert.deepEqual(out,{items:[a],hasMore:true,next:{"active":true}});assert.equal(out.items[0],a);assert.deepEqual(solve([a],1),{items:[a],hasMore:false});assert.deepEqual(solve([],1),{items:[],hasMore:false});for(const limit of [0,-1,1.5,NaN])assert.throws(()=>solve([],limit),/Invalid limit/);
};
