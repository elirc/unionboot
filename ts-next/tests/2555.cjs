'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const renderer=solve(),row=Object.freeze({"count":3});assert.equal(renderer.render(row),"3");assert.deepEqual(renderer.renderAll([row,row]),["3","3"]);assert.deepEqual(renderer.renderAll([]),[]);assert.notEqual(renderer,solve());
};
