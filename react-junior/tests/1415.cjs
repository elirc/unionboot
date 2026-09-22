const assert=require('node:assert/strict');
const {within}=require('@testing-library/react');
module.exports=async({Component,React,render,fireEvent,act,clock})=>{
const props={};const calls=[];props.fetchCombined=async(q,m)=>{calls.push([q,m]);return m+':'+q;};
const view=render(React.createElement(Component,props));
const status=(name)=>view.getByRole('status',{name:name===undefined?'':name}).textContent;
const click=n=>fireEvent.click(view.getByRole('button',{name:n}));
const button=n=>view.getByRole('button',{name:n});
const field=n=>view.getByLabelText(n);
const change=(n,v)=>fireEvent.change(field(n),{target:{value:v}});
assert.equal(status('Result'),'loading');await act(async()=>{});assert.equal(status('Result'),'alpha:');change('Query','x');await act(async()=>{});assert.equal(status('Result'),'alpha:x');change('Mode','beta');await act(async()=>{});assert.equal(status('Result'),'beta:x');assert.deepEqual(calls,[['','alpha'],['x','alpha'],['x','beta']]);change('Query','xy');await act(async()=>{});assert.equal(status('Result'),'beta:xy');view.rerender(React.createElement(Component,{fetchCombined:async()=>{throw Error('offline');}}));await act(async()=>{});assert.equal(status('Result'),'error');assert.equal(view.getByRole('alert').textContent,'offline');
};
