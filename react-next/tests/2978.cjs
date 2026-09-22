'use strict';
const assert=require('node:assert/strict');
const {within}=require('@testing-library/react');
const {deferred,manualScheduler,manualSource}=require('../helpers.cjs');
module.exports=async({Component,React,render,fireEvent,act})=>{
const eq=assert.equal,deep=assert.deepEqual;
const props={};
function freeze(x){if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;}
Object.values(props).forEach(freeze);
const source=manualSource(),scheduler=manualScheduler(),delivered=[];props.source=source;props.scheduler=scheduler;props.onDeliver=x=>delivered.push(x);
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
eq(out('Count'),'0');act(()=>{source.emit('A');source.emit('B');source.emit('C');});deep(delivered,['A']);eq(out('Delivered'),'A');deep(scheduler.delays,[250]);act(()=>scheduler.tick());deep(delivered,["A","C"]);eq(out('Count'),'2');act(()=>source.emit('D'));eq(out('Delivered'),'D');const old=scheduler.last();view.unmount();eq(source.active(),0);eq(scheduler.active(),0);act(()=>old());eq(delivered.length,3);
};
