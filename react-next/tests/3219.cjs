'use strict';
const assert=require('node:assert/strict');
const {within}=require('@testing-library/react');
const {deferred,manualScheduler,manualSource}=require('../helpers.cjs');
module.exports=async({Component,React,render,fireEvent,act})=>{
const eq=assert.equal,deep=assert.deepEqual;
const props={};
function freeze(x){if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;}
Object.values(props).forEach(freeze);
const calls=[];props.loadPage=cursor=>{const d=deferred();calls.push({cursor,...d});return d.promise;};
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
eq(out('Page'),'');click('Load first');eq(calls[0].cursor,null);eq(out('Busy'),'yes');await act(async()=>calls[0].resolve({text:'One',next:'token-1'}));click('Next');eq(calls[1].cursor,'token-1');await act(async()=>calls[1].reject(Error('offline')));eq(alert(),'Page failed');eq(out('Page'),'One');click('Next');eq(view.queryByRole('alert'),null);await act(async()=>calls[2].resolve({text:'Two',next:null}));eq(out('Page'),'Two');eq(button('Next').disabled,true);click('Back');eq(out('Page'),'One');click('Next');await flush();eq(calls.length,4);await act(async()=>calls[3].resolve({text:'Two',next:null}));eq(out('Page'),'Two');view.unmount();
};
