'use strict';
const assert=require('node:assert/strict');
const {within}=require('@testing-library/react');
const {deferred,manualScheduler,manualSource}=require('../helpers.cjs');
module.exports=async({Component,React,render,fireEvent,act})=>{
const eq=assert.equal,deep=assert.deepEqual;
const props={};
function freeze(x){if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;}
Object.values(props).forEach(freeze);
const requests=[];props.check=(text,signal)=>{const d=deferred();requests.push({text,signal,...d});return d.promise;};
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
eq(out('Result'),'idle');eq(button('Check').disabled,true);change('Handle','aaa');eq(button('Check').disabled,true);change('Handle',' aaaa ');click('Check');eq(requests[0].text,"AAAA");click('Check');eq(requests[0].signal.aborted,true);await act(async()=>requests[1].resolve(true));eq(out('Result'),'available');await act(async()=>requests[0].resolve(false));eq(out('Result'),'available');click('Check');change('Handle','bbbb');eq(requests[2].signal.aborted,true);await act(async()=>requests[2].reject(Error('late')));eq(out('Result'),'idle');click('Check');await act(async()=>requests[3].reject(Error('offline')));eq(alert(),'Check failed');click('Check');eq(view.queryByRole('alert'),null);click('Cancel');eq(out('Result'),'idle');eq(requests[4].signal.aborted,true);await act(async()=>requests[4].resolve(true));eq(out('Result'),'idle');click('Check');view.unmount();eq(requests.at(-1).signal.aborted,true);
};
