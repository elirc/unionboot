'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
assert.equal(solve(...["item0",2,true,"item3",5,false,"item6",8]),"item0 | 2 | true | item3 | 5 | false | item6 | 8");assert.equal(solve(...["",0,false,"",0,false,"",0])," | 0 | false |  | 0 | false |  | 0");assert.equal(solve(...["item0",2,true,"item3",5,false,"item6",8]),solve(...["item0",2,true,"item3",5,false,"item6",8]));
};
