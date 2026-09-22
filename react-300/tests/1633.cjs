'use strict';
const assert=require('node:assert/strict');
const {within}=require('@testing-library/react');
const {deferred,manualScheduler,manualSource}=require('../helpers.cjs');
module.exports=async({Component,React,render,fireEvent,act})=>{
const eq=assert.equal,deep=assert.deepEqual;
const props={};
function freeze(x){if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;}
Object.values(props).forEach(freeze);
const requests=[];props.runJob=(id,signal)=>{const d=deferred();requests.push({id,signal,...d});return d.promise;};
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
eq(out('Remaining'),'7');eq(out('State'),'idle');click('Run');eq(out('Remaining'),'6');eq(requests.length,1);eq(requests[0].id,'A');await act(async()=>requests[0].resolve('ok'));eq(requests.length,2);eq(out('Current'),'B');await act(async()=>requests[1].reject(Error('bad')));eq(out('State'),'error');eq(requests.length,2);deep(list(),['A:ok','B:failed']);const before=requests.length;click('Run');eq(requests[before].id,'A');click('Cancel');eq(requests[before].signal.aborted,true);await act(async()=>requests[before].resolve('late'));eq(out('State'),'idle');eq(requests.length,before+1);click('Run');eq(requests.at(-1).id,'A');view.unmount();eq(requests.at(-1).signal.aborted,true);
};
