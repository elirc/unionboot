'use strict';
const assert=require('node:assert/strict');
const {within}=require('@testing-library/react');
const {deferred,manualScheduler,manualSource}=require('../helpers.cjs');
module.exports=async({Component,React,render,fireEvent,act})=>{
const eq=assert.equal,deep=assert.deepEqual;
const props={};
function freeze(x){if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;}
Object.values(props).forEach(freeze);
const made=[],revoked=[];props.blob=new Blob(['x'.repeat(7)]);props.urlAPI={createObjectURL(x){made.push(x);return 'blob:local-'+made.length;},revokeObjectURL(x){revoked.push(x);}};
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
eq(out('URL'),'blob:local-1');eq(made[0].size,7);const second=new Blob(['second']);rerender({...props,blob:second});eq(out('URL'),'blob:local-2');deep(revoked,['blob:local-1']);rerender({...props,blob:null});eq(out('URL'),'blob:local-2');deep(revoked,["blob:local-1"]);view.unmount();deep(revoked,['blob:local-1','blob:local-2']);
};
