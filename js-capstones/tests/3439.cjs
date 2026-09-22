'use strict';
const assert=require('node:assert/strict');
module.exports=solve=>{
assert.deepEqual(solve(Object.freeze({a:'old'}),Object.freeze({a:'new'}),Object.freeze({a:'old',b:'x'})),{value:{a:'new',b:'x'},conflicts:[]});
 assert.deepEqual(solve({a:'x',z:'x'},{z:'local'},{a:'remote',z:'remote'}),{value:{z:'local'},conflicts:['a','z']});
 assert.deepEqual(solve({a:'x'},{},{}),{value:{},conflicts:[]});
 assert.deepEqual(solve({}, {a:''},{a:''}),{value:{a:''},conflicts:[]});
 const special=JSON.parse('{"__proto__":"data","constructor":"ok"}');
 assert.deepEqual(solve({},special,{}),{value:special,conflicts:[]});
 assert.deepEqual(solve({a:'x'},{a:'x'},{}),{value:{},conflicts:[]});
};
