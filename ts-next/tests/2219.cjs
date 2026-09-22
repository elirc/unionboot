'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
assert.deepEqual(solve('a.b.png'),{"kind":"image","extension":"png","channels":4});assert.deepEqual(solve('a.b.mp3'),{"kind":"audio","extension":"mp3","sampleRate":44100});assert.deepEqual(solve('a.b.json'),{"kind":"data","extension":"json","structured":true});assert.throws(()=>solve('a.exe'),/Unsupported suffix/);assert.throws(()=>solve("ASSET.PNG"),/Unsupported suffix/);
};
