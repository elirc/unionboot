'use strict';
const assert=require('node:assert/strict');
const {within}=require('@testing-library/react');
const {deferred,manualScheduler,manualSource}=require('../helpers.cjs');
module.exports=async({Component,React,render,fireEvent,act})=>{
const eq=assert.equal,deep=assert.deepEqual;
const props={};
function freeze(x){if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;}
Object.values(props).forEach(freeze);
const source=manualSource(),calls=[];let online=false;props.connection={read:()=>online,subscribe:source.subscribe};props.onSync=x=>calls.push(x);const publish=value=>{online=value;source.emit(value);};
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
eq(out('Network'),'offline');click('Sync');click('Sync');click('Sync');eq(out('Pending'),'no');deep(calls,[]);eq(alert(),'Offline');act(()=>publish(true));eq(out('Syncs'),'0');eq(out('Pending'),'no');act(()=>publish(true));eq(calls.length,0);click('Sync');deep(calls,Array(1).fill(1));eq(view.queryByRole('alert'),null);act(()=>publish(false));eq(out('Network'),'offline');view.unmount();eq(source.active(),0);
};
