'use strict';
const assert=require('node:assert/strict');
const {within}=require('@testing-library/react');
const {deferred,manualScheduler,manualSource}=require('../helpers.cjs');
module.exports=async({Component,React,render,fireEvent,act})=>{
const eq=assert.equal,deep=assert.deepEqual;
const props={};
function freeze(x){if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;}
Object.values(props).forEach(freeze);
const scheduler=manualScheduler();props.scheduler=scheduler;
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
eq(out('Count'),'0');eq(scheduler.active(),0);click('Start');eq(button('Start').disabled,true);act(()=>scheduler.tick());eq(out('Count'),'1');const stale=scheduler.last();click('Stop');eq(scheduler.active(),0);act(()=>stale());eq(out('Count'),'1');click('Start');for(let n=0;n<5;n++)act(()=>scheduler.tick());eq(out('Count'),'5');eq(out('State'),'done');eq(scheduler.active(),0);click('Reset');eq(out('Count'),'0');eq(out('State'),'stopped');click('Start');eq(scheduler.active(),1);view.unmount();eq(scheduler.active(),0);act(()=>scheduler.last()());
};
