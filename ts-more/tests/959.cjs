'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const values=[5,5,5]; const tree=Object.freeze({value:10,children:Object.freeze(values.map(value=>Object.freeze({value,children:Object.freeze([])})))}); const seen=[]; const out=solve(tree,x=>{seen.push(x);return String(x);}); assert.deepEqual(seen,[10,...values]); assert.equal(out.value,'10'); assert.deepEqual(out.children.map(x=>x.value),values.map(String)); assert.notEqual(out,tree); assert.notEqual(out.children,tree.children); assert.deepEqual(solve({value:null,children:[]},()=>false),{value:false,children:[]});
};
