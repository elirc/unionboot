'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const renderer=solve(),row=Object.freeze({"name":"Ada","tags":["a","b"]});assert.equal(renderer.render(row),"\"Ada\",[\"a\",\"b\"]");assert.deepEqual(renderer.renderAll([row,row]),["\"Ada\",[\"a\",\"b\"]","\"Ada\",[\"a\",\"b\"]"]);assert.deepEqual(renderer.renderAll([]),[]);assert.notEqual(renderer,solve());
};
