'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
assert.deepEqual(solve('a.b.png'),{"kind":"image","extension":"png","channels":4});assert.throws(()=>solve('a.exe'),/Unsupported suffix/);assert.throws(()=>solve("ASSET.PNG"),/Unsupported suffix/);
};
