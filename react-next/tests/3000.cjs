'use strict';
const assert=require('node:assert/strict');
const {within}=require('@testing-library/react');
const {deferred,manualScheduler,manualSource}=require('../helpers.cjs');
module.exports=async({Component,React,render,fireEvent,act})=>{
const eq=assert.equal,deep=assert.deepEqual;
const props={"items":["Item 1","Item 2","Item 3","Item 4","Item 5","Item 6","Item 7","Item 8","Item 9","Item 10","Item 11","Item 12","Item 13","Item 14","Item 15","Item 16","Item 17","Item 18","Item 19","Item 20","Item 21","Item 22","Item 23","Item 24","Item 25","Item 26","Item 27","Item 28","Item 29","Item 30","Item 31","Item 32","Item 33","Item 34","Item 35","Item 36","Item 37","Item 38","Item 39","Item 40"]};
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
eq(out('Start'),'0');deep(list(),props.items.slice(0,3));fireEvent.scroll(view.getByTestId('viewport'),{target:{scrollTop:30}});eq(out('Start'),'3');eq(out('End'),'6');eq(out('Offset'),'30');const first=view.getAllByRole('listitem')[0];eq(first.getAttribute('aria-posinset'),'4');eq(first.getAttribute('aria-setsize'),'40');fireEvent.scroll(view.getByTestId('viewport'),{target:{scrollTop:9999}});eq(out('End'),'40');rerender({items:['Only']});deep(list(),['Only']);eq(out('Start'),'0');rerender({items:[]});deep(list(),[]);eq(out('End'),'0');
};
