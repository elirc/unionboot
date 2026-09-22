'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
assert.equal(solve({"name1":"N1","name2":"N2","name3":"N3","name4":"N4","name5":"N5","name6":"N6","name7":"N7","name8":"N8","name9":"N9","name10":"N10","name11":"N11","name12":"N12"}),"Hello N1, N2, N3, N4, N5, N6, N7, N8, N9, N10, N11, N12! N1");const alt={...{"name1":"N1","name2":"N2","name3":"N3","name4":"N4","name5":"N5","name6":"N6","name7":"N7","name8":"N8","name9":"N9","name10":"N10","name11":"N11","name12":"N12"},name1:'{name1}'};assert.equal(solve(alt),"Hello {name1}, N2, N3, N4, N5, N6, N7, N8, N9, N10, N11, N12! {name1}");assert.equal(solve({...{"name1":"N1","name2":"N2","name3":"N3","name4":"N4","name5":"N5","name6":"N6","name7":"N7","name8":"N8","name9":"N9","name10":"N10","name11":"N11","name12":"N12"},name1:''}).endsWith('! '),true);
};
