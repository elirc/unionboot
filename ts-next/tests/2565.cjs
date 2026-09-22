'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const renderer=solve(),row=Object.freeze({"active":true,"tags":["a","b"]});assert.equal(renderer.render(row),"true,[\"a\",\"b\"]");assert.deepEqual(renderer.renderAll([row,row]),["true,[\"a\",\"b\"]","true,[\"a\",\"b\"]"]);assert.deepEqual(renderer.renderAll([]),[]);assert.notEqual(renderer,solve());
};
