// 1826 Wildcard topic bus / scenario 8 — order=forward; live=true; errors=throw
// Prompt: ../prompts/1826.txt
'use strict';
const assert=require('node:assert/strict');
const cfg={"order":"forward","live":true,"errors":"throw"};
module.exports=async solve=>{
const eq=assert.equal,deep=assert.deepEqual;
function check(input,expected){const before=structuredClone(input);deep(solve(input),expected);deep(input,before,'Input must not mutate');}
const bus=solve();deep(bus.emit('a',1),{delivered:0,errors:[]});const calls=[];const registrations=[['a.*','single',1],['a.**','many',3],['**','all',2],['a','exact',0]];for(const [pattern,id,priority] of registrations)bus.subscribe(pattern,(value,topic)=>calls.push([id,value,topic]),priority);const sorted=(rows)=>[...rows].sort((a,b)=>cfg.order==='priority'?b[2]-a[2]:cfg.order==='reverse'?registrations.indexOf(b)-registrations.indexOf(a):registrations.indexOf(a)-registrations.indexOf(b));deep(bus.emit('a.b',7),{delivered:3,errors:[]});deep(calls,sorted(registrations.slice(0,3)).map(x=>[x[1],7,'a.b']));calls.length=0;bus.emit('a',8);deep(calls,sorted(registrations.slice(1)).map(x=>[x[1],8,'a']));
 const mutation=solve(),log=[];let offB;const a=()=>{log.push('A');offB();mutation.subscribe('x',()=>log.push('late'));};if(cfg.order==='reverse'){offB=mutation.subscribe('x',()=>log.push('B'));mutation.subscribe('x',a);}else{mutation.subscribe('x',a,9);offB=mutation.subscribe('x',()=>log.push('B'));}mutation.emit('x',0);deep(log,cfg.live?['A']:['A','B']);offB();
 const broken=solve();broken.subscribe('x',()=>{throw Error('boom');});if(cfg.errors==='throw')assert.throws(()=>broken.emit('x',1),/boom/);else deep(broken.emit('x',1),{delivered:1,errors:['boom']});deep(solve().emit('x',0),{delivered:0,errors:[]});
};
