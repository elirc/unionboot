'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const p=Object.freeze({"p1":"v 1","p2":"v 2","p3":"v 3","p4":"v 4","p5":"v 5","p6":"v 6","p7":"v 7","p8":"v 8","p9":"v 9","p10":"v 10","p11":"v 11","p12":"v 12"});assert.equal(solve(p),"/users/v%201/v%202/v%203/v%204/v%205/v%206/v%207/v%208/v%209/v%2010/v%2011/v%2012");assert.deepEqual(p,{"p1":"v 1","p2":"v 2","p3":"v 3","p4":"v 4","p5":"v 5","p6":"v 6","p7":"v 7","p8":"v 8","p9":"v 9","p10":"v 10","p11":"v 11","p12":"v 12"});assert.equal(solve({...p,p1:'/a?b'}).split('/')[2],'%2Fa%3Fb');assert.equal(solve({...p,p1:''}).split('/')[2],'');
};
