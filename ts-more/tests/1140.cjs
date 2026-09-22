'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const a={values:[1,2,3,4,5,6,7]},b={label:'11'};const result=solve(a,b);assert.equal(result[0],a);assert.equal(result[1],b);assert.equal(result.length,2);assert.deepEqual(solve(0,false),[0,false]);assert.deepEqual(solve(null,undefined),[null,undefined]);assert.deepEqual(solve('a',11),['a',11]);
};
