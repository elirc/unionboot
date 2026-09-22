'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const input={name:Promise.resolve("Ada"),active:Promise.resolve(true)};const out=await solve(input);assert.deepEqual(out,{"name":{"status":"fulfilled","value":"Ada"},"active":{"status":"fulfilled","value":true}});const reason={why:'offline'};const failed=await solve({...input,name:Promise.reject(reason)});assert.equal(failed.name.status,'rejected');assert.equal(failed.name.reason,reason);assert.notEqual(out,await solve(input));
};
