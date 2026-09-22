'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
assert.equal(solve(...["item0",2,true,"item3",5,false,"item6",8,true,"item9",11,false,"item12",14,true]),"item0 | 2 | true | item3 | 5 | false | item6 | 8 | true | item9 | 11 | false | item12 | 14 | true");assert.equal(solve(...["",0,false,"",0,false,"",0,false,"",0,false,"",0,false])," | 0 | false |  | 0 | false |  | 0 | false |  | 0 | false |  | 0 | false");assert.equal(solve(...["item0",2,true,"item3",5,false,"item6",8,true,"item9",11,false,"item12",14,true]),solve(...["item0",2,true,"item3",5,false,"item6",8,true,"item9",11,false,"item12",14,true]));
};
