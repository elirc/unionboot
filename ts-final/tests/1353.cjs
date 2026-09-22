'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
assert.deepEqual(solve('age',14),{event:'ageChanged',value:14});assert.deepEqual(solve('name','v14'),{event:'nameChanged',value:'v14'});assert.deepEqual(solve('enabled',false),{event:'enabledChanged',value:false});assert.deepEqual(solve('name',''),{event:'nameChanged',value:''});assert.deepEqual(solve('age',0),{event:'ageChanged',value:0});
};
