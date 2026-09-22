'use strict';
const assert=require('node:assert/strict');
const {within}=require('@testing-library/react');
const {deferred,manualScheduler,manualSource}=require('../helpers.cjs');
module.exports=async({Component,React,render,fireEvent,act})=>{
const eq=assert.equal,deep=assert.deepEqual;
const props={};
function freeze(x){if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;}
Object.values(props).forEach(freeze);
const requests=[];props.persist=(id,active)=>{const d=deferred();requests.push({id,active,...d});return d.promise;};
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
eq(out('Active A'),'yes');eq(out('Active E'),'yes');click('Toggle A');eq(out('Active A'),'no');eq(out('Pending'),'1');click('Toggle A');eq(requests.length,1);eq(button('Toggle B').disabled,false);click('Toggle B');eq(out('Pending'),'2');await act(async()=>requests[1].resolve(true));eq(out('Pending'),'1');await act(async()=>requests[0].resolve(false));eq(out('Active A'),'yes');eq(alert(),'Failed A');click('Toggle C');eq(view.queryAllByRole('alert').length,0);await act(async()=>requests.at(-1).reject(Error('offline')));assert.ok(view.getByText('Failed C'));click('Toggle A');eq(view.queryByText('Failed A'),null);await act(async()=>requests.at(-1).resolve(true));eq(out('Active A'),'no');eq(out('Pending'),'0');click('Toggle E');view.unmount();await act(async()=>requests.at(-1).resolve(false));
};
