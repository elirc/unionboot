'use strict';
function solve(before,after){
 const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
 const equal=(a,b)=>{
  if(a===b)return true;
  if(Array.isArray(a)&&Array.isArray(b))return a.length===b.length&&a.every((v,i)=>equal(v,b[i]));
  if(object(a)&&object(b)){const keys=Object.keys(a);return keys.length===Object.keys(b).length&&keys.every(k=>Object.hasOwn(b,k)&&equal(a[k],b[k]));}
  return false;
 };
 const clone=x=>JSON.parse(JSON.stringify(x)),ops=[];
 function visit(a,b,p){
  if(equal(a,b))return;
  if(object(a)&&object(b)){
   for(const k of [...new Set([...Object.keys(a),...Object.keys(b)])].sort()){
    const q=p+'/'+k.replace(/~/g,'~0').replace(/\//g,'~1');
    if(!Object.hasOwn(b,k))ops.push({op:'remove',path:q});
    else if(!Object.hasOwn(a,k))ops.push({op:'add',path:q,value:clone(b[k])});
    else visit(a[k],b[k],q);
   }
  }else ops.push({op:'replace',path:p,value:clone(b)});
 }
 visit(before,after,'');return ops;
}
module.exports=solve;
