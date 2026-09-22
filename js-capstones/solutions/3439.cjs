'use strict';
function solve(base,local,remote){
 const missing=Symbol('missing'),read=(o,k)=>Object.hasOwn(o,k)?o[k]:missing;
 const entries=[],conflicts=[];
 for(const k of [...new Set([...Object.keys(base),...Object.keys(local),...Object.keys(remote)])].sort()){
  const b=read(base,k),l=read(local,k),r=read(remote,k);let selected;
  if(l===r)selected=l;else if(l===b)selected=r;else if(r===b)selected=l;else{conflicts.push(k);selected=l;}
  if(selected!==missing)entries.push([k,selected]);
 }
 return {value:Object.fromEntries(entries),conflicts};
}
module.exports=solve;
