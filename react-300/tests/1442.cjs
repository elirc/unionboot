'use strict';
const assert=require('node:assert/strict');
const {within}=require('@testing-library/react');
const {deferred,manualScheduler,manualSource}=require('../helpers.cjs');
module.exports=async({Component,React,render,fireEvent,act})=>{
const eq=assert.equal,deep=assert.deepEqual;
const props={"items":["Ax","By","Az","Bw","Av","Bu","At","Bs"]};
function freeze(x){if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;}
Object.values(props).forEach(freeze);

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
deep(list(),["Ax","By"]);eq(button('Prev').disabled,true);click('Next');eq(out('Page'),'2');deep(list(),["Az","Bw"]);change('Query','A');eq(out('Page'),'1');eq(out('Count'),'4');change('Query','Ax');eq(out('Page'),'1');deep(list(),['Ax']);change('Query','');eq(out('Page'),'1');change('Size','3');deep(list(),["Ax","By","Az"]);change('Query','a');eq(out('Count'),'0');rerender({items:[]});eq(out('Page'),'1');eq(button('Next').disabled,true);
};
