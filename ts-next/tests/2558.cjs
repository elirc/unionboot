'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const renderer=solve(),row=Object.freeze({"name":"Ada","active":true});assert.equal(renderer.render(row),"\"Ada\",true");assert.deepEqual(renderer.renderAll([row,row]),["\"Ada\",true","\"Ada\",true"]);assert.deepEqual(renderer.renderAll([]),[]);assert.notEqual(renderer,solve());
};
