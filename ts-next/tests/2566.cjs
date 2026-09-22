'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const renderer=solve(),row=Object.freeze({"name":"Ada","active":true,"tags":["a","b"]});assert.equal(renderer.render(row),"\"Ada\",true,[\"a\",\"b\"]");assert.deepEqual(renderer.renderAll([row,row]),["\"Ada\",true,[\"a\",\"b\"]","\"Ada\",true,[\"a\",\"b\"]"]);assert.deepEqual(renderer.renderAll([]),[]);assert.notEqual(renderer,solve());
};
