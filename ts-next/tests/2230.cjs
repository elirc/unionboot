'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const input=Object.freeze({"v1":"a b1","v2":"a b2","v3":"a b3","v4":"a b4","v5":"a b5","v6":"a b6","v7":"a b7"});assert.equal(solve(input),"k1=a%20b1&k2=a%20b2&k3=a%20b3&k4=a%20b4&k5=a%20b5&k6=a%20b6&k7=a%20b7");assert.equal(solve({...input,v1:'=&?'}).split('&')[0],'k1=%3D%26%3F');assert.equal(solve({...input,v1:''}).split('&')[0],'k1=');assert.deepEqual(input,{"v1":"a b1","v2":"a b2","v3":"a b3","v4":"a b4","v5":"a b5","v6":"a b6","v7":"a b7"});
};
