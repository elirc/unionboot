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
eq(out('A'),'2');eq(out('B'),'3');click('Edit');change('Quantity A','4');change('Quantity B','bad');eq(button('Save all').disabled,true);submit();eq(out('A'),'2');change('Quantity B','0');eq(button('Save all').disabled,true);change('Quantity B','3');click('Cancel');eq(out('A'),'2');click('Edit');eq(field('Quantity A').value,'2');change('Quantity A','4');click('Save all');eq(out('A'),'4');eq(out('B'),'3');click('Edit');eq(field('Quantity A').value,'4');change('Quantity A','8');eq(button('Save all').disabled,true);change('Quantity A','1.5');eq(button('Save all').disabled,true);
};
