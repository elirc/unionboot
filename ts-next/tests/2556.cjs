'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const renderer=solve(),row=Object.freeze({"name":"Ada","count":3});assert.equal(renderer.render(row),"\"Ada\",3");assert.deepEqual(renderer.renderAll([row,row]),["\"Ada\",3","\"Ada\",3"]);assert.deepEqual(renderer.renderAll([]),[]);assert.notEqual(renderer,solve());
};
