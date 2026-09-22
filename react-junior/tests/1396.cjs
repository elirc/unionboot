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
clock.useFakeTimers();const value=()=>status('Value');assert.equal(status(),'Saved');change('Text','a');assert.equal(status(),'Unsaved changes');act(()=>{clock.advanceTimersByTime(200);});change('Text','ab');act(()=>{clock.advanceTimersByTime(300);});assert.equal(value(),'');assert.equal(status(),'Unsaved changes');act(()=>{clock.advanceTimersByTime(450);});assert.equal(value(),'ab');assert.equal(status(),'Saved');change('Text','abc');click('Save now');assert.equal(value(),'abc');assert.equal(status(),'Saved');assert.equal(button('Save now').disabled,true);act(()=>clock.advanceTimersByTime(1000));assert.equal(value(),'abc');change('Text','later');assert.equal(clock.getTimerCount(),1);view.unmount();assert.equal(clock.getTimerCount(),0);
};
