'use strict';
const assert=require('node:assert/strict');
module.exports=solve=>{
assert.deepEqual(solve({'a/b':1,'~':true},{'a/b':2}),[{op:'replace',path:'/a~1b',value:2},{op:'remove',path:'/~0'}]);
 assert.deepEqual(solve(null,{a:1}),[{op:'replace',path:'',value:{a:1}}]);
 assert.deepEqual(solve([{a:1,b:2}],[{b:2,a:1}]),[]);
 assert.deepEqual(solve([1],[1,2]),[{op:'replace',path:'',value:[1,2]}]);
 assert.deepEqual(solve({z:1},{a:2}),[{op:'add',path:'/a',value:2},{op:'remove',path:'/z'}]);
 const before=Object.freeze({x:Object.freeze({a:1})}),after={x:{a:2},n:{v:[1]}};
 const out=solve(before,after);assert.deepEqual(out,[{op:'add',path:'/n',value:{v:[1]}},{op:'replace',path:'/x/a',value:2}]);
 out[0].value.v.push(2);assert.deepEqual(after.n.v,[1]);
 assert.deepEqual(solve({'':1},{'':2}),[{op:'replace',path:'/',value:2}]);
};
