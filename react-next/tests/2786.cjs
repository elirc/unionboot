'use strict';
const assert=require('node:assert/strict');
const {within}=require('@testing-library/react');
const {deferred,manualScheduler,manualSource}=require('../helpers.cjs');
module.exports=async({Component,React,render,fireEvent,act})=>{
const eq=assert.equal,deep=assert.deepEqual;
const props={};
function freeze(x){if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;}
Object.values(props).forEach(freeze);
const host=document.createElement('aside');document.body.append(host);props.host=host;
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
eq(out('Local'),'0');eq(view.container.querySelector('button'),null);fireEvent.click(within(host).getByRole('button',{name:'Send'}));fireEvent.click(within(host).getByRole('button',{name:'Send'}));eq(out('Local'),'16');eq(out('Parent'),'2');const next=document.createElement('aside');document.body.append(next);rerender({host:next});eq(host.textContent,'');fireEvent.click(within(next).getByRole('button',{name:'Send'}));eq(out('Local'),'24');view.unmount();eq(next.textContent,'');eq(document.body.contains(next),true);
};
