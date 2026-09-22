'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
assert.deepEqual(solve('age',1),{event:'ageChanged',value:1});assert.deepEqual(solve('name','v1'),{event:'nameChanged',value:'v1'});assert.deepEqual(solve('enabled',false),{event:'enabledChanged',value:false});assert.deepEqual(solve('name',''),{event:'nameChanged',value:''});assert.deepEqual(solve('age',0),{event:'ageChanged',value:0});
};
