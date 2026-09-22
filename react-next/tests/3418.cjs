'use strict';
const assert=require('node:assert/strict');
const {within}=require('@testing-library/react');
const {deferred,manualScheduler,manualSource}=require('../helpers.cjs');
module.exports=async({Component,React,render,fireEvent,act})=>{
const eq=assert.equal,deep=assert.deepEqual;
const props={};
function freeze(x){if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;}
Object.values(props).forEach(freeze);

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
eq(out('Rows'),'5');const node=view.getByTestId('viewport'),original=view.getByText('R1');deep(list(),['R1','R2','R3','R4','R5']);node.scrollTop=25;click('Prepend');eq(node.scrollTop,125);eq(out('Rows'),'15');deep(list(),[...Array.from({length:10},(_,i)=>'N'+(i+1)),'R1','R2','R3','R4','R5']);eq(view.getByText('R1'),original);eq(original.style.height,'10px');click('Toggle marker');eq(node.scrollTop,125);click('Prepend');eq(node.scrollTop,225);eq(out('Rows'),'25');deep(list().slice(0,10),Array.from({length:10},(_,i)=>'N'+(i+11)));eq(view.getByText('R1'),original);
};
