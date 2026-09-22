'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
assert.equal(solve({"name1":"N1","name2":"N2","name3":"N3","name4":"N4"}),"Hello N1, N2, N3, N4! N1");const alt={...{"name1":"N1","name2":"N2","name3":"N3","name4":"N4"},name1:'{name1}'};assert.equal(solve(alt),"Hello {name1}, N2, N3, N4! {name1}");assert.equal(solve({...{"name1":"N1","name2":"N2","name3":"N3","name4":"N4"},name1:''}).endsWith('! '),true);
};
