const assert=require('node:assert/strict');
const {within}=require('@testing-library/react');
module.exports=async({Component,React,render,fireEvent,act,clock})=>{
const props={};const pending=[];let calls=0;props.check=()=>{calls++;return new Promise((resolve,reject)=>pending.push({resolve,reject}));};
const view=render(React.createElement(Component,props));
const status=(name)=>view.getByRole('status',{name:name===undefined?'':name}).textContent;
const click=n=>fireEvent.click(view.getByRole('button',{name:n}));
const button=n=>view.getByRole('button',{name:n});
const field=n=>view.getByLabelText(n);
const change=(n,v)=>fireEvent.change(field(n),{target:{value:v}});
clock.useFakeTimers();assert.equal(status(),'idle');click('Start');assert.equal(status(),'Polling…');assert.equal(button('Start').disabled,true);await act(async()=>clock.advanceTimersByTime(200));assert.equal(calls,1);await act(async()=>clock.advanceTimersByTime(600));assert.equal(calls,1);await act(async()=>pending[0].resolve('pending'));await act(async()=>clock.advanceTimersByTime(200));assert.equal(calls,2);await act(async()=>pending[1].resolve('ready'));assert.equal(status(),'Ready');assert.equal(clock.getTimerCount(),0);view.unmount();const second=render(React.createElement(Component,{check:props.check}));fireEvent.click(within(second.container).getByRole('button',{name:'Start'}));await act(async()=>clock.advanceTimersByTime(200));await act(async()=>pending[2].reject(new Error('offline')));assert.equal(within(second.container).getByRole('alert').textContent,'offline');assert.equal(clock.getTimerCount(),0);second.unmount();const third=render(React.createElement(Component,{check:props.check}));fireEvent.click(within(third.container).getByRole('button',{name:'Start'}));await act(async()=>clock.advanceTimersByTime(200));third.unmount();assert.equal(clock.getTimerCount(),0);await act(async()=>pending[3].resolve('ready'));assert.equal(document.body.textContent,'');
};
