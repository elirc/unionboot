'use strict';
const assert=require('node:assert/strict');
const {within}=require('@testing-library/react');
const {deferred,manualScheduler,manualSource}=require('../helpers.cjs');
module.exports=async({Component,React,render,fireEvent,act})=>{
const eq=assert.equal,deep=assert.deepEqual;
const props={};
function freeze(x){if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;}
Object.values(props).forEach(freeze);

const view=render(React.createElement(Component,props));
const out=name=>view.getByRole('status',{name,exact:true}).textContent;
const button=name=>view.getByRole('button',{name,exact:true}),click=name=>fireEvent.click(button(name));
const field=name=>view.getByLabelText(name,{exact:true,selector:'input,select,textarea'}),change=(name,value)=>fireEvent.change(field(name),{target:{value}});
const alert=()=>view.getByRole('alert').textContent;
const list=()=>view.queryAllByRole('listitem').map(x=>x.textContent);
const rowText=name=>within(view.getByRole('list',name===undefined?{}:{name,exact:true})).queryAllByRole('listitem').map(x=>x.querySelector('span')?.textContent??x.textContent);
const submit=()=>fireEvent.submit(view.container.querySelector('form'));
const rerender=p=>view.rerender(React.createElement(Component,p));
const flush=()=>act(async()=>{});
eq(button('Actions').getAttribute('aria-expanded'),'false');click('Actions');const items=view.getAllByRole('menuitem');eq(items[1].disabled,true);eq(document.activeElement,items[0]);fireEvent.keyDown(document.activeElement,{key:'End'});eq(document.activeElement,items[2]);fireEvent.keyDown(document.activeElement,{key:'ArrowDown'});eq(document.activeElement,items[2]);fireEvent.keyDown(document.activeElement,{key:'Home'});fireEvent.keyDown(document.activeElement,{key:'Enter'});eq(out('Chosen'),'Copy');fireEvent.keyDown(document.activeElement,{key:'Escape'});eq(view.queryByRole('menu'),null);eq(document.activeElement,button('Actions'));
};
