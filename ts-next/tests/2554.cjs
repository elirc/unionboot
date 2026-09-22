'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const renderer=solve(),row=Object.freeze({"name":"Ada"});assert.equal(renderer.render(row),"\"Ada\"");assert.deepEqual(renderer.renderAll([row,row]),["\"Ada\"","\"Ada\""]);assert.deepEqual(renderer.renderAll([]),[]);assert.notEqual(renderer,solve());
};
