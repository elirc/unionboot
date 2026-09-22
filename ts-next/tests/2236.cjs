'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const input=Object.freeze({"v1":"a b1","v2":"a b2","v3":"a b3","v4":"a b4","v5":"a b5","v6":"a b6","v7":"a b7","v8":"a b8","v9":"a b9","v10":"a b10","v11":"a b11","v12":"a b12","v13":"a b13"});assert.equal(solve(input),"k1=a%20b1&k2=a%20b2&k3=a%20b3&k4=a%20b4&k5=a%20b5&k6=a%20b6&k7=a%20b7&k8=a%20b8&k9=a%20b9&k10=a%20b10&k11=a%20b11&k12=a%20b12&k13=a%20b13");assert.equal(solve({...input,v1:'=&?'}).split('&')[0],'k1=%3D%26%3F');assert.equal(solve({...input,v1:''}).split('&')[0],'k1=');assert.deepEqual(input,{"v1":"a b1","v2":"a b2","v3":"a b3","v4":"a b4","v5":"a b5","v6":"a b6","v7":"a b7","v8":"a b8","v9":"a b9","v10":"a b10","v11":"a b11","v12":"a b12","v13":"a b13"});
};
