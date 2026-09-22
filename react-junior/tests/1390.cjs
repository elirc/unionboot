const assert=require('node:assert/strict');
const {within}=require('@testing-library/react');
module.exports=async({Component,React,render,fireEvent,act,clock})=>{
const props={"step":1};
const view=render(React.createElement(Component,props));
const status=(name)=>view.getByRole('status',{name:name===undefined?'':name}).textContent;
const click=n=>fireEvent.click(view.getByRole('button',{name:n}));
const button=n=>view.getByRole('button',{name:n});
const field=n=>view.getByLabelText(n);
const change=(n,v)=>fireEvent.change(field(n),{target:{value:v}});
clock.useFakeTimers();const count=()=>status('Count');assert.equal(count(),'0');click('Start');act(()=>{clock.advanceTimersByTime(500);});assert.equal(count(),'5');click('Stop');act(()=>{clock.advanceTimersByTime(400);});assert.equal(count(),'5');click('Start');act(()=>{clock.advanceTimersByTime(200);});assert.equal(count(),'7');view.rerender(React.createElement(Component,{step:5}));act(()=>{clock.advanceTimersByTime(100);});assert.equal(count(),'12');view.unmount();assert.equal(clock.getTimerCount(),0);act(()=>{clock.advanceTimersByTime(1000);});assert.equal(document.body.textContent,'');
};
