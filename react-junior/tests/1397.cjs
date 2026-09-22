const assert=require('node:assert/strict');
const {within}=require('@testing-library/react');
module.exports=async({Component,React,render,fireEvent,act,clock})=>{
const props={};
const view=render(React.createElement(Component,props));
const status=(name)=>view.getByRole('status',{name:name===undefined?'':name}).textContent;
const click=n=>fireEvent.click(view.getByRole('button',{name:n}));
const button=n=>view.getByRole('button',{name:n});
const field=n=>view.getByLabelText(n);
const change=(n,v)=>fireEvent.change(field(n),{target:{value:v}});
clock.useFakeTimers();const vis=()=>status('Visible');assert.equal(vis(),'');click('Play');act(()=>{clock.advanceTimersByTime(450);});assert.equal(vis(),'abc');click('Pause');act(()=>{clock.advanceTimersByTime(500);});assert.equal(vis(),'abc');click('Play');act(()=>{clock.advanceTimersByTime(450);});assert.equal(vis(),'abcdef');assert.equal(status('Label'),'done');assert.equal(button('Play').disabled,true);assert.equal(clock.getTimerCount(),0);click('Reset');assert.equal(vis(),'');assert.equal(status('Label'),'paused');click('Play');act(()=>clock.advanceTimersByTime(150));assert.equal(vis(),'a');view.unmount();assert.equal(clock.getTimerCount(),0);
};
