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
eq(out('Selected'),'none');const box=view.getByRole('listbox');eq(view.getAllByRole('option').length,10);eq(box.getAttribute('aria-multiselectable'),'true');box.focus();fireEvent.keyDown(box,{key:'ArrowDown'});fireEvent.keyDown(box,{key:' '});eq(out('Selected'),'Item2');fireEvent.keyDown(box,{key:'ArrowUp'});fireEvent.keyDown(box,{key:' '});eq(out('Selected'),'Item1,Item2');eq(document.activeElement,box);eq(document.getElementById(box.getAttribute('aria-activedescendant')).textContent,'Item1');fireEvent.keyDown(box,{key:'a',ctrlKey:true});eq(out('Selected'),Array.from({length:10},(_,i)=>'Item'+(i+1)).join(','));fireEvent.click(view.getByRole('option',{name:'Item2'}));eq(view.getByRole('option',{name:'Item2'}).getAttribute('aria-selected'),'false');click('Clear');eq(out('Selected'),'none');
};
