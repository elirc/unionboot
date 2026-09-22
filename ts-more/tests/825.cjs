'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const xs=Object.freeze([1,2,3,4,5,6,7]), ys=Object.freeze(xs.map((_,i)=>'r'+i).slice(0,1)); assert.deepEqual(solve(xs,ys),ys.map((s,i)=>[xs[i],s])); assert.deepEqual(solve([],[1]),[]); assert.deepEqual(solve([1],[]),[]); assert.deepEqual(solve([1,2],['a']),[[1,'a']]); const x={x:1}; assert.equal(solve([x],[true])[0][0],x);
};
