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
const input=field('Color');eq(input.getAttribute('aria-expanded'),'false');change('Color','am');eq(view.getAllByRole('option').length,2);input.focus();fireEvent.keyDown(input,{key:'ArrowDown'});eq(document.getElementById(input.getAttribute('aria-activedescendant')).textContent,'Amethyst');eq(document.activeElement,input);fireEvent.keyDown(input,{key:'ArrowDown'});eq(document.getElementById(input.getAttribute('aria-activedescendant')).textContent,'Amethyst');fireEvent.keyDown(input,{key:'Enter'});eq(out('Selection'),'Amethyst');eq(view.queryByRole('listbox'),null);change('Color','zz');eq(input.hasAttribute('aria-activedescendant'),false);assert.ok(view.getByText('No matches'));fireEvent.keyDown(input,{key:'Enter'});fireEvent.keyDown(input,{key:'Escape'});eq(input.value,'zz');change('Color','l');eq(view.queryAllByRole('option').length,1);change('Color','rub');fireEvent.click(view.getByRole('option'));eq(out('Selection'),'Ruby');
};
