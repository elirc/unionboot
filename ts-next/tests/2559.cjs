'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const renderer=solve(),row=Object.freeze({"count":3,"active":true});assert.equal(renderer.render(row),"3,true");assert.deepEqual(renderer.renderAll([row,row]),["3,true","3,true"]);assert.deepEqual(renderer.renderAll([]),[]);assert.notEqual(renderer,solve());
};
