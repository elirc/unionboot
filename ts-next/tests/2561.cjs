'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const renderer=solve(),row=Object.freeze({"tags":["a","b"]});assert.equal(renderer.render(row),"[\"a\",\"b\"]");assert.deepEqual(renderer.renderAll([row,row]),["[\"a\",\"b\"]","[\"a\",\"b\"]"]);assert.deepEqual(renderer.renderAll([]),[]);assert.notEqual(renderer,solve());
};
