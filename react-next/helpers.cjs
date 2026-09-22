'use strict';
function deferred(){let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b;});return {promise,resolve,reject};}
function manualScheduler(){const tasks=new Set(),history=[],delays=[];const add=(fn,repeat)=>{const task={fn,repeat};tasks.add(task);history.push(fn);return()=>tasks.delete(task);};return {delays,after(ms,fn){delays.push(ms);return add(fn,false);},every(fn){return add(fn,true);},tick(){for(const task of [...tasks]){if(!tasks.has(task))continue;if(!task.repeat)tasks.delete(task);task.fn();}},active(){return tasks.size;},last(){return history.at(-1)||(()=>{});}};}
function manualSource(){const listeners=new Set(),history=[];return {subscribe(fn){listeners.add(fn);history.push(fn);return()=>listeners.delete(fn);},emit(value){for(const fn of [...listeners])fn(value);},active(){return listeners.size;},last(){return history.at(-1)||(()=>{});}};}
module.exports={deferred,manualScheduler,manualSource};
