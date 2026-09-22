'use strict';
const assert=require('node:assert/strict');
const {within}=require('@testing-library/react');
const {deferred,manualScheduler,manualSource}=require('../helpers.cjs');
module.exports=async({Component,React,render,fireEvent,act})=>{
const eq=assert.equal,deep=assert.deepEqual;
const props={};
function freeze(x){if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;}
Object.values(props).forEach(freeze);
let snapshot=Object.freeze({value:4,revision:0});const source=manualSource();props.store={subscribe:source.subscribe,getSnapshot:()=>snapshot};const publish=value=>{snapshot=Object.freeze({value,revision:snapshot.revision+1});source.emit();};
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
eq(out('Left'),'8');eq(out('Right'),out('Left'));eq(source.active(),3);act(()=>publish(7));eq(out('Left'),'14');eq(out('Right'),out('Left'));eq(out('Revision'),'1');const next=manualSource(),nextStore={subscribe:next.subscribe,getSnapshot:()=>Object.freeze(1)};const fixed=Object.freeze({value:9,revision:8});nextStore.getSnapshot=()=>fixed;rerender({store:nextStore});eq(source.active(),0);eq(out('Left'),'18');eq(out('Revision'),'8');view.unmount();eq(next.active(),0);
};
