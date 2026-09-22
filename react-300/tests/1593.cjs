'use strict';
const assert=require('node:assert/strict');
const {within}=require('@testing-library/react');
const {deferred,manualScheduler,manualSource}=require('../helpers.cjs');
module.exports=async({Component,React,render,fireEvent,act})=>{
const eq=assert.equal,deep=assert.deepEqual;
const props={};
function freeze(x){if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;}
Object.values(props).forEach(freeze);
const requests=[];props.load=(key,signal)=>{const d=deferred();requests.push({key,signal,...d});return d.promise;};
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
eq(out('State'),'loading');await flush();eq(requests[0].key,'A');rerender({...props,resourceKey:'B'});await flush();eq(requests[0].signal.aborted,true);await act(async()=>requests[1].resolve('new'));eq(out('Data'),'new');await act(async()=>requests[0].reject(Error('stale')));eq(view.queryByRole('alert'),null);click('Retry');eq(out('Data'),"new");await flush();await act(async()=>requests[2].reject(null));eq(out('State'),'error');eq(alert(),"error");click('Retry');await flush();eq(view.queryByRole('alert'),null);await act(async()=>requests[3].resolve('recovered'));rerender({...props,resourceKey:''});await flush();eq(requests.length,5);eq(requests[4].key,'');view.unmount();eq(requests.at(-1).signal.aborted,true);await act(async()=>requests.at(-1).resolve('late'));
};
