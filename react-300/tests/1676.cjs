'use strict';
const assert=require('node:assert/strict');
const {within}=require('@testing-library/react');
const {deferred,manualScheduler,manualSource}=require('../helpers.cjs');
module.exports=async({Component,React,render,fireEvent,act})=>{
const eq=assert.equal,deep=assert.deepEqual;
const props={};
function freeze(x){if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;}
Object.values(props).forEach(freeze);
const scheduler=manualScheduler(),calls=[];props.scheduler=scheduler;props.onSave=x=>calls.push(x);
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
eq(out('Dirty'),'clean');eq(scheduler.active(),0);change('Text','a');eq(scheduler.delays.at(-1),300);const stale=scheduler.last();change('Text',' ab ');act(()=>stale());deep(calls,[]);act(()=>scheduler.tick());eq(out('Saved')," ab ");deep(calls,[" ab "]);eq(scheduler.active(),0);change('Text','new');fireEvent.blur(field('Text'));eq(out('Dirty'),'clean');eq(out('Saved'),'new');eq(calls.length,2);change('Text','discard');click('Cancel');eq(field('Text').value,'new');eq(scheduler.active(),0);change('Text','late');view.unmount();eq(scheduler.active(),0);act(()=>scheduler.last()());eq(calls.length,2);
};
