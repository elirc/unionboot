'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const renderer=solve(),row=Object.freeze({"name":"Ada","count":3,"active":true,"tags":["a","b"]});assert.equal(renderer.render(row),"\"Ada\",3,true,[\"a\",\"b\"]");assert.deepEqual(renderer.renderAll([row,row]),["\"Ada\",3,true,[\"a\",\"b\"]","\"Ada\",3,true,[\"a\",\"b\"]"]);assert.deepEqual(renderer.renderAll([]),[]);assert.notEqual(renderer,solve());
};
