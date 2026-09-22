'use strict';
const assert=require('node:assert/strict');
const {within}=require('@testing-library/react');
const {deferred,manualScheduler,manualSource}=require('../helpers.cjs');
module.exports=async({Component,React,render,fireEvent,act})=>{
const eq=assert.equal,deep=assert.deepEqual;
const props={};
function freeze(x){if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;}
Object.values(props).forEach(freeze);
const mounts=[],unmounts=[];props.onMount=x=>mounts.push(x);props.onUnmount=x=>unmounts.push(x);
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
eq(field('Note A').value,'seed5');deep(mounts,['A']);change('Note A','draft');fireEvent.click(view.getByRole('tab',{name:'B'}));eq(field('Note B').value,'seed5');deep(mounts,['A','B']);deep(unmounts,[]);eq(view.getAllByRole('tabpanel').length,1);fireEvent.click(view.getByRole('tab',{name:'A'}));eq(field('Note A').value,'draft');eq(view.getByRole('tab',{name:'A'}).getAttribute('aria-selected'),'true');eq(mounts.length,2);view.unmount();eq(unmounts.length,mounts.length);
};
