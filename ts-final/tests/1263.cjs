'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
assert.deepEqual(await solve([Promise.resolve(14),'x',true]),[14,'x',true]);assert.deepEqual(await solve([]),[]);const obj={};assert.equal((await solve([obj]))[0],obj);await assert.rejects(()=>solve([Promise.reject(Error('failed')),1]),/failed/);assert.deepEqual(await solve([{then:resolve=>resolve(3)},null]),[3,null]);
};
