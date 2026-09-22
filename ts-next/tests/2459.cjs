'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const input={next:{next:{next:{next:{next:{next:{next:{next:{next:{next:{next:Promise.resolve(7)}}}}}}}}}}};const out=await solve(input);assert.deepEqual(out,{"next":{"next":{"next":{"next":{"next":{"next":{"next":{"next":{"next":{"next":{"next":7}}}}}}}}}}});assert.notEqual(out,input);const reason=Error('leaf');await assert.rejects(solve({next:{next:{next:{next:{next:{next:{next:{next:{next:{next:{next:Promise.reject(reason)}}}}}}}}}}}),e=>e===reason);assert.deepEqual(await solve({next:{next:{next:{next:{next:{next:{next:{next:{next:{next:{next:Promise.resolve(0)}}}}}}}}}}}),{"next":{"next":{"next":{"next":{"next":{"next":{"next":{"next":{"next":{"next":{"next":0}}}}}}}}}}});
};
