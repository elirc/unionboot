'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const input={tags:Promise.resolve(["a","b"])};const out=await solve(input);assert.deepEqual(out,{"tags":{"status":"fulfilled","value":["a","b"]}});const reason={why:'offline'};const failed=await solve({...input,tags:Promise.reject(reason)});assert.equal(failed.tags.status,'rejected');assert.equal(failed.tags.reason,reason);assert.notEqual(out,await solve(input));
};
