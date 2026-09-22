'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const p=Object.freeze({"p1":"v 1","p2":"v 2","p3":"v 3","p4":"v 4"});assert.equal(solve(p),"/users/v%201/v%202/v%203/v%204");assert.deepEqual(p,{"p1":"v 1","p2":"v 2","p3":"v 3","p4":"v 4"});assert.equal(solve({...p,p1:'/a?b'}).split('/')[2],'%2Fa%3Fb');assert.equal(solve({...p,p1:''}).split('/')[2],'');
};
