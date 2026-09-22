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
clock.useFakeTimers();change('Query','ab');assert.equal(status(),'ab…');act(()=>{clock.advanceTimersByTime(150);});change('Query','abc');assert.equal(status(),'abc…');act(()=>{clock.advanceTimersByTime(200);});assert.equal(status(),'abc…');act(()=>{clock.advanceTimersByTime(200);});assert.equal(status(),'abc');act(()=>{clock.advanceTimersByTime(1000);});assert.equal(status(),'abc');change('Query','');assert.equal(status(),'…');act(()=>{clock.advanceTimersByTime(300);});assert.equal(status(),'');
};
