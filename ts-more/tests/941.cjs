'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const xs=[-2,4,-6,8]; const rows=xs.map(value=>({ok:true,value})); rows.splice(1,0,{ok:false,error:'network'}); assert.deepEqual(solve(rows),{values:xs,errors:['network']}); assert.deepEqual(solve([]),{values:[],errors:[]}); assert.deepEqual(solve([{ok:true,value:0},{ok:false,error:''},{ok:true,value:undefined}]),{values:[0,undefined],errors:['']}); const error={code:2}; assert.equal(solve([{ok:false,error}]).errors[0],error);
};
