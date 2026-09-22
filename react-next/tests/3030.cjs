'use strict';
const assert=require('node:assert/strict');
const {within}=require('@testing-library/react');
const {deferred,manualScheduler,manualSource}=require('../helpers.cjs');
module.exports=async({Component,React,render,fireEvent,act})=>{
const eq=assert.equal,deep=assert.deepEqual;
const props={};
function freeze(x){if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;}
Object.values(props).forEach(freeze);
const source=manualSource(),sent=[];props.socket={subscribe:source.subscribe,send:x=>sent.push(x)};
Object.freeze(props);
const view=render(React.createElement(Component,props));
const out=name=>view.getByRole('status',{name,exact:true}).textContent;
const button=name=>view.getByRole('button',{name,exact:true}),click=name=>fireEvent.click(button(name));
const field=name=>view.getByLabelText(name,{exact:true,selector:'input,select,textarea'}),change=(name,value)=>fireEvent.change(field(name),{target:{value}});
const alert=()=>view.getByRole('alert').textContent;
const list=()=>view.queryAllByRole('listitem').map(x=>x.textContent);
const rerender=p=>{Object.values(p).forEach(x=>{if(Array.isArray(x))freeze(x);});view.rerender(React.createElement(Component,p));};
const flush=()=>act(async()=>{});
const pointer=(node,type,data)=>{const e=new window.Event(type,{bubbles:true,cancelable:true});Object.assign(e,data);fireEvent(node,e);};
eq(out('State'),'closed');for(let i=0;i<3;i++)click('Send');eq(out('Queued'),'2');eq(out('Rejected'),'1');deep(sent,[]);act(()=>source.emit({type:'open'}));deep(sent,Array.from({length:2},(_,i)=>'m'+(i+3)));eq(out('Queued'),'0');act(()=>source.emit({type:'open'}));eq(sent.length,2);click('Send');eq(sent.at(-1),'m5');act(()=>source.emit({type:'message',data:'hello'}));eq(out('Received'),'hello');act(()=>source.emit({type:'close'}));eq(out('State'),'closed');click('Send');eq(out('Queued'),'1');eq(out('Rejected'),'1');act(()=>source.emit({type:'open'}));eq(sent.at(-1),'m6');act(()=>source.emit({type:'unknown',data:'ignored'}));eq(out('Received'),'hello');view.unmount();eq(source.active(),0);
};
