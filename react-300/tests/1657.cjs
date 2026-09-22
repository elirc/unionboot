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
eq(out('Removed'),'0');click('Open');eq(view.getByRole('dialog').getAttribute('aria-modal'),'true');eq(document.activeElement,field('I understand'));eq(button('Confirm').disabled,true);fireEvent.click(view.getByRole('dialog'));assert.ok(view.getByRole('dialog'));fireEvent.click(field('I understand'));button('Confirm').focus();fireEvent.keyDown(document.activeElement,{key:'Tab'});eq(document.activeElement,field('I understand'));fireEvent.keyDown(document.activeElement,{key:'Tab',shiftKey:true});eq(document.activeElement,button('Confirm'));click('Confirm');eq(out('Removed'),'1');eq(document.activeElement,button('Open'));click('Open');eq(button('Confirm').disabled,true);fireEvent.keyDown(view.getByRole('dialog'),{key:'Escape'});eq(!!view.queryByRole('dialog'),false);click('Open');fireEvent.click(view.getByTestId('backdrop'));eq(!!view.queryByRole('dialog'),false);eq(out('Removed'),'1');
};
