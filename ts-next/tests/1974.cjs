'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
assert.equal(solve({"value":{"value":{"value":{"value":{"value":{"value":7}}}}}}),7); const deep={"value":{"value":{"value":{"value":{"value":{"value":{"value":7}}}}}}}; assert.equal(solve(deep),deep.value.value.value.value.value.value); assert.equal(solve(null),null); assert.equal(solve(false),false); const bare={other:1}; assert.equal(solve(bare),bare); assert.equal(solve({value:undefined}),undefined);
};
