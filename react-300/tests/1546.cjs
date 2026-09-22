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
eq(out('Balance'),'-2');eq(out('Pending'),'none');for(const x of ['','0','1.5','Infinity','11','-7']){change('Amount',x);change('Note','review');eq(button('Stage').disabled,true);submit();eq(out('Pending'),'none');}change('Amount','10');change('Note','');eq(button('Stage').disabled,true);change('Note','review');click('Stage');eq(out('Balance'),'-2');eq(out('Pending'),'10');eq(view.queryByLabelText('Amount'),null);click('Cancel');eq(field('Amount').value,'10');click('Stage');click('Confirm');eq(out('Balance'),'8');eq(field('Amount').value,'');click('Reset');eq(out('Balance'),'-2');
};
