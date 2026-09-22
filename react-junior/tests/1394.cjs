const assert=require('node:assert/strict');
const {within}=require('@testing-library/react');
module.exports=async({Component,React,render,fireEvent,act,clock})=>{
const props={};const pending={},calls=[];props.fetchOne=id=>{calls.push(id);return new Promise((resolve,reject)=>pending[id]={resolve,reject});};
const view=render(React.createElement(Component,props));
const status=(name)=>view.getByRole('status',{name:name===undefined?'':name}).textContent;
const click=n=>fireEvent.click(view.getByRole('button',{name:n}));
const button=n=>view.getByRole('button',{name:n});
const field=n=>view.getByLabelText(n);
const change=(n,v)=>fireEvent.change(field(n),{target:{value:v}});
assert.equal(status(),'idle');click('Load');assert.equal(status(),'loading');assert.equal(button('Load').disabled,true);await act(async()=>{});assert.deepEqual(calls,[1,2,3]);await act(async()=>pending[3].resolve('v3'));await act(async()=>pending[1].resolve('v1'));assert.equal(status(),'loading');await act(async()=>pending[2].reject(new Error('bad')));assert.equal(status(),'v1|(failed)|v3');assert.equal(view.getByRole('alert').textContent,'2');assert.equal(button('Load').disabled,false);view.rerender(React.createElement(Component,{fetchOne:async id=>'v'+id,ids:[3,1]}));await act(async()=>click('Load'));assert.equal(status(),'v3|v1');assert.equal(view.queryByRole('alert'),null);view.rerender(React.createElement(Component,{fetchOne:props.fetchOne,ids:[]}));await act(async()=>click('Load'));assert.equal(status(),'');
};
