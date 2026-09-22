'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const xs=Object.freeze([]); const out=solve(xs,x=>x<0?'negative':'other'); assert.deepEqual([...out.values()].flat().sort((a,b)=>a-b),[...xs].sort((a,b)=>a-b)); for(const [k,rows] of out) assert.ok(rows.every(x=>(x<0?'negative':'other')===k)); assert.equal(solve([],x=>x).size,0); const obj={}; const r=solve([1,2],()=>obj); assert.deepEqual(r.get(obj),[1,2]); assert.deepEqual(solve(['__proto__','__proto__'],x=>x).get('__proto__'),['__proto__','__proto__']);
};
