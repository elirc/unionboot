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
eq(out('Order'),"A>B>C>D>E>F>G>H>I>J>K>L");for(const [name,delta,expected] of [["A",-1,["A","B","C","D","E","F","G","H","I","J","K","L"]],["C",-1,["A","C","B","D","E","F","G","H","I","J","K","L"]],["C",1,["A","B","C","D","E","F","G","H","I","J","K","L"]],["A",1,["B","A","C","D","E","F","G","H","I","J","K","L"]],["A",1,["B","C","A","D","E","F","G","H","I","J","K","L"]]]){click((delta<0?'Up ':'Down ')+name);deep(rowText(),expected);eq(out('Order'),expected.join('>'));}click('Reset');deep(rowText(),["A","B","C","D","E","F","G","H","I","J","K","L"]);
};
