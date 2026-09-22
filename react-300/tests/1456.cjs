'use strict';
const assert=require('node:assert/strict');
const {within}=require('@testing-library/react');
const {deferred,manualScheduler,manualSource}=require('../helpers.cjs');
module.exports=async({Component,React,render,fireEvent,act})=>{
const eq=assert.equal,deep=assert.deepEqual;
const props={"rows":[{"id":"A","value":8},{"id":"B","value":3},{"id":"C","value":5},{"id":"D","value":1}]};
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
eq(out('Value'),'0');fireEvent.click(field('Pick A'));fireEvent.click(field('Pick B'));eq(out('Selection'),'A,B');eq(out('Value'),'11');rerender({rows:props.rows.slice(1)});eq(out('Selection'),'B');eq(out('Value'),'3');rerender(props);eq(out('Value'),'3');click('Clear');eq(out('Selection'),'');eq(out('Value'),'0');for(const id of ['D','C','B','A'].slice(0,3))fireEvent.click(field('Pick '+id));eq(out('Selection'),['D','C','B','A'].slice(0,3).join(','));
};
