'use strict';
const assert=require('node:assert/strict');
const {within}=require('@testing-library/react');
const {deferred,manualScheduler,manualSource}=require('../helpers.cjs');
module.exports=async({Component,React,render,fireEvent,act})=>{
const eq=assert.equal,deep=assert.deepEqual;
const props={};
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
eq(out('Count'),'0');click('Add');eq(alert(),'invalid');const add=(c,d='item')=>{change('Code',c);change('Description',d);click('Add');};add(' AB ',' bolt ');deep(rowText(),['AB:bolt']);eq(field('Code').value,'');add('AB');eq(alert(),'duplicate');add('ab');eq(out('Count'),'1');eq(alert(),'duplicate');for(let n=1;n<4;n++)add('X'+n);eq(out('Count'),'4');add('ZZ');eq(alert(),'full');eq(field('Code').value,'ZZ');click('Remove AB');eq(view.queryByRole('alert'),null);add('ZZ');eq(out('Count'),'4');const rows=rowText();eq(rows[3],'ZZ:item');
};
