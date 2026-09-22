'use strict';
const assert=require('node:assert/strict');
const {within}=require('@testing-library/react');
const {deferred,manualScheduler,manualSource}=require('../helpers.cjs');
module.exports=async({Component,React,render,fireEvent,act})=>{
const eq=assert.equal,deep=assert.deepEqual;
const props={"sources":["/asset-0.png","/asset-1.png","/asset-2.png","/asset-3.png","/asset-4.png","/asset-5.png","/asset-6.png","/asset-7.png"]};
function freeze(x){if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;}
Object.values(props).forEach(freeze);

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
eq(view.getByRole('img').getAttribute('src'),'/asset-0.png');eq(props.sources.length,8);fireEvent.load(view.getByRole('img'));eq(out('Loaded'),'yes');fireEvent.error(view.getByRole('img'));eq(out('Index'),'1');eq(out('Loaded'),'no');rerender({sources:['/new-0.png','/new-1.png']});eq(out('Index'),'1');eq(view.getByRole('img').getAttribute('src'),'/new-1.png');for(let i=1;i<2;i++)fireEvent.error(view.getByRole('img'));eq(alert(),'No image');eq(view.queryByRole('img'),null);rerender(props);eq(out('Index'),'2');
};
