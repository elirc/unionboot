'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
assert.deepEqual(solve({name:'  User 3  ',age:3,extra:true}),{ok:true,value:{name:'User 3',age:3}}); assert.deepEqual(solve({name:'Ada'}),{ok:true,value:{name:'Ada'}}); assert.deepEqual(solve({name:' ' ,age:-1}),{ok:false,error:'name'}); for(const age of [undefined,-1,1.2,NaN,Infinity,'1']) assert.deepEqual(solve({name:'A',age}),{ok:false,error:'age'}); for(const x of [null,[],1]) assert.deepEqual(solve(x),{ok:false,error:'record'}); assert.deepEqual(solve(Object.create({name:'inherited'})),{ok:false,error:'name'});
};
