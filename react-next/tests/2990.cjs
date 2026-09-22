'use strict';
const assert=require('node:assert/strict');
const {within}=require('@testing-library/react');
const {deferred,manualScheduler,manualSource}=require('../helpers.cjs');
module.exports=async({Component,React,render,fireEvent,act})=>{
const eq=assert.equal,deep=assert.deepEqual;
const props={};
function freeze(x){if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;}
Object.values(props).forEach(freeze);
const requests=[];props.pool={load(key){const d=deferred();requests.push({key,...d});return d.promise;}};
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
eq(out('Left'),'idle');click('Load left');click('Load right');await flush();eq(requests.length,1);eq(requests[0].key,'K2');await act(async()=>requests[0].resolve('shared'));eq(out('Left'),'shared');eq(out('Right'),'shared');click('Load right');await flush();eq(requests.length,1);click('Invalidate');click('Load left');await flush();await act(async()=>requests[1].reject(Error('no')));eq(out('Left'),'error');click('Load right');await flush();eq(requests.length,2);eq(out('Right'),'error');click('Invalidate');click('Load right');await flush();eq(requests.length,3);await act(async()=>requests[2].resolve('retry'));eq(out('Right'),'retry');
};
