'use strict';
const assert=require('node:assert/strict');
const {within}=require('@testing-library/react');
const {deferred,manualScheduler,manualSource}=require('../helpers.cjs');
module.exports=async({Component,React,render,fireEvent,act})=>{
const eq=assert.equal,deep=assert.deepEqual;
const props={};
function freeze(x){if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;}
Object.values(props).forEach(freeze);
const requests=[];props.saveRow=(id,text)=>{const d=deferred();requests.push({id,text,...d});return d.promise;};
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
eq(out('Saved A'),'one');change('Draft A',' abc ');click('Save A');eq(field('Draft A').disabled,true);eq(button('Save B').disabled,false);change('Draft B','xyz');click('Save B');deep(requests.map(x=>[x.id,x.text]),[['A','abc'],['B','xyz']]);await act(async()=>requests[1].resolve('OKB'));eq(out('Saved B'),'OKB');eq(out('State A'),'saving');await act(async()=>requests[0].reject(Error('bad')));eq(alert(),'Failed A');eq(field('Draft A').value,"one");change('Draft A','retry');click('Save A');eq(view.queryByRole('alert'),null);await act(async()=>requests[2].resolve('OKA'));eq(out('Saved A'),'OKA');eq(out('Saved B'),'OKB');change('Draft A','');eq(button('Save A').disabled,true);change('Draft B','late');click('Save B');view.unmount();await act(async()=>requests.at(-1).resolve('ignored'));
};
