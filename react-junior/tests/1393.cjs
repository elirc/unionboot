const assert=require('node:assert/strict');
const {within}=require('@testing-library/react');
module.exports=async({Component,React,render,fireEvent,act,clock})=>{
const props={};const calls=[],pending=[];props.runTask=job=>{calls.push(job);return new Promise((resolve,reject)=>pending.push({resolve,reject}));};
const view=render(React.createElement(Component,props));
const status=(name)=>view.getByRole('status',{name:name===undefined?'':name}).textContent;
const click=n=>fireEvent.click(view.getByRole('button',{name:n}));
const button=n=>view.getByRole('button',{name:n});
const field=n=>view.getByLabelText(n);
const change=(n,v)=>fireEvent.change(field(n),{target:{value:v}});
assert.equal(status(),'idle');click('Start');assert.equal(status(),'loading');assert.equal(button('Start').disabled,false);view.rerender(React.createElement(Component,{runTask:props.runTask,job:2}));click('Start');assert.deepEqual(calls,[1,2]);await act(async()=>pending[1].resolve('fast'));assert.equal(status(),'DONE:fast');await act(async()=>pending[0].resolve('slow'));assert.equal(status(),'DONE:fast');click('Start');click('Start');await act(async()=>pending[2].reject(new Error('stale')));assert.equal(view.queryByRole('alert'),null);assert.equal(status(),'loading');await act(async()=>pending[3].reject(new Error('offline')));assert.equal(status(),'error');assert.equal(view.getByRole('alert').textContent,'offline');click('Start');assert.equal(view.queryByRole('alert'),null);await act(async()=>pending[4].resolve('retry'));assert.equal(status(),'DONE:retry');
};
