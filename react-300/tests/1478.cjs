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
eq(view.getAllByRole('gridcell').length,9);eq(out('Focus'),'Cell1');eq(out('Selection'),'none');eq(button('Cell5').disabled,true);button('Cell1').focus();for(const [key,next] of [["ArrowRight",1],["ArrowDown",1],["ArrowDown",1],["ArrowDown",1],["ArrowLeft",0],["ArrowUp",6]]){fireEvent.keyDown(document.activeElement,{key});eq(document.activeElement,button('Cell'+(next+1)));eq(out('Focus'),'Cell'+(next+1));eq(view.getAllByRole('button').filter(x=>x.tabIndex===0).length,1);}fireEvent.keyDown(document.activeElement,{key:' '});eq(out('Selection'),'Cell7');
};
