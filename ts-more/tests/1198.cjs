'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const xs=Object.freeze([1,100,1000]);const out=solve(xs);assert.equal([...out.values()].reduce((a,b)=>a+b,0),xs.length);for(const key of new Set(xs))assert.equal(out.get(key),xs.filter(x=>Object.is(x,key)).length);assert.deepEqual([...solve([])],[]);assert.deepEqual([...solve(['a','b','a'])],[['a',2],['b',1]]);const a={},b={};const objects=solve([a,b,a]);assert.equal(objects.get(a),2);assert.equal(objects.get(b),1);assert.equal(solve([NaN,NaN]).get(NaN),2);assert.equal(solve([0,-0]).get(0),2);
};
