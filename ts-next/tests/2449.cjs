'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const input={next:Promise.resolve(7)};const out=await solve(input);assert.deepEqual(out,{"next":7});assert.notEqual(out,input);const reason=Error('leaf');await assert.rejects(solve({next:Promise.reject(reason)}),e=>e===reason);assert.deepEqual(await solve({next:Promise.resolve(0)}),{"next":0});
};
