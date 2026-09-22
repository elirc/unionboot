'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
assert.deepEqual(solve('usr_3'),{ok:true,value:'usr_3'});assert.deepEqual(solve('usr_99999999999999999999'),{ok:true,value:'usr_99999999999999999999'});for(const value of ['usr_0','usr_01','usr_-1','usr_1.2',' usr_1','usr_1\n','item_1',null,1,{}])assert.deepEqual(solve(value),{ok:false,error:'invalid-id'});
};
