'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const pending=Array(2).fill(null).map(()=>new Promise(()=>{}));pending[0]=Promise.resolve(1);assert.deepEqual(await solve(pending),{index:0,value:1});const settled=[1,"v1"].map(Promise.resolve.bind(Promise));assert.deepEqual(await solve(settled),{index:0,value:1});const reason=Error('race');const bad=Array(2).fill(null).map(()=>new Promise(()=>{}));bad[0]=Promise.reject(reason);await assert.rejects(solve(bad),e=>e===reason);
};
