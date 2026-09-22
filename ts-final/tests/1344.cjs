'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
assert.deepEqual(solve('age',5),{event:'ageChanged',value:5});assert.deepEqual(solve('name','v5'),{event:'nameChanged',value:'v5'});assert.deepEqual(solve('enabled',false),{event:'enabledChanged',value:false});assert.deepEqual(solve('name',''),{event:'nameChanged',value:''});assert.deepEqual(solve('age',0),{event:'ageChanged',value:0});
};
