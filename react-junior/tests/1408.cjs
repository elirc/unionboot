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
const writeText=clock.fn(()=>Promise.resolve());Object.defineProperty(navigator,'clipboard',{value:{writeText},configurable:true});click('Copy');await act(async()=>{});assert.equal(writeText.mock.calls.length,1);assert.equal(writeText.mock.calls[0][0],'props-text');assert.equal(status(),'copied');Object.defineProperty(navigator,'clipboard',{value:{writeText:clock.fn(()=>Promise.reject(new Error('denied')))},configurable:true});click('Copy');await act(async()=>{});assert.equal(view.getByRole('alert').textContent,'Copy failed');assert.equal(status(),'failed');
};
