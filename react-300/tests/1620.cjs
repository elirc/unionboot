'use strict';
const assert=require('node:assert/strict');
const {within}=require('@testing-library/react');
const {deferred,manualScheduler,manualSource}=require('../helpers.cjs');
module.exports=async({Component,React,render,fireEvent,act})=>{
const eq=assert.equal,deep=assert.deepEqual;
const props={};
function freeze(x){if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;}
Object.values(props).forEach(freeze);
const requests=[];props.loadOne=(id,signal)=>{const d=deferred();requests.push({id,signal,...d});return d.promise;};
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
eq(out('State'),'idle');click('Load');eq(button('Load').disabled,true);await flush();deep(requests.map(x=>x.id),["A","B","C"]);await act(async()=>requests[2].resolve('third'));eq(out('State'),'loading');await act(async()=>requests[0].resolve('first'));await act(async()=>requests[1].reject(Error('bad')));eq(out('State'),'error');deep(list(),[]);eq(alert(),'B');click('Load');await flush();eq(view.queryByRole('alert'),null);click('Cancel');eq(requests[3].signal.aborted,true);await act(async()=>{requests.slice(3).forEach(x=>x.resolve('late'));});eq(out('State'),'idle');deep(list(),[]);rerender({...props,ids:[]});click('Load');await flush();eq(out('State'),'done');eq(requests.length,6);rerender({...props,ids:["A","B","C"]});click('Load');await flush();view.unmount();eq(requests.at(-1).signal.aborted,true);
};
