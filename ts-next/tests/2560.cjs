'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const renderer=solve(),row=Object.freeze({"name":"Ada","count":3,"active":true});assert.equal(renderer.render(row),"\"Ada\",3,true");assert.deepEqual(renderer.renderAll([row,row]),["\"Ada\",3,true","\"Ada\",3,true"]);assert.deepEqual(renderer.renderAll([]),[]);assert.notEqual(renderer,solve());
};
