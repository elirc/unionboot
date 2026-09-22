'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const input={active:Promise.resolve(true),tags:Promise.resolve(["a","b"])};const out=await solve(input);assert.deepEqual(out,{"active":{"status":"fulfilled","value":true},"tags":{"status":"fulfilled","value":["a","b"]}});const reason={why:'offline'};const failed=await solve({...input,active:Promise.reject(reason)});assert.equal(failed.active.status,'rejected');assert.equal(failed.active.reason,reason);assert.notEqual(out,await solve(input));
};
