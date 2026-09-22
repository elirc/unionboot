const assert=require('node:assert/strict');
module.exports=async({Component,React,render,fireEvent,act})=>{
const props={};let resolve;props.load=()=>new Promise(r=>{resolve=r;});
const view=render(React.createElement(Component,props));
assert.equal(view.getByRole('status').textContent,'idle');fireEvent.click(view.getByText('Load'));assert.equal(view.getByText('Load').disabled,true);await act(async()=>resolve('result1'));assert.equal(view.getByRole('status').textContent,'result1');assert.equal(view.getByText('Load').disabled,false);view.rerender(React.createElement(Component,{load:()=>Promise.reject(new Error('offline'))}));await act(async()=>fireEvent.click(view.getByText('Load')));assert.equal(view.getByRole('alert').textContent,'offline');

};
