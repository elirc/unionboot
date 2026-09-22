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
eq(out('State'),'draft');eq(button('Publish draft').disabled,true);change('Title','');eq(button('Publish draft').disabled,true);change('Title',' Ready ');click('Publish draft');eq(out('State'),'review');eq(view.queryByRole('textbox',{name:'Title'}),null);click('Reject');eq(field('Title').value," Ready ");change('Title','Ready');click('Publish draft');click('Approve');eq(out('State'),'published');eq(out('Title'),'Ready');click('Edit');change('Title','Next title');click('Publish draft');click('Approve');click('Archive');eq(out('State'),'archived');eq(view.queryByRole('button',{name:'Edit'}),null);click('Restore');eq(out('State'),'draft');eq(field('Title').value,'Next title');
};
