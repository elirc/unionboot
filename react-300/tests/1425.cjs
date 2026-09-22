'use strict';
const assert=require('node:assert/strict');
const {within}=require('@testing-library/react');
const {deferred,manualScheduler,manualSource}=require('../helpers.cjs');
module.exports=async({Component,React,render,fireEvent,act})=>{
const eq=assert.equal,deep=assert.deepEqual;
const props={"rows":[{"id":1,"name":"red apple","kind":"fruit","score":4,"archived":false},{"id":2,"name":"green apple","kind":"fruit","score":2,"archived":false},{"id":3,"name":"red chair","kind":"home","score":5,"archived":true},{"id":4,"name":"blue cup","kind":"home","score":3,"archived":false}]};
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
deep(list(),["red apple","green apple","blue cup"]);for(const [q,expected] of [["red apple",["red apple","green apple"]],[" RED  ",["red apple"]],["zz",[]],["",["red apple","green apple","blue cup"]]]){change('Query',q);deep(list(),expected);eq(out('Count'),String(expected.length));}change('Kind','home');deep(list(),["blue cup"]);click('Clear filters');eq(field('Query').value,'');eq(field('Kind').value,'all');rerender({rows:[]});deep(list(),[]);eq(out('Count'),'0');
};
