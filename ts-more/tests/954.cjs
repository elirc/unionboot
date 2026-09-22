'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const values=[0,1,0,-1]; const tree=Object.freeze({value:5,children:Object.freeze(values.map(value=>Object.freeze({value,children:Object.freeze([])})))}); const seen=[]; const out=solve(tree,x=>{seen.push(x);return String(x);}); assert.deepEqual(seen,[5,...values]); assert.equal(out.value,'5'); assert.deepEqual(out.children.map(x=>x.value),values.map(String)); assert.notEqual(out,tree); assert.notEqual(out.children,tree.children); assert.deepEqual(solve({value:null,children:[]},()=>false),{value:false,children:[]});
};
