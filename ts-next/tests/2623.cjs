'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const input={count:Promise.resolve(3),tags:Promise.resolve(["a","b"])};const out=await solve(input);assert.deepEqual(out,{"count":{"status":"fulfilled","value":3},"tags":{"status":"fulfilled","value":["a","b"]}});const reason={why:'offline'};const failed=await solve({...input,count:Promise.reject(reason)});assert.equal(failed.count.status,'rejected');assert.equal(failed.count.reason,reason);assert.notEqual(out,await solve(input));
};
