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
eq(out('Validation'),'incomplete');change('Start','2026-10-03');change('End','2026-10-01');eq(out('Validation'),'reversed');change('Start','2026-10-01');change('End','2026-10-03');eq(out('Validation'),'available');click('Reserve');eq(out('Booking'),'2026-10-01/2026-10-03');change('Start','2026-10-05');change('End','2026-10-07');eq(out('Validation'),'blocked');change('Start','2026-10-01');change('End','2026-10-05');eq(out('Validation'),'blocked');eq(button('Reserve').disabled,true);change('Start','');submit();eq(out('Booking'),'2026-10-01/2026-10-03');
};
