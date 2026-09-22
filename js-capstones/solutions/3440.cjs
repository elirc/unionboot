'use strict';
function solve(initial,events){
 if(!Number.isSafeInteger(initial)||initial<0)throw Error('Invalid initial balance');
 const unique=new Map();
 for(const e of events){
  if(!e||typeof e.id!=='string'||!e.id.length||!Number.isSafeInteger(e.revision)||e.revision<1||!Number.isSafeInteger(e.delta))throw Error('Invalid event');
  const old=unique.get(e.id);
  if(old&&(old.revision!==e.revision||old.delta!==e.delta))throw Error('Conflicting event ID');
  if(!old)unique.set(e.id,e);
 }
 const ordered=[...unique.values()].sort((a,b)=>a.revision-b.revision),applied=[];let balance=initial;
 for(const [i,e] of ordered.entries()){
  if(e.revision!==i+1)throw Error('Revision gap or collision');
  balance+=e.delta;if(!Number.isSafeInteger(balance)||balance<0)throw Error('Invalid balance');applied.push(e.id);
 }
 return {balance,revision:ordered.length,applied};
}
module.exports=solve;
