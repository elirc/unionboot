const assert=require('node:assert/strict');
const {within}=require('@testing-library/react');
module.exports=async({Component,React,render,fireEvent,act,clock})=>{
const props={};clock.useFakeTimers();
const view=render(React.createElement(Component,props));
const status=(name)=>view.getByRole('status',{name:name===undefined?'':name}).textContent;
const click=n=>fireEvent.click(view.getByRole('button',{name:n}));
const button=n=>view.getByRole('button',{name:n});
const field=n=>view.getByLabelText(n);
const change=(n,v)=>fireEvent.change(field(n),{target:{value:v}});
clock.useFakeTimers();const sec=()=>status('Seconds');assert.equal(sec(),'0');assert.equal(button('Start').disabled,false);click('Start');assert.equal(button('Start').disabled,true);assert.equal(status('State'),'running');act(()=>{clock.advanceTimersByTime(3000);});assert.equal(sec(),'3');click('Stop');act(()=>{clock.advanceTimersByTime(5000);});assert.equal(sec(),'3');click('Start');act(()=>{clock.advanceTimersByTime(1000);});assert.equal(sec(),'4');click('Reset');assert.equal(sec(),'0');assert.equal(status('State'),'stopped');assert.equal(clock.getTimerCount(),0);click('Start');assert.equal(clock.getTimerCount(),1);view.unmount();assert.equal(clock.getTimerCount(),0);
};
