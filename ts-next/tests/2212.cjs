'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
assert.deepEqual(solve('a.b.txt'),{"kind":"text","extension":"txt","encoding":"utf8"});assert.throws(()=>solve('a.exe'),/Unsupported suffix/);assert.throws(()=>solve("ASSET.TXT"),/Unsupported suffix/);
};
