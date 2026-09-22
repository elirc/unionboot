'use strict';
const assert=require('node:assert/strict');
const {within}=require('@testing-library/react');
const {deferred,manualScheduler,manualSource}=require('../helpers.cjs');
module.exports=async({Component,React,render,fireEvent,act})=>{
const eq=assert.equal,deep=assert.deepEqual;
const props={"columns":["C1","C2","C3","C4","C5","C6","C7","C8","C9","C10","C11","C12"]};
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
eq(view.getAllByRole('columnheader').length,12);fireEvent.click(field('Show C2'));eq(out('Schema'),props.columns.filter(x=>x!=='C2').join(','));fireEvent.click(field('Show C2'));eq(out('Schema'),props.columns.join(','));for(const c of props.columns.slice(1))fireEvent.click(field('Show '+c));eq(out('Schema'),'C1');eq(field('Show C1').disabled,true);fireEvent.click(field('Show C1'));eq(out('Schema'),'C1');rerender({columns:[...props.columns,'New']});assert.ok(view.getByRole('columnheader',{name:'New'}));eq(field('Show C2').checked,false);
};
