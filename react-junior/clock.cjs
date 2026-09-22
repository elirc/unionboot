'use strict';
const names=['setTimeout','clearTimeout','setInterval','clearInterval'];
const originals=Object.fromEntries(names.map(k=>[k,globalThis[k]]));
let enabled=false,now=0,serial=0;const timers=new Map();
module.exports={
 fn(impl=()=>undefined){const calls=[];const f=(...args)=>{calls.push(args);return impl(...args);};f.mock={calls};return f;},
 useFakeTimers(){if(enabled)return;enabled=true;now=0;serial=0;timers.clear();const schedule=(fn,ms,interval,args)=>{const id=++serial;timers.set(id,{fn,args,at:now+Math.max(1,Number(ms)||0),interval:interval?Math.max(1,Number(ms)||0):0});return id;};globalThis.setTimeout=(fn,ms,...args)=>schedule(fn,ms,false,args);globalThis.setInterval=(fn,ms,...args)=>schedule(fn,ms,true,args);globalThis.clearTimeout=globalThis.clearInterval=id=>timers.delete(id);},
 advanceTimersByTime(ms){if(!enabled)throw Error('Enable fake timers first');const end=now+ms;let steps=0;while(true){let id=null,next=null;for(const [key,timer] of timers)if(timer.at<=end&&(!next||timer.at<next.at)){id=key;next=timer;}if(!next)break;if(++steps>10000)throw Error('Runaway timer');now=next.at;if(next.interval)next.at+=next.interval;else timers.delete(id);next.fn(...next.args);}now=end;},
 getTimerCount(){return timers.size;},
 useRealTimers(){for(const name of names)globalThis[name]=originals[name];timers.clear();enabled=false;}
};
