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
eq(out('Gesture'),'idle');const node=button('Drag handle'),captured=[],released=[];node.setPointerCapture=id=>captured.push(id);node.releasePointerCapture=id=>released.push(id);pointer(node,'pointerdown',{pointerId:7,button:0,clientX:0,clientY:0});eq(out('Gesture'),'pressed');pointer(node,'pointermove',{pointerId:8,clientX:999,clientY:999});eq(out('Gesture'),'pressed');pointer(node,'pointermove',{pointerId:7,clientX:34});eq(out('Gesture'),'pressed');pointer(node,'pointermove',{pointerId:7,clientX:35});eq(out('Gesture'),'dragging');pointer(node,'pointerup',{pointerId:7});eq(out('Gesture'),'dropped');deep(captured,[7]);deep(released,[7]);pointer(node,'pointerdown',{pointerId:9,button:0,clientX:0,clientY:0});pointer(node,'pointercancel',{pointerId:9});eq(out('Gesture'),'canceled');deep(released,[7,9]);
};
