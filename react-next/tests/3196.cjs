'use strict';
const assert=require('node:assert/strict');
const {within}=require('@testing-library/react');
const {deferred,manualScheduler,manualSource}=require('../helpers.cjs');
module.exports=async({Component,React,render,fireEvent,act})=>{
const eq=assert.equal,deep=assert.deepEqual;
const props={};
function freeze(x){if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;}
Object.values(props).forEach(freeze);
const source=manualSource(),requests=[],queries=[];props.permissions={query(name){queries.push(name);return {state:'prompt',subscribe:source.subscribe};},request(name){const d=deferred();requests.push({name,...d});return d.promise;}};
Object.freeze(props);
const view=render(React.createElement(Component,props));
const out=name=>view.getByRole('status',{name,exact:true}).textContent;
const button=name=>view.getByRole('button',{name,exact:true}),click=name=>fireEvent.click(button(name));
const field=name=>view.getByLabelText(name,{exact:true,selector:'input,select,textarea'}),change=(name,value)=>fireEvent.change(field(name),{target:{value}});
const alert=()=>view.getByRole('alert').textContent;
const list=()=>view.queryAllByRole('listitem').map(x=>x.textContent);
const rerender=p=>{Object.values(p).forEach(x=>{if(Array.isArray(x))freeze(x);});view.rerender(React.createElement(Component,p));};
const flush=()=>act(async()=>{});
const pointer=(node,type,data)=>{const e=new window.Event(type,{bubbles:true,cancelable:true});Object.assign(e,data);fireEvent(node,e);};
eq(out('Permission'),'prompt');deep(queries,['capability-8']);eq(button('Use').disabled,true);eq(button('Request').disabled,false);click('Request');eq(requests[0].name,'capability-8');eq(out('Permission'),'requesting');act(()=>source.emit('denied'));await act(async()=>requests[0].resolve('granted'));eq(out('Permission'),'denied');act(()=>source.emit('prompt'));click('Request');await act(async()=>requests[1].reject(Error('blocked')));eq(out('Permission'),'error');click('Request');await act(async()=>requests[2].resolve('granted'));eq(button('Use').disabled,false);click('Use');eq(out('Uses'),'1');act(()=>source.emit('denied'));eq(button('Use').disabled,true);view.unmount();eq(source.active(),0);
};
