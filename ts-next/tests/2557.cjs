'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const renderer=solve(),row=Object.freeze({"active":true});assert.equal(renderer.render(row),"true");assert.deepEqual(renderer.renderAll([row,row]),["true","true"]);assert.deepEqual(renderer.renderAll([]),[]);assert.notEqual(renderer,solve());
};
