'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
assert.equal(solve(...["item0",2,true,"item3",5,false,"item6",8,true,"item9",11,false]),"item0 | 2 | true | item3 | 5 | false | item6 | 8 | true | item9 | 11 | false");assert.equal(solve(...["",0,false,"",0,false,"",0,false,"",0,false])," | 0 | false |  | 0 | false |  | 0 | false |  | 0 | false");assert.equal(solve(...["item0",2,true,"item3",5,false,"item6",8,true,"item9",11,false]),solve(...["item0",2,true,"item3",5,false,"item6",8,true,"item9",11,false]));
};
